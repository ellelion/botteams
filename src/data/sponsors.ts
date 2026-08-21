import { site } from "@/lib/site";

/*
 * Sponsor inventory and house ads.
 *
 * Two different things, kept as two different types on purpose, because
 * the number on the page has to stay true.
 *
 * `sponsors` is paying inventory. It is empty. `filledCount()` reads it
 * and nothing else, so a house ad can never make the rail look sold.
 *
 * `houseAds` are two of our own products. They render in exactly the
 * chrome a paying sponsor will get, and they carry no chip: not
 * Promoted, not Verified, not Paid, and nothing announcing that they are
 * ours. They earn us nothing on a click and they never count toward a
 * taken slot, which is what filledCount() is for.
 *
 * There are no invented logos and no roster borrowed from another
 * directory. An empty shelf says empty, in one line, once.
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

export type HouseAd = {
  id: string;
  name: string;
  line: string;
  href: string;
};

/* Paying slots across the whole shelf. The cap is the promise: the rail
   never grows past this, however many people ask. */
export const SPONSOR_SLOTS_TOTAL = 15;

/* Paying slots, in the order they render. Keep this short: a rail that is
   mostly empty is more honest and reads better than one padded out. */
export const sponsors: SponsorSlot[] = [];

/* No wordmark files exist for either, and we are not going to draw one
   and call it theirs, so both render as a type lockup in the site's own
   display face. The umbrella site is not one of these: it belongs in the
   footer, not in advertising inventory. */
export const houseAds: HouseAd[] = [
  {
    id: "skillselion",
    name: "Skillselion",
    line: "Skills and MCP for operators.",
    href: "https://skillselion.com",
  },
  {
    id: "agent-plugins-directory",
    name: "Agent Plugins Directory",
    line: "A ranked index of tools for coding agents.",
    href: "https://agentpluginsdirectory.com",
  },
];

/** Paying slots only. House ads are not inventory and never count here. */
export function filledCount(): number {
  return sponsors.filter((s) => s.href).length;
}

/** Paying slots still for sale. */
export function openCount(): number {
  return SPONSOR_SLOTS_TOTAL - filledCount();
}

/** Paying placements that actually exist. Never padded with empty rows. */
export function paidSlots(): SponsorSlot[] {
  return sponsors.filter((s) => s.href);
}

/** Outbound sponsor link with attribution. `campaign` separates rail from page. */
export function sponsorHref(slot: SponsorSlot, campaign: Campaign): string {
  if (!slot.href) return "/sponsor";
  return tagged(slot.href, "sponsor", campaign);
}

/** Outbound house link. Tagged `house`, never `sponsor`, so the analytics
    cannot quietly claim a house ad was a sale. */
export function houseHref(ad: HouseAd, campaign: Campaign): string {
  return tagged(ad.href, "house", campaign);
}

export type Campaign = "rail" | "sponsor-page" | "team-page";

function tagged(href: string, medium: "sponsor" | "house", campaign: Campaign): string {
  const url = new URL(href);
  url.searchParams.set("utm_source", new URL(site.url).hostname);
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", campaign);
  return url.toString();
}
