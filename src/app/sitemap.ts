import type { MetadataRoute } from "next";
import { listPacks } from "@/lib/packs";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(site.updatedAt);
  const teamPages = listPacks().map((pack) => ({ url: `${site.url}/teams/${pack.slug}`, lastModified }));
  return [
    { url: site.url, lastModified },
    { url: `${site.url}/connectors`, lastModified },
    { url: `${site.url}/docs`, lastModified },
    { url: `${site.url}/api`, lastModified },
    { url: `${site.url}/sponsor`, lastModified },
    ...teamPages,
  ];
}
