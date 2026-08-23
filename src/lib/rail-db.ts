import type Stripe from "stripe";
import { db } from "@/lib/db";
import { isRailInterval, isRailSessionMeta, type RailInterval } from "@/lib/rail";

export const RAIL_PAYMENT_STATUSES = [
  "paid",
  "setup",
  "live",
  "rejected",
  "needs_human",
  "hidden",
] as const;

export type RailPaymentStatus = (typeof RAIL_PAYMENT_STATUSES)[number];

export type RailPayment = {
  id: string;
  stripeSessionId: string;
  email: string;
  interval: RailInterval;
  amountCents: number;
  paidAt: Date;
  status: RailPaymentStatus;
  attempts: number;
  expiresAt: Date;
  refundedAt: Date | null;
};

export type RailSlotRow = {
  id: string;
  paymentId: string;
  name: string;
  line: string;
  href: string;
  markUrl: string;
  liveAt: Date;
  hiddenAt: Date | null;
};

type PaymentRow = {
  id: string;
  stripe_session_id: string;
  email: string;
  interval: string;
  amount_cents: number;
  paid_at: string;
  status: string;
  attempts: number;
  expires_at: string;
  refunded_at: string | null;
};

type SlotRow = {
  id: string;
  payment_id: string;
  name: string;
  line: string;
  href: string;
  mark_url: string;
  live_at: string;
  hidden_at: string | null;
};

function asStatus(value: string): RailPaymentStatus {
  if ((RAIL_PAYMENT_STATUSES as readonly string[]).includes(value)) {
    return value as RailPaymentStatus;
  }
  throw new Error(`unknown rail payment status: ${value}`);
}

function asInterval(value: string): RailInterval {
  if (!isRailInterval(value)) throw new Error(`unknown rail interval: ${value}`);
  return value;
}

function mapPayment(row: PaymentRow): RailPayment {
  return {
    id: row.id,
    stripeSessionId: row.stripe_session_id,
    email: row.email,
    interval: asInterval(row.interval),
    amountCents: row.amount_cents,
    paidAt: new Date(row.paid_at),
    status: asStatus(row.status),
    attempts: row.attempts,
    expiresAt: new Date(row.expires_at),
    refundedAt: row.refunded_at ? new Date(row.refunded_at) : null,
  };
}

function mapSlot(row: SlotRow): RailSlotRow {
  return {
    id: row.id,
    paymentId: row.payment_id,
    name: row.name,
    line: row.line,
    href: row.href,
    markUrl: row.mark_url,
    liveAt: new Date(row.live_at),
    hiddenAt: row.hidden_at ? new Date(row.hidden_at) : null,
  };
}

export function expiresAtFrom(paidAt: Date, interval: RailInterval): Date {
  const next = new Date(paidAt);
  const months = interval === "1m" ? 1 : interval === "3m" ? 3 : 6;
  next.setUTCMonth(next.getUTCMonth() + months);
  return next;
}

export function isPaymentExpired(payment: RailPayment, now = new Date()): boolean {
  return payment.expiresAt.getTime() <= now.getTime();
}

/** Paid, not yet live, not handed to a human, not hidden, still in term. */
export function isSetupOpen(payment: RailPayment, now = new Date()): boolean {
  if (isPaymentExpired(payment, now)) return false;
  return payment.status === "paid" || payment.status === "setup";
}

export async function filledPayingCount(): Promise<number> {
  const rows = (await db()`
    SELECT count(*)::int AS n
    FROM grokbotteams_rail_slots s
    JOIN grokbotteams_rail_payments p ON p.id = s.payment_id
    WHERE s.hidden_at IS NULL
      AND p.status = 'live'
      AND p.expires_at > now()
  `) as { n: number }[];
  return rows[0]?.n ?? 0;
}

