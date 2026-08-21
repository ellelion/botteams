import type { Metadata } from "next";
import Link from "next/link";
import { ConnectorRow } from "@/components/ConnectorRow";
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
  BUILT_IN,
} from "@/lib/connectors";
import { en } from "@/lib/messages/en";
import { listPacks } from "@/lib/packs";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Grok Bot connectors",
  description: `Every connector Grok Bot supports, ${CONNECTOR_CATALOG.length} of them, by category, with the teams on this shelf that expect each one. Checked ${CATALOG_CHECKED_ON}.`,
  alternates: { canonical: `${site.url}/connectors` },
};

export default function ConnectorsPage() {
  const packs = listPacks();

  // Which teams expect a given connector. Resolve every name a team writes
  // through the same alias-aware resolver the rows use, then compare slugs.
  // Comparing the raw strings misses "Calendar", which is what every team
  // actually writes for Google Calendar.
  const usage = new Map<string, { slug: string; name: string }[]>();
  for (const pack of packs) {
    const slugs = new Set<string>();
    for (const name of pack.connectors) slugs.add(resolveConnector(name).slug);
    for (const agent of pack.agents) for (const name of agent.connectors) slugs.add(resolveConnector(name).slug);
    for (const slug of slugs) {
      const list = usage.get(slug) ?? [];
      list.push({ slug: pack.slug, name: pack.name });
      usage.set(slug, list);
    }
  }

  const groups = catalogByCategory();

  return (
    <div className="relative flex min-h-dvh flex-col px-6 sm:px-10 lg:px-16" style={{ background: ledger.paper, color: ledger.ink }}>
      <SiteMasthead />
      <main className="relative z-10 mx-auto w-full max-w-2xl flex-1 pb-20 pt-12">
        <p className="text-[0.62rem] uppercase tracking-[0.3em]" style={{ color: ledger.accentText }}>{en.connectors.eyebrow}</p>
        <h1 className="font-display mt-4 text-[clamp(2rem,4vw,3.2rem)] font-light leading-[1.05]" style={{ fontFamily: ledger.serif }}>
          {en.connectors.h1}
        </h1>
        <p className="mt-5 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
          {en.connectors.intro(CONNECTOR_CATALOG.length, CONNECTOR_CATALOG.filter((e) => isBuiltIn(e.slug)).length)}
        </p>
        <p className="mt-4 text-[0.85rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
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

        {groups.map((group) => (
          <section key={group.category} className="mt-12 border-t pt-7" style={{ borderColor: ledger.hairline }}>
            <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>
              {group.category}
            </h2>
            <ul className="mt-4">
              {group.entries.map((entry) => {
                const teams = usage.get(entry.slug) ?? [];
                return (
                  <li key={entry.slug} className="hairline-row flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3">
                    <span className="flex flex-wrap items-center gap-2">
                      <ConnectorRow names={[entry.name]} labeled size={18} />
                      {isBuiltIn(entry.slug) ? <span className="bot-tag">{en.connectors.builtInLabel}</span> : null}
                    </span>
                    {teams.length > 0 ? (
                      <span className="text-[0.72rem]" style={{ color: ledger.inkMuted }}>
                        {teams.slice(0, 3).map((team, i) => (
                          <span key={team.slug}>
                            {i > 0 ? ", " : ""}
                            <Link href={`/teams/${team.slug}`} className="accent-hover underline">
                              {team.name}
                            </Link>
                          </span>
                        ))}
                        {teams.length > 3 ? en.connectors.andMore(teams.length - 3) : null}
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        <section className="mt-12 border-t pt-7" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>{en.connectors.byoTitle}</h2>
          <p className="mt-3 text-[0.9rem] leading-relaxed" style={{ color: ledger.inkMuted }}>{en.connectors.byoBody}</p>
        </section>

        <section className="mt-10 border-t pt-7" style={{ borderColor: ledger.hairline }}>
          <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>{en.connectors.retiredTitle}</h2>
          <p className="mt-3 text-[0.9rem] leading-relaxed" style={{ color: ledger.inkMuted }}>{en.connectors.retiredBody}</p>
        </section>

        <p className="mt-12 text-[0.78rem] leading-relaxed" style={{ color: ledger.inkFaint }}>
          {en.connectors.marksNote}
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
