/*
 * Product flags. Defaults keep production quiet. A missing env value is
 * off, not on.
 *
 * Sponsorship chrome: in-list ads, the side rail, and the ticker/strip.
 * The /sponsor page stays up either way so a buyer can still read the
 * offer. Nav and footer still link there.
 *
 * Turn on: set NEXT_PUBLIC_SPONSORSHIPS=1 (or true) in .env.local or the
 * host env, then restart Next.js. The name is public because listing
 * components read it on the client.
 */

function truthyPublicFlag(value: string | undefined): boolean {
  const raw = value?.trim().toLowerCase();
  return raw === "1" || raw === "true";
}

export function sponsorshipsEnabled(): boolean {
  return truthyPublicFlag(process.env.NEXT_PUBLIC_SPONSORSHIPS);
}

export const SPONSORSHIPS = sponsorshipsEnabled();
