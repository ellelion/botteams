import type { MetadataRoute } from "next";
import { listBots, listTeams } from "@/lib/teams";
import { guideUpdated, listGuides } from "@/lib/guides";
import { CHIEF_OF_STAFF_COLLECTION_UPDATED, GROK_BOT_GUIDE_UPDATED, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(site.updatedAt);
  const guidesModified = new Date(guideUpdated());
  const teamPages = listTeams().map((team) => ({ url: `${site.url}/teams/${team.slug}`, lastModified }));
  const botPages = listBots().map((bot) => ({ url: `${site.url}/bots/${bot.slug}`, lastModified }));
  const guidePages = listGuides().map((guide) => ({
    url: `${site.url}/guides/${guide.slug}`,
    lastModified: guidesModified,
  }));
  return [
    { url: site.url, lastModified },
    { url: `${site.url}/connectors`, lastModified },
    { url: `${site.url}/grok-bot`, lastModified: new Date(GROK_BOT_GUIDE_UPDATED) },
    { url: `${site.url}/guides`, lastModified: guidesModified },
    { url: `${site.url}/collections/chief-of-staff`, lastModified: new Date(CHIEF_OF_STAFF_COLLECTION_UPDATED) },
    ...guidePages,
    { url: `${site.url}/docs`, lastModified },
    { url: `${site.url}/api`, lastModified },
    { url: `${site.url}/sponsor`, lastModified },
    { url: `${site.url}/about`, lastModified },
    { url: `${site.url}/terms`, lastModified },
    { url: `${site.url}/privacy`, lastModified },
    ...teamPages,
    ...botPages,
  ];
}
