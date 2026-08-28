import type { Team } from "@/lib/teams";
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
    foundingLocation: {
      "@type": "Place",
      name: "Wyoming, USA",
      address: {
        "@type": "PostalAddress",
        streetAddress: "30 N Gould St Ste R",
        addressLocality: "Sheridan",
        addressRegion: "WY",
        postalCode: "82801",
        addressCountry: "US",
      },
    },
    logo: { "@type": "ImageObject", url: `${site.url}/icon.png`, width: 512, height: 512 },
    sameAs: [site.github, site.xUrl],
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

export function teamListJsonLd(teams: Team[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Grok Bot teams and bots",
    description: site.entity,
    numberOfItems: teams.length,
    itemListElement: teams.map((team, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: team.name,
      url: `${site.url}/${team.kind === "bot" ? "bots" : "teams"}/${team.slug}`,
      description: team.tagline,
    })),
  };
}

/* One shape, two paths. The kind decides which directory the item lives on,
   so the canonical URL follows it rather than being passed in. */
function itemJsonLd(team: Team) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: team.name,
    url: `${site.url}/${team.kind === "bot" ? "bots" : "teams"}/${team.slug}`,
    description: team.tagline,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    dateModified: site.updatedAt,
    isPartOf: { "@id": `${site.url}/#website` },
    publisher: { "@id": `${site.url}/#organization` },
  };
}

export const teamJsonLd = itemJsonLd;
export const botJsonLd = itemJsonLd;

export function articleJsonLd(input: {
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: input.headline,
    description: input.description,
    url: input.url,
    mainEntityOfPage: input.url,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: { "@id": `${site.url}/#organization` },
    publisher: { "@id": `${site.url}/#organization` },
    isPartOf: { "@id": `${site.url}/#website` },
    about: {
      "@type": "SoftwareApplication",
      name: "Grok Bot",
      applicationCategory: "BusinessApplication",
      operatingSystem: "macOS, Windows, iOS",
    },
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function itemListJsonLd(input: {
  name: string;
  description: string;
  items: { name: string; url: string; description: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: input.name,
    description: input.description,
    numberOfItems: input.items.length,
    itemListElement: input.items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
      description: item.description,
    })),
  };
}
