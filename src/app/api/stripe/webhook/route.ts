import type Stripe from "stripe";
import { databaseUrl } from "@/lib/db";
import { upsertPaidSession } from "@/lib/rail-db";
import { stripe } from "@/lib/stripe";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/*
 * Stripe webhook.
 *
 * A paid session is stored as paid. The browser is not here, so this
 * route never navigates anyone. The rail write happens on /sponsor/setup
 * after the review passes.
 */

async function notifyPaid(session: Stripe.Checkout.Session): Promise<"sent" | "skipped" | "failed"> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.SPONSOR_NOTIFY_FROM;
  const email = session.customer_details?.email ?? session.customer_email ?? "";
  const interval = session.metadata?.interval ?? "";
  const cents = session.amount_total ?? 0;
  const amount = `${(cents / 100).toFixed(2)} ${(session.currency ?? "usd").toUpperCase()}`;
  const lines = [
    `Email: ${email}`,
    `Term: ${interval}`,
    `Paid: ${amount}`,
    `Session: ${session.id}`,
    "",
    "Stored as paid. The buyer still has to submit the setup form. Not on the rail yet.",
  ].join("\n");
  if (!key || !from) return "skipped";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [site.email],
        subject: `Rail slot paid (${interval || "term unknown"})`,
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
    if (session.metadata?.brand === "grokbotteams" && session.metadata?.placement === "side-rail") {
      if (!databaseUrl()) {
        console.error("[stripe-webhook] DATABASE_URL missing; cannot store payment", session.id);
        return Response.json({ error: "Database is not configured." }, { status: 503 });
      }
      try {
        const payment = await upsertPaidSession(session);
        const mail = await notifyPaid(session);
        console.log(
          "[stripe-webhook] rail payment stored as paid",
          JSON.stringify({ sessionId: session.id, paymentId: payment.id, status: payment.status, mail }),
        );
      } catch (error) {
        console.error("[stripe-webhook] could not store payment", error);
        return Response.json({ error: "Could not store payment." }, { status: 500 });
      }
    }
  }

  return Response.json({ received: true });
}
