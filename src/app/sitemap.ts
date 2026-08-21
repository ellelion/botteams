import type { MetadataRoute } from "next";
import { listBots, listTeams } from "@/lib/teams";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(site.updatedAt);
  const teamPages = listTeams().map((team) => ({ url: `${site.url}/teams/${team.slug}`, lastModified }));
  const botPages = listBots().map((bot) => ({ url: `${site.url}/bots/${bot.slug}`, lastModified }));
  return [
    { url: site.url, lastModified },
    { url: `${site.url}/connectors`, lastModified },
    { url: `${site.url}/docs`, lastModified },
    { url: `${site.url}/api`, lastModified },
    { url: `${site.url}/sponsor`, lastModified },
    ...teamPages,
    ...botPages,
  ];
}
