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

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Send JSON." }, { status: 400 });
  }

  const interval = (body as { interval?: unknown } | null)?.interval;
  if (!isRailInterval(interval)) {
    return Response.json({ error: "interval must be 1m, 3m, or 6m." }, { status: 400 });
  }

  if (!databaseUrl()) {
    return Response.json({ error: "Checkout is not configured yet." }, { status: 503 });
  }

  const { filled } = await getRailInventory();
  if (filled >= SPONSOR_SLOTS_TOTAL) {
    return Response.json({ error: "Every paying slot is taken." }, { status: 409 });
  }

  const plan = railPlan(interval);
  const price = railPriceId(plan);
  if (!price || !process.env.STRIPE_SECRET_KEY) {
    return Response.json({ error: "Checkout is not configured yet." }, { status: 503 });
  }

  const rawEmail = (body as { email?: unknown }).email;
  const email = typeof rawEmail === "string" && rawEmail.includes("@") ? rawEmail.trim() : undefined;

  try {
    const live = await stripe().prices.retrieve(price);
    if (live.unit_amount !== plan.amount || live.currency !== "usd" || live.recurring) {
      console.error(
        `[checkout] price ${price} does not match the published plan`,
        { expected: plan.amount, actual: live.unit_amount, recurring: Boolean(live.recurring) },
      );
      return Response.json({ error: "Checkout is not configured yet." }, { status: 503 });
    }

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

    if (!session.url) {
      return Response.json({ error: "Stripe did not return a checkout URL." }, { status: 502 });
    }
    return Response.json({ url: session.url });
  } catch (error) {
    console.error("[checkout] could not open a session", error);
    return Response.json({ error: "Could not start checkout." }, { status: 502 });
  }
}

export function GET() {
  return Response.json(
    { error: "POST { interval } to open a checkout session.", intervals: RAIL_PLANS.map((p) => p.interval) },
    { status: 405 },
  );
}
