import type { Metadata } from "next";
import { ConnectorExplorer, type ExplorerEntry } from "@/components/connectors/ConnectorExplorer";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteMasthead } from "@/components/SiteMasthead";
import { ledger } from "@/lib/ledger-theme";
import {
  CATALOG_AS_OF,
  CATALOG_CHECKED_ON,
  CATALOG_SOURCE,
  CONNECTOR_CATALOG,
  catalogByCategory,
  isBuiltIn,
  resolveConnector,
  XAI_CONNECTOR_DOCS,
} from "@/lib/connectors";
import { en } from "@/lib/messages/en";
import { listTeams } from "@/lib/teams";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Grok Bot connectors",
  description: `Every connector Grok Bot supports, ${CONNECTOR_CATALOG.length} of them, by category, with the teams on this shelf that expect each one. Checked ${CATALOG_CHECKED_ON}.`,
  alternates: { canonical: `${site.url}/connectors` },
};

export default function ConnectorsPage() {
  const teams = listTeams();

  // Which teams expect a given connector. Resolve every name a team writes
  // through the same alias-aware resolver the rows use, then compare slugs.
  // Comparing the raw strings misses "Calendar", which is what every team
  // actually writes for Google Calendar.
  const usage = new Map<string, { slug: string; name: string }[]>();
  for (const team of teams) {
    const slugs = new Set<string>();
    for (const name of team.connectors) slugs.add(resolveConnector(name).slug);
    for (const agent of team.agents) for (const name of agent.connectors) slugs.add(resolveConnector(name).slug);
    for (const slug of slugs) {
      const list = usage.get(slug) ?? [];
      list.push({ slug: team.slug, name: team.name });
      usage.set(slug, list);
    }
  }

  const groups = catalogByCategory();
  const categories = groups.map((g) => g.category);
  const entries: ExplorerEntry[] = CONNECTOR_CATALOG.map((e) => ({
    name: e.name,
    slug: e.slug,
    category: e.category,
    builtIn: isBuiltIn(e.slug),
    teams: usage.get(e.slug) ?? [],
  }));
  const builtInCount = entries.filter((e) => e.builtIn).length;

  return (
    <div className="relative flex min-h-dvh flex-col px-6 sm:px-10 lg:px-16" style={{ background: ledger.paper, color: ledger.ink }}>
      <SiteMasthead />
      <main className="relative z-10 mx-auto w-full max-w-4xl flex-1 pb-20 pt-12">
        <h1 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.05]" style={{ fontFamily: ledger.serif }}>
          {en.connectors.h1}
        </h1>
        <p className="mt-5 max-w-2xl text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
          {en.connectors.intro(CONNECTOR_CATALOG.length, builtInCount)}
        </p>
        <p className="mt-4 max-w-2xl text-[0.85rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
          {en.connectors.builtInNote}{" "}
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
        <p className="mt-3 text-[0.62rem] uppercase tracking-[0.18em]" style={{ color: ledger.label }}>
          {en.connectors.checked} <time dateTime={CATALOG_CHECKED_ON}>{CATALOG_CHECKED_ON}</time>
        </p>

        <ConnectorExplorer entries={entries} categories={categories} variant="console" />

        <section className="mt-14 border-t pt-7" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>{en.connectors.byoTitle}</h2>
          <p className="mt-3 max-w-2xl text-[0.9rem] leading-relaxed" style={{ color: ledger.inkMuted }}>{en.connectors.byoBody}</p>
        </section>

        <section className="mt-10 border-t pt-7" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>{en.connectors.retiredTitle}</h2>
          <p className="mt-3 max-w-2xl text-[0.9rem] leading-relaxed" style={{ color: ledger.inkMuted }}>{en.connectors.retiredBody}</p>
        </section>

        <p className="mt-12 max-w-2xl text-[0.78rem] leading-relaxed" style={{ color: ledger.inkFaint }}>
          {en.connectors.marksNote}
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
