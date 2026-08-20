import type { Pack } from "@/lib/packs";
import { site } from "@/lib/site";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    legalName: site.company,
    url: site.url,
    email: site.email,
    description: site.entity,
    foundingLocation: { "@type": "Place", name: "Wyoming, USA", address: { "@type": "PostalAddress", addressRegion: "WY", addressCountry: "US" } },
    logo: { "@type": "ImageObject", url: `${site.url}/brand/wings.webp`, width: 640, height: 640 },
    sameAs: [site.github],
    parentOrganization: { "@type": "Organization", name: site.company, url: "https://ellelion.com" },
    disambiguatingDescription: "Not affiliated with xAI.",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    description: site.entity,
    publisher: { "@id": `${site.url}/#organization` },
    dateModified: site.updatedAt,
  };
}

export function packListJsonLd(packs: Pack[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Grok Bot company teams",
    description: site.entity,
    numberOfItems: packs.length,
    itemListElement: packs.map((pack, i) => ({ "@type": "ListItem", position: i + 1, name: pack.name, url: `${site.url}/teams/${pack.slug}`, description: pack.tagline })),
  };
}

export function packJsonLd(pack: Pack) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: pack.name,
    url: `${site.url}/teams/${pack.slug}`,
    description: pack.tagline,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    dateModified: site.updatedAt,
    isPartOf: { "@id": `${site.url}/#website` },
    publisher: { "@id": `${site.url}/#organization` },
  };
}
