import Stripe from "stripe";
import { randomInt } from "node:crypto";
import type { RailPlan } from "@/lib/rail";
import { site } from "@/lib/site";

/*
 * Server only. Never import this from a client component: it reads the
 * secret key, and Next would refuse the build, which is the behaviour we
 * want if anyone tries.
 *
 * The client is built lazily so a build with no keys still succeeds. CI
 * and `next build` never open a session, and a missing key should be a
 * clear 503 at request time rather than a crash at import time.
 */

export const STRIPE_API_VERSION = "2026-07-29.dahlia";

let client: Stripe | null = null;

export function stripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  if (!client) {
    client = new Stripe(key, {
      apiVersion: STRIPE_API_VERSION,
      appInfo: { name: site.name, url: site.url },
    });
  }
  return client;
}

/** The Stripe price ID for a plan, or undefined when the env is not wired. */
export function railPriceId(plan: RailPlan): string | undefined {
  const value = process.env[plan.envKey];
  return value && value.length > 0 ? value : undefined;
}

/** True when a live checkout could actually be opened right now. */
export function railCheckoutReady(plans: readonly RailPlan[]): boolean {
  if (!process.env.STRIPE_SECRET_KEY) return false;
  return plans.every((plan) => railPriceId(plan) !== undefined);
}

/*
 * Attribution tag for one session. Stripe allows the same identifier on
 * many sessions, so this is per attempt rather than per buyer, and it is
 * letters only so it stays readable in the Dashboard.
 */
export function railIntegrationIdentifier(): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let suffix = "";
  for (let index = 0; index < 8; index += 1) {
    suffix += alphabet[randomInt(alphabet.length)];
  }
  return `botteams_rail_${suffix}`;
}
