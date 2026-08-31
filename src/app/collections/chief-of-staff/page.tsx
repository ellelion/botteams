import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ConnectorRow } from "@/components/ConnectorRow";
import { RosterShape } from "@/components/RosterShape";
import { WingsHero, WingsSplit } from "@/components/WingsSplit";
import { grokRecipeTitle } from "@/lib/grok-names";
import { ledger } from "@/lib/ledger-theme";
import { breadcrumbJsonLd } from "@/lib/seo";
import { CHIEF_OF_STAFF_COLLECTION_UPDATED, site } from "@/lib/site";
import { listAll } from "@/lib/teams";

/* Prerendered. Next defaults these to on-demand rendering even though
   they read nothing per-request, which makes the origin answer
   `no-store` and leaves the CDN unable to cache any page. */
export const dynamic = 'force-static';

const TITLE = "Chief of Staff Grok Bot teams and Bots";
const DESCRIPTION =
  "Compare five Chief of Staff Grok Bot setups for daily briefings, founder operations, task coordination, and company routines.";
const URL = `${site.url}/collections/chief-of-staff`;

const CHOICES = [
  {
    slug: "xai-chief-of-staff",
    bestFor: "A sourced priority brief across mail, calendar, chat, and notes",
    cadence: "Weekdays at 08:00",
  },
  {
    slug: "founder-os",
    bestFor: "A founder whose Chief of Staff routes Money and Inbox",
    cadence: "Monday week board plus weekday inbox",
  },
  {
    slug: "xai-executive-assistant",
    bestFor: "Morning orientation and catch-up summaries without replying for you",
    cadence: "Weekdays at 07:30",
  },
  {
    slug: "xai-daily-briefing-writer",
    bestFor: "A narrow, source-backed morning brief without wider coordination",
    cadence: "Weekdays at 07:00",
  },
  {
    slug: "company",
    bestFor: "A six-Bot operating room where Product holds the week list",
    cadence: "Monday planning plus weekday routines",
  },
] as const;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

function recipeHref(kind: "bot" | "team", slug: string): string {
  return `/${kind === "bot" ? "bots" : "teams"}/${slug}`;
}

function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function ChiefOfStaffCollectionPage() {
  const catalog = new Map(listAll().map((recipe) => [recipe.slug, recipe]));
  const choices = CHOICES.map((choice) => {
    const recipe = catalog.get(choice.slug);
    if (!recipe) throw new Error(`Chief of Staff collection recipe not found: ${choice.slug}`);
    return { ...choice, recipe, href: recipeHref(recipe.kind, recipe.slug) };
  });
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    url: URL,
    description: DESCRIPTION,
    dateModified: CHIEF_OF_STAFF_COLLECTION_UPDATED,
    isPartOf: { "@id": `${site.url}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: choices.length,
      itemListElement: choices.map(({ recipe, href }, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: grokRecipeTitle(recipe.kind, recipe.name),
        url: `${site.url}${href}`,
      })),
    },
  };

  return (
    <>
      <JsonLd data={collectionJsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Grok Bot teams", url: site.url },
          { name: "Chief of Staff setups", url: URL },
        ])}
      />
      <WingsSplit
        hero={
          <WingsHero
            kicker={<Breadcrumb parentHref="/" parentLabel="Grok Bot teams" current="Chief of Staff setups" />}
            title="Chief of Staff Grok Bot setups"
          >
            <p className="mt-5 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
              A Chief of Staff Grok Bot can run one morning briefing, coordinate a founder&apos;s specialist Bots, or hold a broader company rhythm together. This collection compares five installable setups by job, cadence, team size, and connectors, so you can start with the smallest setup that solves a weekly problem.
            </p>
            <p className="meta mt-3">
              Updated <time dateTime={CHIEF_OF_STAFF_COLLECTION_UPDATED}>30 August 2026</time>
            </p>
          </WingsHero>
        }
      >
        <article className="collection-page">
          <section className="collection-section" aria-labelledby="chief-compare">
            <h2 id="chief-compare">Choose the right Chief of Staff setup</h2>
            <p>
              Start with the narrowest recurring job. Keep human approval on for messages, calendar changes, spending, publishing, and production work while the setup earns trust.
            </p>
            <div className="collection-table-wrap">
              <table className="collection-table">
                <thead>
                  <tr>
                    <th scope="col">Setup</th>
                    <th scope="col">Best for</th>
                    <th scope="col">Cadence</th>
                  </tr>
                </thead>
                <tbody>
                  {choices.map(({ recipe, href, bestFor, cadence }) => (
                    <tr key={recipe.slug}>
                      <th scope="row"><Link href={href}>{grokRecipeTitle(recipe.kind, recipe.name)}</Link></th>
                      <td data-label="Best for">{bestFor}</td>
                      <td data-label="Cadence">{cadence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="collection-section" aria-labelledby="chief-setups">
            <h2 id="chief-setups">Five installable setups</h2>
            <div className="collection-grid">
              {choices.map(({ recipe, href }) => {
                const title = grokRecipeTitle(recipe.kind, recipe.name);
                return (
                  <article className="collection-card" key={recipe.slug}>
                    <div className="collection-card-head">
                      <h3><Link href={href}>{title}</Link></h3>
                      <span className="collection-kind">{recipe.kind === "bot" ? "Bot" : "Team"}</span>
                    </div>
                    <p>{recipe.tagline}</p>
                    <RosterShape bots={recipe.bots} rooms={recipe.rooms.length} routines={recipe.routines} allowTip={false} />
                    <ConnectorRow names={recipe.connectors} labeled size={15} />
                    <Link className="collection-card-link" href={href}>View {title}</Link>
                  </article>
                );
              })}
            </div>
          </section>
        </article>
      </WingsSplit>
    </>
  );
}
