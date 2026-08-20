"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ConnectorRow } from "@/components/ConnectorRow";
import { CopyInstallerButton } from "@/components/CopyInstallerButton";
import { Sparkline } from "@/components/Sparkline";
import { VerifiedChip } from "@/components/VerifiedChip";
import { BotIcon } from "@/components/icons/LineIcons";
import { botIconKey, sectionSlug } from "@/lib/bot-icon";
import { installerPrompt } from "@/lib/installer";
import { ledger } from "@/lib/ledger-theme";
import { en } from "@/lib/messages/en";
import { isExample, isVerified, type Pack } from "@/lib/types";

type View = "table" | "cards";

function matchesQuery(pack: Pack, q: string): boolean {
  if (!q) return true;
  const hay = [
    pack.name,
    pack.tagline,
    pack.section,
    pack.slug,
    ...pack.connectors,
    ...pack.agents.map((a) => a.name),
    ...pack.agents.map((a) => a.persona),
  ].join(" ").toLowerCase();
  return hay.includes(q);
}

export function PackIndex({
  packs,
  added,
  verifiedOn,
}: {
  packs: Pack[];
  added: { date: string; count: number }[];
  verifiedOn: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const sectionParam = params.get("section") ?? "all";
  const [view, setView] = useState<View>("table");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [copies, setCopies] = useState<{ total: number; bySlug: Record<string, number> }>({ total: 0, bySlug: {} });

  useEffect(() => {
    fetch("/api/copy")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.total === "number") setCopies({ total: data.total, bySlug: data.bySlug ?? {} });
      })
      .catch(() => {});
  }, []);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const pack of packs) map.set(pack.section, (map.get(pack.section) ?? 0) + 1);
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [packs]);

  const q = query.trim().toLowerCase();
  const filtered = packs.filter((pack) => {
    if (sectionParam !== "all" && sectionSlug(pack.section) !== sectionParam) return false;
    if (!matchesQuery(pack, q)) return false;
    return true;
  });

  function setSection(next: string) {
    const usp = new URLSearchParams(params.toString());
    if (next === "all") usp.delete("section");
    else usp.set("section", next);
    const qs = usp.toString();
    router.replace(qs ? `${pathname}?${qs}#teams` : `${pathname}#teams`, { scroll: false });
  }

  return (
    <section id="teams">
      <div className="stats-strip">
        <p className="stats-line">{`${packs.length} teams · ${copies.total} copies · verified ${verifiedOn}`}</p>
        <Sparkline series={added} className="stat-spark" />
      </div>

      <label className="search-wrap">
        <span className="sr-only">Search teams</span>
        <input
          className="search-input"
          type="search"
          placeholder="Search name, job, connector, Bot"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      <nav className="cat-wrap" aria-label="Team categories">
        <button type="button" className={`cat-chip${sectionParam === "all" ? " is-on" : ""}`} onClick={() => setSection("all")}>
          All
        </button>
        {categories.map(([name]) => {
          const slug = sectionSlug(name);
          return (
            <button key={name} type="button" className={`cat-chip${sectionParam === slug ? " is-on" : ""}`} onClick={() => setSection(slug)}>
              {name}
            </button>
          );
        })}
      </nav>

      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="section-title">{en.home.indexTitle}</h2>
        <div className="filter-bar">
          <button type="button" className={`filter-chip${view === "table" ? " is-on" : ""}`} onClick={() => setView("table")}>{en.home.viewTable}</button>
          <button type="button" className={`filter-chip${view === "cards" ? " is-on" : ""}`} onClick={() => setView("cards")}>{en.home.viewCards}</button>
        </div>
      </div>

      {view === "table" ? (
        <div className="pack-table">
          {filtered.map((pack) => (
            <PackExpandable
              key={pack.slug}
              pack={pack}
              variant="row"
              open={open === pack.slug}
              onToggle={() => setOpen(open === pack.slug ? null : pack.slug)}
              onCopied={(count, total) => setCopies((c) => ({ total, bySlug: { ...c.bySlug, [pack.slug]: count } }))}
            />
          ))}
        </div>
      ) : (
        <div className="pack-grid">
          {filtered.map((pack) => (
            <PackExpandable
              key={pack.slug}
              pack={pack}
              variant="card"
              open={open === pack.slug}
              onToggle={() => setOpen(open === pack.slug ? null : pack.slug)}
              onCopied={(count, total) => setCopies((c) => ({ total, bySlug: { ...c.bySlug, [pack.slug]: count } }))}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function PackExpandable({
  pack,
  variant,
  open,
  onToggle,
  onCopied,
}: {
  pack: Pack;
  variant: "row" | "card";
  open: boolean;
  onToggle: () => void;
  onCopied: (count: number, total: number) => void;
}) {
  const example = isExample(pack);
  const verified = isVerified(pack);
  const prompt = installerPrompt(pack);
  const shellClass = variant === "card" ? "pack-card" : "index-row";

  return (
    <article className={`${shellClass}${open ? " is-open" : ""}`}>
      <div className="index-head" onClick={onToggle} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(); } }}>
        <button type="button" className="chevron" aria-expanded={open} aria-label={open ? "Collapse team" : "Expand team"} onClick={(e) => { e.stopPropagation(); onToggle(); }}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d={open ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} />
          </svg>
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
            <Link href={`/teams/${pack.slug}`} className="index-name" onClick={(e) => e.stopPropagation()}>
              {pack.name}
            </Link>
            <span className="pack-card-meta">{`${pack.bots} bots`}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2.5">
            <ConnectorRow names={pack.connectors} size={14} />
            <span className="inline-flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
              {verified ? <VerifiedChip /> : null}
              <span className="chip">{example ? en.home.exampleBadge : en.home.liveBadge}</span>
            </span>
          </div>
        </div>
      </div>
      {open ? (
        <div className="index-body" onClick={(e) => e.stopPropagation()}>
          <p className="text-[0.82rem] leading-relaxed" style={{ color: ledger.inkFaint }}>{pack.tagline}</p>
          <ul className="mt-2">
            {pack.agents.map((agent) => (
              <li key={agent.name} className="bot-row">
                <div className="flex items-start gap-2">
                  <BotIcon name={botIconKey(agent)} />
                  <div className="min-w-0">
                    <p className="text-[0.92rem]" style={{ fontFamily: ledger.serif }}>{agent.name}</p>
                    <p className="mt-0.5 text-[0.75rem] leading-snug" style={{ color: ledger.inkMuted }}>{agent.persona}</p>
                    {agent.connectors.length > 0 ? (
                      <div className="mt-1">
                        <ConnectorRow names={agent.connectors} size={14} />
                      </div>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <CopyInstallerButton text={prompt} slug={pack.slug} onCopied={onCopied} />
          </div>
        </div>
      ) : null}
    </article>
  );
}
