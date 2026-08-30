import { houseSlots, type SponsorSlot } from "@/data/sponsors";
import { sponsorshipsEnabled } from "@/lib/flags";
import type { Team } from "@/lib/types";

export const LISTING_AD_EVERY = 7;
export const LISTING_SLOT_EVERY = 21;

export type ListingRow =
  | { kind: "team"; team: Team }
  | { kind: "ad"; slot: SponsorSlot; key: string }
  | { kind: "slot"; key: string };

export function interleaveAds(teams: Team[], ads: SponsorSlot[]): ListingRow[] {
  const pool = ads.length ? ads : houseSlots;
  const out: ListingRow[] = [];
  let n = 0;
  teams.forEach((team, i) => {
    out.push({ kind: "team", team });
    const k = i + 1;
    if (k % LISTING_SLOT_EVERY === 0) {
      out.push({ kind: "slot", key: `slot-${i}` });
    } else if (k % LISTING_AD_EVERY === 0) {
      const slot = pool[(n + 1) % pool.length];
      out.push({ kind: "ad", slot, key: `ad-${i}-${slot.id}` });
      n += 1;
    }
  });
  return out;
}

export function listingRows(
  teams: Team[],
  ads: SponsorSlot[],
  enabled = sponsorshipsEnabled(),
): ListingRow[] {
  if (!enabled) {
    return teams.map((team) => ({ kind: "team" as const, team }));
  }
  return interleaveAds(teams, ads);
}
