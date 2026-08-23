import { SPONSOR_SLOTS_TOTAL } from "@/data/sponsors";
import { databaseUrl } from "@/lib/db";
import { getRailInventory } from "@/lib/rail-inventory";
import { RAIL_BRAND, RAIL_PLACEMENT, RAIL_PLANS, isRailInterval, railPlan } from "@/lib/rail";
import { railIntegrationIdentifier, railPriceId, stripe } from "@/lib/stripe";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/*
 * Open a hosted Checkout session for one side rail slot.
 *
 * Pay first. The form, the review, and the rail write happen after
 * return. Checkout collects a card only. Company name, URL, and the
 * one-liner live on /sponsor/setup.
 *
 * The sponsor page posts a form. This route 303s to Stripe so the
 * browser leaves the site. JSON POST still returns { url } for tools.
 */

function safeOrigin(request: Request): string {
  const canonical = new URL(site.url);
  try {
    const url = new URL(request.url);
    const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (local || url.hostname === canonical.hostname) return url.origin;
  } catch {
    /* fall through to the canonical origin */
  }
  return canonical.origin;
}

function fromForm(request: Request): boolean {
  const type = request.headers.get("content-type") ?? "";
  return type.includes("application/x-www-form-urlencoded") || type.includes("multipart/form-data");
}

function fail(request: Request, error: string, status: number) {
  if (fromForm(request)) {
    const url = new URL("/sponsor", safeOrigin(request));
    url.searchParams.set("checkout", "error");
    return Response.redirect(url, 303);
  }
  return Response.json({ error }, { status });
}

function ok(request: Request, checkoutUrl: string) {
  if (fromForm(request)) return Response.redirect(checkoutUrl, 303);
  return Response.json({ url: checkoutUrl });
}

async function readInterval(request: Request): Promise<{ interval: unknown; email?: string }> {
  if (fromForm(request)) {
    const form = await request.formData();
    const email = form.get("email");
    return {
      interval: form.get("interval"),
      email: typeof email === "string" ? email : undefined,
    };
  }
  const body = (await request.json()) as { interval?: unknown; email?: unknown } | null;
  const email = body?.email;
  return {
    interval: body?.interval,
    email: typeof email === "string" ? email : undefined,
  };
}

export async function POST(request: Request) {
  let parsed: { interval: unknown; email?: string };
  try {
    parsed = await readInterval(request);
  } catch {
    return fail(request, "Send JSON.", 400);
  }

  const interval = parsed.interval;
  if (!isRailInterval(interval)) {
    return fail(request, "interval must be 1m, 3m, or 6m.", 400);
  }

  if (!databaseUrl()) {
    return fail(request, "Checkout is not configured yet.", 503);
  }

  const { filled } = await getRailInventory();
  if (filled >= SPONSOR_SLOTS_TOTAL) {
    return fail(request, "Every paying slot is taken.", 409);
  }

  const plan = railPlan(interval);
  const price = railPriceId(plan);
  if (!price || !process.env.STRIPE_SECRET_KEY) {
    return fail(request, "Checkout is not configured yet.", 503);
  }

  const email = parsed.email && parsed.email.includes("@") ? parsed.email.trim() : undefined;

  try {
    /* Restricted live keys for this app can create Checkout Sessions but
       may not read Prices. Charge amount is checked on the session. */
    const origin = safeOrigin(request);
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price, quantity: 1 }],
      success_url: `${origin}/sponsor/setup?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/sponsor`,
      metadata: { brand: RAIL_BRAND, placement: RAIL_PLACEMENT, interval },
      integration_identifier: railIntegrationIdentifier(),
      ...(email ? { customer_email: email } : {}),
    });

    if (session.amount_total !== plan.amount || session.currency !== "usd") {
      console.error(
        `[checkout] session ${session.id} does not match the published plan`,
        { expected: plan.amount, actual: session.amount_total, currency: session.currency },
      );
      if (session.id) {
        await stripe().checkout.sessions.expire(session.id).catch(() => undefined);
      }
      return fail(request, "Checkout is not configured yet.", 503);
    }

    if (!session.url) {
      return fail(request, "Stripe did not return a checkout URL.", 502);
    }
    return ok(request, session.url);
  } catch (error) {
    console.error("[checkout] could not open a session", error);
    return fail(request, "Could not start checkout.", 502);
  }
}

export function GET() {
  return Response.json(
    { error: "POST { interval } to open a checkout session.", intervals: RAIL_PLANS.map((p) => p.interval) },
    { status: 405 },
  );
}
