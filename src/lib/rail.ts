/*
 * The three side rail plans.
 *
 * Safe on the client: names, prices and the env var that holds each
 * Stripe price ID. No key, no ID, no secret.
 *
 * `amount` is the published price in cents and is the number the page
 * prints. The checkout route reads the real Stripe price and refuses to
 * open a session if the two disagree, so the page can never show one
 * number and charge another.
 */

export const RAIL_INTERVALS = ["1m", "3m", "6m"] as const;
export type RailInterval = (typeof RAIL_INTERVALS)[number];

export type RailPlan = {
  interval: RailInterval;
  label: string;
  amount: number;
  display: string;
  envKey: "STRIPE_PRICE_RAIL_1M" | "STRIPE_PRICE_RAIL_3M" | "STRIPE_PRICE_RAIL_6M";
};

export const RAIL_PLANS: readonly RailPlan[] = [
  { interval: "1m", label: "1 month", amount: 2900, display: "$29", envKey: "STRIPE_PRICE_RAIL_1M" },
  { interval: "3m", label: "3 months", amount: 6900, display: "$69", envKey: "STRIPE_PRICE_RAIL_3M" },
  { interval: "6m", label: "6 months", amount: 9900, display: "$99", envKey: "STRIPE_PRICE_RAIL_6M" },
] as const;

export function isRailInterval(value: unknown): value is RailInterval {
  return typeof value === "string" && (RAIL_INTERVALS as readonly string[]).includes(value);
}

export function railPlan(interval: RailInterval): RailPlan {
  const plan = RAIL_PLANS.find((p) => p.interval === interval);
  /* Unreachable once isRailInterval has run, and cheaper than an
     optional return every caller has to unwrap. */
  if (!plan) throw new Error(`unknown rail interval: ${interval}`);
  return plan;
}