export async function listLivePayingSlots(): Promise<RailSlotRow[]> {
  const rows = (await db()`
    SELECT s.id, s.payment_id, s.name, s.line, s.href, s.mark_url, s.live_at, s.hidden_at
    FROM grokbotteams_rail_slots s
    JOIN grokbotteams_rail_payments p ON p.id = s.payment_id
    WHERE s.hidden_at IS NULL
      AND p.status = 'live'
      AND p.expires_at > now()
    ORDER BY s.live_at ASC
  `) as SlotRow[];
  return rows.map(mapSlot);
}

export async function getPaymentBySessionId(sessionId: string): Promise<RailPayment | null> {
  const rows = (await db()`
    SELECT id, stripe_session_id, email, interval, amount_cents, paid_at, status,
           attempts, expires_at, refunded_at
    FROM grokbotteams_rail_payments
    WHERE stripe_session_id = ${sessionId}
    LIMIT 1
  `) as PaymentRow[];
  return rows[0] ? mapPayment(rows[0]) : null;
}

/*
 * Idempotent on stripe_session_id. A late webhook and the setup page
 * hitting Stripe directly both land here. Later statuses (live,
 * needs_human, hidden, rejected) are not rolled back.
 */
export async function upsertPaidSession(session: Stripe.Checkout.Session): Promise<RailPayment> {
  const meta = session.metadata;
  if (!isRailSessionMeta(meta)) {
    throw new Error("session is not a grokbotteams rail payment");
  }
  if (session.payment_status !== "paid") {
    throw new Error("session is not paid");
  }
  const interval = meta.interval;
  if (!isRailInterval(interval)) throw new Error("session is missing a rail interval");

  const paidAt = session.created ? new Date(session.created * 1000) : new Date();
  const expiresAt = expiresAtFrom(paidAt, interval);
  const email = session.customer_details?.email ?? session.customer_email ?? "";
  const amountCents = session.amount_total ?? 0;
  if (amountCents <= 0) throw new Error("session has no amount");

  const rows = (await db()`
    INSERT INTO grokbotteams_rail_payments (
      stripe_session_id, email, interval, amount_cents, paid_at, status, attempts, expires_at
    )
    VALUES (
      ${session.id}, ${email}, ${interval}, ${amountCents}, ${paidAt.toISOString()},
      'paid', 0, ${expiresAt.toISOString()}
    )
    ON CONFLICT (stripe_session_id) DO UPDATE SET
      email = CASE
        WHEN grokbotteams_rail_payments.email = '' THEN EXCLUDED.email
        ELSE grokbotteams_rail_payments.email
      END,
      updated_at = now()
    RETURNING id, stripe_session_id, email, interval, amount_cents, paid_at, status,
              attempts, expires_at, refunded_at
  `) as PaymentRow[];
  if (!rows[0]) throw new Error("could not upsert rail payment");
  return mapPayment(rows[0]);
}

export async function markPaymentSetup(paymentId: string): Promise<void> {
  await db()`
    UPDATE grokbotteams_rail_payments
    SET status = 'setup', updated_at = now()
    WHERE id = ${paymentId} AND status = 'paid'
  `;
}

export async function incrementReviewAttempt(paymentId: string): Promise<RailPayment> {
  const rows = (await db()`
    UPDATE grokbotteams_rail_payments
    SET
      attempts = attempts + 1,
      status = CASE WHEN status = 'paid' THEN 'setup' ELSE status END,
      updated_at = now()
    WHERE id = ${paymentId}
      AND status IN ('paid', 'setup')
      AND attempts < 3
    RETURNING id, stripe_session_id, email, interval, amount_cents, paid_at, status,
              attempts, expires_at, refunded_at
  `) as PaymentRow[];
  if (!rows[0]) {
    const current = (await db()`
      SELECT id, stripe_session_id, email, interval, amount_cents, paid_at, status,
             attempts, expires_at, refunded_at
      FROM grokbotteams_rail_payments
      WHERE id = ${paymentId}
      LIMIT 1
    `) as PaymentRow[];
    if (!current[0]) throw new Error("payment not found");
    return mapPayment(current[0]);
  }
  return mapPayment(rows[0]);
}

