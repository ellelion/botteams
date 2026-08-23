import { SPONSOR_SLOTS_TOTAL } from "@/data/sponsors";
import { databaseUrl } from "@/lib/db";
import {
  getPaymentBySessionId,
  incrementReviewAttempt,
  isPaymentExpired,
  isSetupOpen,
  markNeedsHuman,
  markPaymentSetup,
  publishLiveSlot,
  upsertPaidSession,
} from "@/lib/rail-db";
import { getRailInventory } from "@/lib/rail-inventory";
import { buyerReasons, deterministicRejects, normalizeHref, publicUrlReject, reviewListing } from "@/lib/rail-review";
import { storeRailMark } from "@/lib/rail-upload";
import { isRailSessionMeta } from "@/lib/rail";
import { site } from "@/lib/site";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_REVIEWS = 3;

function safeOrigin(request: Request): string {
  const canonical = new URL(site.url);
  try {
    const url = new URL(request.url);
    const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (local || url.hostname === canonical.hostname) return url.origin;
  } catch {
    /* fall through */
  }
  return canonical.origin;
}

async function loadPaidPayment(sessionId: string) {
  const existing = await getPaymentBySessionId(sessionId);
  if (existing) return existing;
  const session = await stripe().checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") return null;
  if (!isRailSessionMeta(session.metadata)) {
    return null;
  }
  return upsertPaidSession(session);
}

async function notifyNeedsHuman(input: {
  sessionId: string;
  email: string;
  title: string;
  href: string;
}): Promise<"sent" | "skipped" | "failed"> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.SPONSOR_NOTIFY_FROM;
  const lines = [
    `Session: ${input.sessionId}`,
    `Email: ${input.email}`,
    `Title: ${input.title}`,
    `URL: ${input.href}`,
    "",
    "Three automated reviews failed. Not listed. Our team will review the listing and get back to the buyer shortly.",
  ].join("\n");
  console.log("[rail-setup] needs_human", JSON.stringify(input));
  if (!key || !from) return "skipped";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [site.email],
        subject: `Rail listing needs a human: ${input.title || "unnamed"}`,
        text: lines,
      }),
    });
    return res.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}

export async function POST(request: Request) {
  if (!databaseUrl() || !process.env.STRIPE_SECRET_KEY) {
    return Response.json({ error: "Setup is not configured yet." }, { status: 503 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Send the form as multipart." }, { status: 400 });
  }

  const sessionId = String(form.get("session_id") ?? "").trim();
  const title = String(form.get("title") ?? "");
  const line = String(form.get("line") ?? "");
  const href = normalizeHref(String(form.get("href") ?? ""));
  const image = form.get("image");

  if (!sessionId.startsWith("cs_")) {
    return Response.json({ error: "Missing checkout session." }, { status: 400 });
  }

  const payment = await loadPaidPayment(sessionId);
  if (!payment) {
    return Response.json({ error: "This payment is not ready." }, { status: 403 });
  }
  if (payment.status === "live") {
    return Response.json({ ok: true, live: true, remaining: 0 });
  }
  if (payment.status === "needs_human") {
    return Response.json({
      ok: false,
      needsHuman: true,
      remaining: 0,
      reasons: [],
    });
  }
  if (isPaymentExpired(payment) || !isSetupOpen(payment)) {
    return Response.json({ error: "This payment cannot be used." }, { status: 403 });
  }
  if (payment.attempts >= MAX_REVIEWS) {
    return Response.json({
      ok: false,
      needsHuman: true,
      remaining: 0,
      reasons: [],
    });
  }

  const filled = (await getRailInventory()).filled;
  if (filled >= SPONSOR_SLOTS_TOTAL) {
    return Response.json({ error: "Every paying slot is taken." }, { status: 409 });
  }

  const hasImage = image instanceof File && image.size > 0;
  const cheap = deterministicRejects({ title, line, href }, hasImage);
  if (href.trim()) {
    const liveUrl = await publicUrlReject(href.trim());
    if (liveUrl && !cheap.includes(liveUrl)) cheap.push(liveUrl);
  }
  if (cheap.length > 0) {
    return Response.json({
      ok: false,
      remaining: MAX_REVIEWS - payment.attempts,
      reasons: buyerReasons(cheap),
    });
  }

  if (!(image instanceof File)) {
    return Response.json({
      ok: false,
      remaining: MAX_REVIEWS - payment.attempts,
      reasons: buyerReasons(["missing_field"]),
    });
  }

  const stored = await storeRailMark(image, safeOrigin(request));
  if ("error" in stored) {
    return Response.json({
      ok: false,
      remaining: MAX_REVIEWS - payment.attempts,
      reasons: buyerReasons([stored.error]),
    });
  }

  await markPaymentSetup(payment.id);

  let review;
  try {
    review = await reviewListing({
      title: title.trim(),
      line: line.trim(),
      href: href.trim(),
      markUrl: stored.url,
      markBytes: stored.bytes,
      markMediaType: stored.mediaType,
      svgText: stored.svgText,
    });
  } catch (error) {
    console.error("[rail-setup] review failed", error);
    return Response.json({ error: "The review did not run. Try again." }, { status: 502 });
  }

  const after = await incrementReviewAttempt(payment.id);
  const remaining = Math.max(0, MAX_REVIEWS - after.attempts);

  if (review.ok) {
    const published = await publishLiveSlot({
      paymentId: payment.id,
      name: title.trim(),
      line: line.trim(),
      href: href.trim(),
      markUrl: stored.url,
    });
    if (!published.ok) {
      return Response.json(
        { error: published.reason === "full" ? "Every paying slot is taken." : "This payment cannot be used." },
        { status: published.reason === "full" ? 409 : 403 },
      );
    }
    return Response.json({ ok: true, live: true, remaining });
  }

  if (after.attempts >= MAX_REVIEWS) {
    await markNeedsHuman(payment.id);
    await notifyNeedsHuman({
      sessionId: payment.stripeSessionId,
      email: payment.email,
      title: title.trim(),
      href: href.trim(),
    });
    return Response.json({
      ok: false,
      needsHuman: true,
      remaining: 0,
      reasons: buyerReasons(review.reasons),
    });
  }

  return Response.json({
    ok: false,
    remaining,
    reasons: buyerReasons(review.reasons),
  });
}
