import type { Metadata } from "next";
import Link from "next/link";
import { WingsHero, WingsSplit } from "@/components/WingsSplit";
import { ledger } from "@/lib/ledger-theme";
import { GUIDE_CLUSTERS, guideUpdated, guideUrl, guidesIndexUrl, listGuides } from "@/lib/guides";
import { articleJsonLd, breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

const TITLE = "Grok Bot guides";
const HEADLINE = "Grok Bot guides";
const DESCRIPTION =
  "How-to, comparison, access, and job pages for Grok Bot. Each URL answers one query. The pillar remains What is Grok Bot? 24 August 2026.";
const HERO =
  "These pages split Grok Bot into one query each: how to install a team, how the shared computer works, and how it compares to one other product. The definition still lives on What is Grok Bot? We do not reprint that answer here.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: guidesIndexUrl() },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: guidesIndexUrl(),
    type: "article",
    publishedTime: guideUpdated(),
    modifiedTime: guideUpdated(),
  },
};

function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function GuidesIndexPage() {
  const guides = listGuides();
  const updated = guideUpdated();

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          url: guidesIndexUrl(),
          headline: HEADLINE,
          description: DESCRIPTION,
          datePublished: updated,
          dateModified: updated,
        })}
      />
      <JsonLd
        data={itemListJsonLd({
          name: TITLE,
          description: DESCRIPTION,
          items: guides.map((guide) => ({
            name: guide.headline,
            url: guideUrl(guide.slug),
            description: guide.description,
          })),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Grok Bot teams", url: site.url },
          { name: "Guides", url: guidesIndexUrl() },
        ])}
      />
      <WingsSplit
        hero={
          <WingsHero
            kicker={
              <Link href="/grok-bot" className="accent-hover">
                What is Grok Bot?
              </Link>
            }
            title={HEADLINE}
          >
            <p className="mt-5 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
              {HERO}
            </p>
            <p className="meta mt-3">
              Last updated <time dateTime={updated}>{updated}</time>
            </p>
          </WingsHero>
        }
      >
        <article className="guide-prose">
          {GUIDE_CLUSTERS.map((cluster) => {
            const items = guides.filter((guide) => guide.cluster === cluster.id);
            return (
              <section key={cluster.id}>
                <h2 id={cluster.id}>{cluster.title}</h2>
                <p>{cluster.lead}</p>
                <ul className="guide-index">
                  {items.map((guide) => (
                    <li key={guide.slug}>
                      <Link className="accent-hover underline underline-offset-2" href={`/guides/${guide.slug}`}>
                        {guide.headline}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </article>
      </WingsSplit>
    </>
  );
}
