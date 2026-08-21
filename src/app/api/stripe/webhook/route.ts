import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/*
 * Stripe webhook.
 *
 * What it does NOT do, on purpose: it does not touch src/data/sponsors.ts
 * and it does not list anybody. A successful card charge means we owe the
 * buyer a placement, not that a row appears on the rail unread. The rail
 * has rules on /sponsor and a human applies them.
 *
 * What it does: tell us, so nobody has to watch the Dashboard. Mail if a
 * Resend key is present, and a structured server log either way, which
 * is what v1 runs on.
 */

type Placement = {
  company: string;
  url: string;
  line: string;
  interval: string;
  email: string;
  amount: string;
  sessionId: string;
};

function field(session: Stripe.Checkout.Session, key: string): string {
  const found = session.custom_fields?.find((f) => f.key === key);
  return found?.text?.value ?? "";
}

function readPlacement(session: Stripe.Checkout.Session): Placement {
  const cents = session.amount_total ?? 0;
  return {
    company: field(session, "company"),
    url: field(session, "desturl"),
    line: field(session, "oneline"),
    interval: session.metadata?.interval ?? "",
    email: session.customer_details?.email ?? session.customer_email ?? "",
    amount: `${(cents / 100).toFixed(2)} ${(session.currency ?? "usd").toUpperCase()}`,
    sessionId: session.id,
  };
}

/* Optional. The project ships no mail dependency, so this is a plain
   fetch that stays dormant until a key exists. */
async function notify(placement: Placement): Promise<"sent" | "skipped" | "failed"> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.SPONSOR_NOTIFY_FROM;
  if (!key || !from) return "skipped";
  const lines = [
    `Company: ${placement.company}`,
    `URL: ${placement.url}`,
    `Line: ${placement.line}`,
    `Term: ${placement.interval}`,
    `Paid: ${placement.amount}`,
    `Email: ${placement.email}`,
    `Session: ${placement.sessionId}`,
    "",
    "Nothing is listed yet. Add the row by hand once the creative passes the rules on /sponsor.",
  ].join("\n");
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [site.email],
        subject: `Rail slot paid: ${placement.company || "unnamed"} (${placement.interval})`,
        text: lines,
      }),
    });
    return res.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return Response.json({ error: "Webhook is not configured." }, { status: 503 });
  }

  /* The raw body, not the parsed one. Signature verification is over the
     exact bytes Stripe signed. */
  const raw = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(raw, signature, secret);
  } catch (error) {
    console.error("[stripe-webhook] signature rejected", error);
    return Response.json({ error: "Bad signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (session.metadata?.placement === "side-rail") {
      const placement = readPlacement(session);
      const mail = await notify(placement);
      console.log(
        "[stripe-webhook] rail slot paid, nothing listed automatically",
        JSON.stringify({ ...placement, mail }),
      );
    }
  }

  /* Always 200 on a verified event. A non-2xx makes Stripe retry, and
     there is nothing here worth retrying. */
  return Response.json({ received: true });
}
