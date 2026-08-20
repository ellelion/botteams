import type { MetadataRoute } from "next";
import { listPacks } from "@/lib/packs";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(site.updatedAt);
  const packPages = listPacks().map((pack) => ({ url: `${site.url}/packs/${pack.slug}`, lastModified }));
  return [
    { url: site.url, lastModified },
    { url: `${site.url}/docs`, lastModified },
    ...packPages,
  ];
}
