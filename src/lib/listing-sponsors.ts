import { houseSlots, type SponsorSlot } from "@/data/sponsors";
import type { Team } from "@/lib/types";

export const LISTING_AD_EVERY = 7;

export type ListingRow =
  | { kind: "team"; team: Team }
  | { kind: "ad"; slot: SponsorSlot; key: string };

const houseIds = new Set(houseSlots.map((slot) => slot.id));

/*
 * A filled record is a named listing someone actually placed: a paid
 * Neon row, or a house row that is the real listing (not a repeating
 * upsell chip). Empty "put your listing here" rows and Add yours CTAs
 * are not filled.
 */
export function isFilledSponsor(slot: SponsorSlot): boolean {
  return Boolean(slot.name?.trim());
}

export function listingChromeSponsors(slots: readonly SponsorSlot[]): SponsorSlot[] {
  return slots.filter(isFilledSponsor);
}

/*
 * House Skillselion / Agent Plugins Directory rows are real listings
 * when they are the inventory. Using that same pair as the fallback
 * ad pool on a page with no paid rows is the house upsell. Listing
 * chrome hides until a caller passes at least one filled slot.
 */
export function isHouseUpsellOnly(slots: readonly SponsorSlot[]): boolean {
  const filled = listingChromeSponsors(slots);
  if (filled.length === 0) return true;
  return filled.every((slot) => slot.owned === true || houseIds.has(slot.id));
}

export function listingChromeSlots(slots: readonly SponsorSlot[]): SponsorSlot[] {
  if (isHouseUpsellOnly(slots)) return [];
  return listingChromeSponsors(slots);
}

export function interleaveListingRows(teams: Team[], ads: readonly SponsorSlot[]): ListingRow[] {
  const filled = listingChromeSlots(ads);
  if (filled.length === 0) {
    return teams.map((team) => ({ kind: "team" as const, team }));
  }
  const out: ListingRow[] = [];
  let n = 0;
  teams.forEach((team, i) => {
    out.push({ kind: "team", team });
    if ((i + 1) % LISTING_AD_EVERY === 0) {
      const slot = filled[n % filled.length];
      out.push({ kind: "ad", slot, key: `ad-${i}-${slot.id}` });
      n += 1;
    }
  });
  return out;
}
