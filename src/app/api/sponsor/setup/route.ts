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
import { buyerReasons, deterministicRejects, normalizeHref, reviewListing } from "@/lib/rail-review";
import { deleteRailMark, storeRailMark, validateRailMark } from "@/lib/rail-upload";
import { isRailSessionMeta } from "@/lib/rail";
import { RequestTooLargeError, requestWithLimitedBody } from "@/lib/request-limits";
import { site } from "@/lib/site";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_REVIEWS = 3;
const MAX_FORM_BYTES = 600 * 1024;

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
    form = await (await requestWithLimitedBody(request, MAX_FORM_BYTES)).formData();
  } catch (error) {
    if (error instanceof RequestTooLargeError) {
      return Response.json({ error: "The submitted form is too large." }, { status: 413 });
    }
    return Response.json({ error: "Send the form as multipart." }, { status: 400 });
  }

  const sessionId = String(form.get("session_id") ?? "").trim();
  const title = String(form.get("title") ?? "");
  const line = String(form.get("line") ?? "");
  const href = normalizeHref(String(form.get("href") ?? ""));
  const image = form.get("image");

  if (!sessionId.startsWith("cs_") || sessionId.length > 255) {
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

  const mark = await validateRailMark(image);
  if ("error" in mark) {
    return Response.json({
      ok: false,
      remaining: MAX_REVIEWS - payment.attempts,
      reasons: buyerReasons([mark.error]),
    });
  }

  await markPaymentSetup(payment.id);

  let review;
  try {
    review = await reviewListing({
      title: title.trim(),
      line: line.trim(),
      href: href.trim(),
      markBytes: mark.bytes,
      markMediaType: mark.mediaType,
    });
  } catch (error) {
    console.error("[rail-setup] review failed", error);
    return Response.json({ error: "The review did not run. Try again." }, { status: 502 });
  }

  let markUrl: string | null = null;
  if (review.ok) {
    try {
      markUrl = await storeRailMark(mark);
    } catch (error) {
      console.error("[rail-setup] mark storage failed", error);
      return Response.json({ error: "The mark could not be stored. Try again." }, { status: 502 });
    }
  }

  const cleanupMark = async () => {
    if (!markUrl) return;
    await deleteRailMark(markUrl).catch((error) => console.error("[rail-setup] orphan mark cleanup failed", error));
  };

  let after: Awaited<ReturnType<typeof incrementReviewAttempt>>;
  try {
    after = await incrementReviewAttempt(payment.id);
  } catch (error) {
    await cleanupMark();
    console.error("[rail-setup] attempt update failed", error);
    return Response.json({ error: "The review result could not be saved. Try again." }, { status: 502 });
  }
  const remaining = Math.max(0, MAX_REVIEWS - after.attempts);

  if (review.ok) {
    if (!markUrl) {
      return Response.json({ error: "The mark could not be stored. Try again." }, { status: 502 });
    }
    try {
      const published = await publishLiveSlot({
        paymentId: payment.id,
        name: title.trim(),
        line: line.trim(),
        href: href.trim(),
        markUrl,
      });
      if (!published.ok) {
        await cleanupMark();
        return Response.json(
          { error: published.reason === "full" ? "Every paying slot is taken." : "This payment cannot be used." },
          { status: published.reason === "full" ? 409 : 403 },
        );
      }
    } catch (error) {
      await cleanupMark();
      console.error("[rail-setup] publish failed", error);
      return Response.json({ error: "The listing could not be published. Try again." }, { status: 502 });
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
