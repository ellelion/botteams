import { openCount } from "@/data/sponsors";
import { RAIL_PLANS, isRailInterval, railPlan } from "@/lib/rail";
import { railIntegrationIdentifier, railPriceId, stripe } from "@/lib/stripe";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/*
 * Open a hosted Checkout session for one side rail slot.
 *
 * The buyer pays first and we place them by hand afterwards. Nothing
 * here lists anyone, and the webhook does not either: a card charge is
 * not an editorial decision, and the rail has rules.
 */

/* Stripe redirects the payer to success_url, so it cannot be whatever
   host the caller claims. Take the request origin only when it is one we
   recognise, and fall back to the canonical domain. */
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

  /* The cap is a promise on the page, so it is enforced here and not
     only in the interface. */
  if (openCount() <= 0) {
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
    /* Read the price back before charging anything. If the published
       number and the Stripe number ever drift, this refuses rather than
       quietly charging a figure the page did not show. */
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
      line_items: [{ price, quantity: 1 }],
      success_url: `${origin}/sponsor?paid=1`,
      cancel_url: `${origin}/sponsor`,
      /* Everything we need to write the row. All three required, because
         a placement with no destination is not a placement. */
      custom_fields: [
        {
          key: "company",
          label: { type: "custom", custom: "Company name" },
          type: "text",
          text: { maximum_length: 60 },
          optional: false,
        },
        {
          key: "desturl",
          label: { type: "custom", custom: "Destination URL" },
          type: "text",
          text: { maximum_length: 200 },
          optional: false,
        },
        {
          key: "oneline",
          label: { type: "custom", custom: "One line about it" },
          type: "text",
          text: { maximum_length: 80 },
          optional: false,
        },
      ],
      metadata: { brand: "grokbotteams", placement: "side-rail", interval },
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

/* A GET here is somebody poking at the endpoint, not a buyer. */
export function GET() {
  return Response.json(
    { error: "POST { interval } to open a checkout session.", intervals: RAIL_PLANS.map((p) => p.interval) },
    { status: 405 },
  );
}
