import { site } from "@/lib/site";

/*
 * Sponsor slots.
 *
 * Every slot is either a real placement or visibly empty. There are no
 * invented logos, no "as seen in", and no roster borrowed from another
 * directory. An empty shelf says empty.
 *
 * `href` is run through sponsorHref() so every outbound link carries UTM
 * and the placement is attributable. Partner and affiliate links are
 * marked so the disclosure line can be truthful about which is which.
 */

export type SponsorSlot = {
  id: string;
  /* Filled slots carry a name; an empty slot carries none. */
  name?: string;
  line?: string;
  href?: string;
  /* Mark for the row. A file under /public/connectors or /public/brand. */
  mark?: string;
  /* True when we earn on a click, which forces the disclosure line. */
  affiliate?: boolean;
};

export const SPONSOR_SLOTS_TOTAL = 8;

/* Filled slots, in the order they render. Keep this short: a rail that is
   mostly empty is more honest and reads better than one padded out. */
export const sponsors: SponsorSlot[] = [];

export function filledCount(): number {
  return sponsors.filter((s) => s.href).length;
}

/** Outbound sponsor link with attribution. `campaign` separates rail from page. */
export function sponsorHref(slot: SponsorSlot, campaign: "rail" | "sponsor-page" | "team-page"): string {
  if (!slot.href) return "/sponsor";
  const url = new URL(slot.href);
  url.searchParams.set("utm_source", new URL(site.url).hostname);
  url.searchParams.set("utm_medium", "sponsor");
  url.searchParams.set("utm_campaign", campaign);
  return url.toString();
}

/** Slots to render, filled first, padded with empties up to `count`. */
export function railSlots(count: number): SponsorSlot[] {
  const out: SponsorSlot[] = [...sponsors].slice(0, count);
  for (let i = out.length; i < count; i += 1) out.push({ id: `open-${i + 1}` });
  return out;
}
