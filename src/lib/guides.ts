import { GUIDES_UPDATED, site } from "@/lib/site";
import { compareGuides } from "@/content/guides/compare";
import { howtoGuides } from "@/content/guides/howto";
import { jobGuides } from "@/content/guides/jobs";
import { trustGuides } from "@/content/guides/trust";
import type { Guide, GuideCluster } from "@/lib/guide-types";

export type { Guide, GuideBlock, GuideCluster, GuideSection, GuideSource } from "@/lib/guide-types";

export const GUIDE_CLUSTERS: { id: GuideCluster; title: string; lead: string }[] = [
  {
    id: "compare",
    title: "Comparisons",
    lead: "One pair per page. Sourced tables. No trophy.",
  },
  {
    id: "howto",
    title: "How to",
    lead: "Click paths and installer steps the pillar only answers in a short block.",
  },
  {
    id: "trust",
    title: "Access and trust",
    lead: "Who can sign in, and what the shared computer actually means.",
  },
  {
    id: "job",
    title: "Jobs",
    lead: "xAI's published roles, with an installer from this directory that stops at review.",
  },
];

const GUIDES: Guide[] = [...compareGuides, ...howtoGuides, ...trustGuides, ...jobGuides];

export function listGuides(): Guide[] {
  return GUIDES;
}

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}

export function guideUrl(slug: string): string {
  return `${site.url}/guides/${slug}`;
}

export function guidesIndexUrl(): string {
  return `${site.url}/guides`;
}

export function guideUpdated(): string {
  return GUIDES_UPDATED;
}
