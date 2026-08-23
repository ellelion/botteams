import { site } from "@/lib/site";

/*
 * Slot cap is 12. Skillselion and Agent Plugins Directory are the first
 * two listings. They look like every other rail row and they count.
 * They do not pay because we own them.
 *
 * Paying inventory still comes from Neon. These two are always first
 * in the UI even if the seed has not been applied yet.
 */

export type SponsorSlot = {
  id: string;
  name?: string;
  line?: string;
  href?: string;
  mark?: string;
  affiliate?: boolean;
  owned?: boolean;
};

export const SPONSOR_SLOTS_TOTAL = 12;

export const houseSlots: SponsorSlot[] = [
  {
    id: "skillselion",
    name: "Skillselion",
    line: "Skills and MCP for operators.",
    href: "https://skillselion.com",
    mark: "/brand/skillselion.svg",
    owned: true,
  },
  {
    id: "agent-plugins-directory",
    name: "Agent Plugins Directory",
    line: "A ranked index of tools for coding agents.",
    href: "https://agentpluginsdirectory.com",
    mark: "/brand/agent-plugins-directory.svg",
    owned: true,
  },
];

export const houseAds = houseSlots;

export type Campaign = "rail" | "sponsor-page" | "team-page";

export function sponsorHref(slot: SponsorSlot, campaign: Campaign): string {
  if (!slot.href) return "/sponsor";
  return tagged(slot.href, slot.owned ? "house" : "sponsor", campaign);
}

export function houseHref(ad: SponsorSlot, campaign: Campaign): string {
  return sponsorHref(ad, campaign);
}

function tagged(href: string, medium: "sponsor" | "house", campaign: Campaign): string {
  const url = new URL(href);
  url.searchParams.set("utm_source", new URL(site.url).hostname);
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", campaign);
  return url.toString();
}