export async function markNeedsHuman(paymentId: string): Promise<RailPayment> {
  const rows = (await db()`
    UPDATE grokbotteams_rail_payments
    SET status = 'needs_human', updated_at = now()
    WHERE id = ${paymentId}
      AND status IN ('paid', 'setup')
    RETURNING id, stripe_session_id, email, interval, amount_cents, paid_at, status,
              attempts, expires_at, refunded_at
  `) as PaymentRow[];
  if (!rows[0]) {
    const current = await getPaymentById(paymentId);
    if (!current) throw new Error("payment not found");
    return current;
  }
  return mapPayment(rows[0]);
}

export async function getPaymentById(paymentId: string): Promise<RailPayment | null> {
  const rows = (await db()`
    SELECT id, stripe_session_id, email, interval, amount_cents, paid_at, status,
           attempts, expires_at, refunded_at
    FROM grokbotteams_rail_payments
    WHERE id = ${paymentId}
    LIMIT 1
  `) as PaymentRow[];
  return rows[0] ? mapPayment(rows[0]) : null;
}

export type PublishInput = {
  paymentId: string;
  name: string;
  line: string;
  href: string;
  markUrl: string;
};

export type PublishResult =
  | { ok: true; slot: RailSlotRow; payment: RailPayment }
  | { ok: false; reason: "full" | "not_open" };

/*
 * Write the paying slot. The insert is gated on the live count so two
 * finishing buyers cannot push the rail to 16.
 */
export async function publishLiveSlot(input: PublishInput): Promise<PublishResult> {
  const slotRows = (await db()`
    INSERT INTO grokbotteams_rail_slots (payment_id, name, line, href, mark_url, live_at)
    SELECT ${input.paymentId}, ${input.name}, ${input.line}, ${input.href}, ${input.markUrl}, now()
    WHERE (
      SELECT count(*)
      FROM grokbotteams_rail_slots s
      JOIN grokbotteams_rail_payments p ON p.id = s.payment_id
      WHERE s.hidden_at IS NULL
        AND p.status = 'live'
        AND p.expires_at > now()
    ) < 15
    AND EXISTS (
      SELECT 1 FROM grokbotteams_rail_payments
      WHERE id = ${input.paymentId}
        AND status IN ('paid', 'setup')
        AND expires_at > now()
    )
    RETURNING id, payment_id, name, line, href, mark_url, live_at, hidden_at
  `) as SlotRow[];

  if (!slotRows[0]) {
    const payment = await getPaymentById(input.paymentId);
    if (!payment || !isSetupOpen(payment)) return { ok: false, reason: "not_open" };
    return { ok: false, reason: "full" };
  }

  const payRows = (await db()`
    UPDATE grokbotteams_rail_payments
    SET status = 'live', updated_at = now()
    WHERE id = ${input.paymentId}
      AND status IN ('paid', 'setup')
    RETURNING id, stripe_session_id, email, interval, amount_cents, paid_at, status,
              attempts, expires_at, refunded_at
  `) as PaymentRow[];

  if (!payRows[0]) {
    return { ok: false, reason: "not_open" };
  }

  return { ok: true, slot: mapSlot(slotRows[0]), payment: mapPayment(payRows[0]) };
}

/** Kill switch. Keeps the payment. The row leaves the rail. */
export async function hideRailPayment(paymentId: string): Promise<void> {
  await db()`
    UPDATE grokbotteams_rail_slots
    SET hidden_at = now(), updated_at = now()
    WHERE payment_id = ${paymentId} AND hidden_at IS NULL
  `;
  await db()`
    UPDATE grokbotteams_rail_payments
    SET status = 'hidden', updated_at = now()
    WHERE id = ${paymentId} AND status IN ('live', 'setup', 'paid', 'needs_human')
  `;
}
