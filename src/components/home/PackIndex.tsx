"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ConnectorRow } from "@/components/ConnectorRow";
import { CopyInstallerButton } from "@/components/CopyInstallerButton";
import { Sparkline } from "@/components/Sparkline";
import { VerifiedChip } from "@/components/VerifiedChip";
import { BotIcon, PackIcon } from "@/components/icons/LineIcons";
import { botIconKey, sectionSlug } from "@/lib/bot-icon";
import { installerPrompt } from "@/lib/installer";
import { en } from "@/lib/messages/en";
import { isExample, isVerified, type Pack } from "@/lib/types";

type Kind = "all" | "pack" | "example";
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
  const addedN = added.reduce((sum, day) => sum + day.count, 0);
  const peak = added.reduce<{ date: string; count: number } | null>((best, day) => {
    if (day.count <= 0) return best;
    if (!best || day.count > best.count) return day;
    return best;
  }, null);

  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const sectionParam = params.get("section") ?? "all";
  const [kind, setKind] = useState<Kind>("all");
  const [connector, setConnector] = useState("all");
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

  const connectors = useMemo(() => {
    const set = new Set<string>();
    for (const pack of packs) for (const name of pack.connectors) set.add(name);
    return [...set].sort();
  }, [packs]);

  const q = query.trim().toLowerCase();
  const filtered = packs.filter((pack) => {
    if (sectionParam !== "all" && sectionSlug(pack.section) !== sectionParam) return false;
    if (kind === "pack" && pack.status !== "pack") return false;
    if (kind === "example" && pack.status !== "example") return false;
    if (connector !== "all" && !pack.connectors.includes(connector)) return false;
    if (!matchesQuery(pack, q)) return false;
    return true;
  });

  function setSection(next: string) {
    const usp = new URLSearchParams(params.toString());
    if (next === "all") usp.delete("section");
    else usp.set("section", next);
    const qs = usp.toString();
    router.replace(qs ? `${pathname}?${qs}#packs` : `${pathname}#packs`, { scroll: false });
  }

  return (
    <section id="packs" className="mt-4">
      <div className="stats-row">
        <div className="stat">
          <p className="stat-label">Packs added</p>
          <p className="stat-value">{addedN}</p>
          <p className="stat-note">
            From git history of packs/*.md
            {peak ? `. ${peak.count} on ${peak.date}` : ""}.
          </p>
          <Sparkline series={added} className="stat-spark" />
        </div>
        <div className="stat">
          <p className="stat-label">Installer copies</p>
          <p className="stat-value">{copies.total}</p>
          <p className="stat-note">Copy installer clicks on this site. Not Grok Bot installs.</p>
        </div>
        <div className="stat">
          <p className="stat-label">Shelf</p>
          <p className="stat-value">{packs.length}</p>
          <p className="stat-note">
            {packs.length} packs · Verified {verifiedOn}
          </p>
        </div>
      </div>

      <label className="search-wrap">
        <span className="sr-only">Search packs</span>
        <input
          className="search-input"
          type="search"
          placeholder="Search name, job, connector, Bot"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      <div className="apd-shell">
        <aside className="cat-rail" aria-label="Pack categories">
          <button type="button" className={`cat-item${sectionParam === "all" ? " is-on" : ""}`} onClick={() => setSection("all")}>
            <span>All packs</span>
            <span>{packs.length}</span>
          </button>
          {categories.map(([name, count]) => {
            const slug = sectionSlug(name);
            return (
              <button key={name} type="button" className={`cat-item${sectionParam === slug ? " is-on" : ""}`} onClick={() => setSection(slug)}>
                <span>{name}</span>
                <span>{count}</span>
              </button>
            );
          })}
        </aside>

        <div>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">{filtered.length} packs</p>
              <h2 className="section-title">{en.home.indexTitle}</h2>
            </div>
            <div className="filter-bar">
              <button type="button" className={`filter-chip${kind === "all" ? " is-on" : ""}`} onClick={() => setKind("all")}>{en.home.filterAll}</button>
              <button type="button" className={`filter-chip${kind === "pack" ? " is-on" : ""}`} onClick={() => setKind("pack")}>{en.home.liveBadge}</button>
              <button type="button" className={`filter-chip${kind === "example" ? " is-on" : ""}`} onClick={() => setKind("example")}>{en.home.exampleBadge}</button>
              {connectors.map((name) => (
                <button key={name} type="button" className={`filter-chip${connector === name ? " is-on" : ""}`} onClick={() => setConnector(connector === name ? "all" : name)}>
                  {name}
                </button>
              ))}
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
                  copies={copies.bySlug[pack.slug] ?? 0}
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
                  copies={copies.bySlug[pack.slug] ?? 0}
                  onToggle={() => setOpen(open === pack.slug ? null : pack.slug)}
                  onCopied={(count, total) => setCopies((c) => ({ total, bySlug: { ...c.bySlug, [pack.slug]: count } }))}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function PackExpandable({
  pack,
  variant,
  open,
  copies,
  onToggle,
  onCopied,
}: {
  pack: Pack;
  variant: "row" | "card";
  open: boolean;
  copies: number;
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
        <button type="button" className="chevron" aria-expanded={open} aria-label={open ? "Collapse pack" : "Expand pack"} onClick={(e) => { e.stopPropagation(); onToggle(); }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d={open ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} />
          </svg>
        </button>
        <PackIcon slug={pack.slug} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <Link href={`/packs/${pack.slug}`} className="index-name" onClick={(e) => e.stopPropagation()}>
              {pack.name}
            </Link>
            <span className="pack-card-meta">{pack.section}</span>
            <span className="pack-card-meta">{pack.bots} bots</span>
            {copies > 0 ? <span className="pack-card-meta">{copies} copies</span> : <span className="pack-card-meta">0 copies</span>}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <ConnectorRow names={pack.connectors} size={16} />
            <span className="inline-flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
              {verified ? <VerifiedChip /> : null}
              <span className="chip">{example ? en.home.exampleBadge : en.home.liveBadge}</span>
            </span>
          </div>
        </div>
      </div>
      {open ? (
        <div className="index-body" onClick={(e) => e.stopPropagation()}>
          <p className="text-[0.92rem] leading-relaxed" style={{ color: "var(--muted)" }}>{pack.tagline}</p>
          <ul className="mt-4">
            {pack.agents.map((agent) => (
              <li key={agent.name} className="bot-row">
                <div className="flex gap-3">
                  <BotIcon name={botIconKey(agent)} />
                  <div className="min-w-0">
                    <p className="font-medium tracking-[-0.02em]">{agent.name}</p>
                    <p className="mt-1 text-[0.88rem] leading-relaxed" style={{ color: "var(--muted)" }}>{agent.persona}</p>
                    {agent.connectors.length > 0 ? (
                      <div className="mt-2">
                        <ConnectorRow names={agent.connectors} labeled size={16} />
                      </div>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <CopyInstallerButton text={prompt} slug={pack.slug} onCopied={onCopied} />
          </div>
        </div>
      ) : null}
    </article>
  );
}
