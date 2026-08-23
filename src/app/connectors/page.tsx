import type { Metadata } from "next";
import { ConnectorFinder, type FinderEntry } from "@/components/connectors/ConnectorFinder";
import { WingsHero, WingsSplit } from "@/components/WingsSplit";
import { ledger } from "@/lib/ledger-theme";
import {
  CATALOG_AS_OF,
  CATALOG_CHECKED_ON,
  CATALOG_SOURCE,
  CONNECTOR_CATALOG,
  aliasesBySlug,
  catalogByCategory,
  isBuiltIn,
  resolveConnector,
  XAI_CONNECTOR_DOCS,
} from "@/lib/connectors";
import { en } from "@/lib/messages/en";
import { listAll } from "@/lib/teams";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Grok Bot connectors",
  description: `Every connector Grok Bot supports, ${CONNECTOR_CATALOG.length} of them, by category, with the teams here that expect each one. Checked ${CATALOG_CHECKED_ON}.`,
  alternates: { canonical: `${site.url}/connectors` },
};

export default function ConnectorsPage() {
  const teams = listAll();

  // Which teams expect a given connector. Resolve every name a team writes
  // through the same alias-aware resolver the rows use, then compare slugs.
  // Comparing the raw strings misses "Calendar", which is what every team
  // actually writes for Google Calendar.
  const usage = new Map<string, number>();
  for (const team of teams) {
    const slugs = new Set<string>();
    for (const name of team.connectors) slugs.add(resolveConnector(name).slug);
    for (const agent of team.agents) for (const name of agent.connectors) slugs.add(resolveConnector(name).slug);
    for (const slug of slugs) usage.set(slug, (usage.get(slug) ?? 0) + 1);
  }

  const aliases = aliasesBySlug();
  const categories = catalogByCategory().map((g) => g.category);
  const entries: FinderEntry[] = CONNECTOR_CATALOG.map((e) => ({
    name: e.name,
    slug: e.slug,
    category: e.category,
    builtIn: isBuiltIn(e.slug),
    teams: usage.get(e.slug) ?? 0,
    aliases: aliases.get(e.slug) ?? [],
  }));
  const builtInCount = entries.filter((e) => e.builtIn).length;

  return (
    <WingsSplit
      hero={
        <WingsHero title={en.connectors.h1}>
          <p className="mt-5 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
            {en.connectors.lede(CONNECTOR_CATALOG.length)}
          </p>
        </WingsHero>
      }
    >
        {/* The finder comes before the provenance. Every claim below is
            still on the page and still checkable, but a visitor looking for
            Gmail should not have to read two paragraphs about where the
            list came from to reach the search field. */}
        <ConnectorFinder entries={entries} categories={categories} />

        <section className="mt-20 border-t pt-8" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>{en.connectors.sourceTitle}</h2>
          <p className="measure mt-3 text-[0.85rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
            {en.connectors.builtInNote(builtInCount)}{" "}
            <a className="accent-hover underline" href={XAI_CONNECTOR_DOCS} target="_blank" rel="noopener noreferrer">
              {en.connectors.builtInSource}
            </a>
            {". "}
            {en.connectors.sourceNote}{" "}
            <a className="accent-hover underline" href={CATALOG_SOURCE} target="_blank" rel="noopener noreferrer">
              {en.connectors.sourceLabel}
            </a>
            {en.connectors.sourceTail(CATALOG_AS_OF)}
          </p>
          <p className="meta mt-3">
            {en.connectors.checked} <time dateTime={CATALOG_CHECKED_ON}>{CATALOG_CHECKED_ON}</time>
          </p>
        </section>

        <section className="mt-20 border-t pt-8" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>{en.connectors.byoTitle}</h2>
          <p className="measure mt-3 text-[0.9rem] leading-relaxed" style={{ color: ledger.inkMuted }}>{en.connectors.byoBody}</p>
        </section>

        <section className="mt-10 border-t pt-7" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>{en.connectors.retiredTitle}</h2>
          <p className="measure mt-3 text-[0.9rem] leading-relaxed" style={{ color: ledger.inkMuted }}>{en.connectors.retiredBody}</p>
        </section>

        <p className="measure mt-12 text-[0.78rem] leading-relaxed" style={{ color: ledger.inkFaint }}>
          {en.connectors.marksNote}
        </p>
    </WingsSplit>
  );
}
