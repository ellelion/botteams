"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ConnectorRow } from "@/components/ConnectorRow";
import { SectionIcon } from "@/components/icons/LineIcons";
import { Select, type SelectOption } from "@/components/ui/Select";
import { CopyInstallerButton } from "@/components/CopyInstallerButton";
import { Sparkline } from "@/components/Sparkline";
import { VerifiedChip } from "@/components/VerifiedChip";
import { GrokBotMark } from "@/components/icons/GrokBotMark";
import { botMarkStyle, sectionSlug } from "@/lib/bot-icon";
import { installerPrompt } from "@/lib/installer";
import { ledger } from "@/lib/ledger-theme";
import { en } from "@/lib/messages/en";
import { isVerified, type Pack } from "@/lib/types";
import { resolveConnector, resolveConnectors } from "@/lib/connectors";

/*
 * Three index layouts, one filter model.
 *   ledger   grouped hairline rows. Densest, closest to the house style.
 *   columns  a real table: team, category, bots, connectors. F-pattern,
 *            titles left, metadata secondary, best for comparing.
 *   cards    two-up with the tagline visible. Browsing rather than looking
 *            something up.
 */
type View = "ledger" | "columns" | "cards";

const VIEWS: { id: View; label: string }[] = [
  { id: "ledger", label: "Ledger" },
  { id: "columns", label: "Columns" },
  { id: "cards", label: "Cards" },
];

/*
 * Three ways to present 26 categories, to be chosen between and then cut
 * down to one. The problem each solves is the same: 26 uppercase labels set
 * inline wrap to three dense lines that read as a masthead, not a control.
 *   rail   one scrolling row of icon pills. Keeps every category visible
 *          and in one line of the page instead of three.
 *   menu   no list at all. Category becomes a select beside the other two,
 *          which is the smallest the header can be.
 *   tiles  a grid of icon, name, count. Browsing-first: the category is
 *          the thing you are choosing, not a filter on something else.
 */
type Browse = "rail" | "menu" | "tiles";

const BROWSE: { id: Browse; label: string }[] = [
  { id: "rail", label: "Rail" },
  { id: "menu", label: "Menu" },
  { id: "tiles", label: "Tiles" },
];

/* "All" needs a mark too, or the first pill is the only bare one. */
function AllIcon() {
  return (
    <svg className="line-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
    </svg>
  );
}

/* The connector's own logo in the option row. This is the reason the native
   select had to go: it cannot render one. */
function ConnectorGlyph({ name }: { name: string }) {
  const mark = resolveConnector(name);
  if (!mark.src) return <span className="connector-fallback" aria-hidden>{mark.name.slice(0, 1)}</span>;
  return <img src={mark.src} alt="" width={16} height={16} className="connector-mark" />;
}

/* The affordance that says "there is a page behind this row". In columns
   the whole row is already a link, so the arrow is decorative there; in the
   ledger the row toggles instead, so the arrow is the real link out. */
function TeamArrow() {
  return (
    <svg className="row-arrow-glyph" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h13M12 6l6 6-6 6" />
    </svg>
  );
}

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
  const sectionParam = params.get("category") ?? params.get("section") ?? "all";
  const integrationParam = params.get("integration") ?? "all";
  const sortParam = params.get("sort") === "name" ? "name" : "newest";
  const [view, setView] = useState<View>("ledger");
  const [browse, setBrowse] = useState<Browse>("rail");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const pack of packs) map.set(pack.section, (map.get(pack.section) ?? 0) + 1);
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [packs]);

  const connectorOptions = useMemo(() => {
    const map = new Map<string, number>();
    for (const pack of packs) {
      for (const mark of resolveConnectors(pack.connectors)) {
        map.set(mark.name, (map.get(mark.name) ?? 0) + 1);
      }
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [packs]);

  const categoryOptions: SelectOption[] = useMemo(
    () => [
      { value: "all", label: en.home.filterAll, count: packs.length, icon: <AllIcon /> },
      ...categories.map(([name, count]) => ({
        value: sectionSlug(name),
        label: name,
        count,
        icon: <SectionIcon section={name} />,
      })),
    ],
    [categories, packs.length],
  );

  const connectorSelectOptions: SelectOption[] = useMemo(
    () => [
      { value: "all", label: en.home.anyConnector },
      ...connectorOptions.map(([name, count]) => ({
        value: name,
        label: name,
        count,
        icon: <ConnectorGlyph name={name} />,
      })),
    ],
    [connectorOptions],
  );

  const sortOptions: SelectOption[] = [
    { value: "newest", label: en.home.sortNewest },
    { value: "name", label: en.home.sortName },
  ];

  const q = query.trim().toLowerCase();
  const filtered = packs.filter((pack) => {
    if (sectionParam !== "all" && sectionSlug(pack.section) !== sectionParam) return false;
    if (integrationParam !== "all") {
      const want = resolveConnector(integrationParam).slug;
      if (!pack.connectors.some((c) => resolveConnector(c).slug === want)) return false;
    }
    if (!matchesQuery(pack, q)) return false;
    return true;
  });
  /* Newest matches the API default. The index has no dates of its own, so
     it mirrors the file order the API sorts on and falls back to name. */
  const sorted = sortParam === "name" ? [...filtered].sort((a, b) => a.name.localeCompare(b.name)) : filtered;

  /* One writer for every filter, so each one lands in the URL and the page
     stays shareable. "all" clears rather than encoding a default. */
  function setParam(key: string, next: string) {
    const usp = new URLSearchParams(params.toString());
    usp.delete("section");
    if (!next || next === "all" || (key === "sort" && next === "newest")) usp.delete(key);
    else usp.set(key, next);
    const qs = usp.toString();
    router.replace(qs ? `${pathname}?${qs}#teams` : `${pathname}#teams`, { scroll: false });
  }
  const setSection = (next: string) => setParam("category", next);

  return (
    <section id="teams">
      <div className="stats-strip">
        <p className="stats-line">{`${packs.length} teams · verified ${verifiedOn}`}</p>
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

      <div className="browse-pick">
        <span className="browse-pick-label">{en.home.browseLabel}</span>
        {BROWSE.map((b) => (
          <button
            key={b.id}
            type="button"
            className={`browse-pick-btn${browse === b.id ? " is-on" : ""}`}
            aria-pressed={browse === b.id}
            onClick={() => setBrowse(b.id)}
          >
            {b.label}
          </button>
        ))}
      </div>

      {browse === "rail" ? (
        <nav className="cat-rail" aria-label={en.home.categoriesAria}>
          <ul className="cat-rail-track">
            {categoryOptions.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  className={`cat-pill${sectionParam === option.value ? " is-on" : ""}`}
                  aria-pressed={sectionParam === option.value}
                  onClick={() => setSection(option.value)}
                >
                  <span className="cat-pill-icon" aria-hidden>{option.icon}</span>
                  <span className="cat-pill-name">{option.label}</span>
                  <span className="cat-pill-count">{option.count}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {browse === "tiles" ? (
        <nav className="cat-tiles" aria-label={en.home.categoriesAria}>
          {categoryOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`cat-tile${sectionParam === option.value ? " is-on" : ""}`}
              aria-pressed={sectionParam === option.value}
              onClick={() => setSection(option.value)}
            >
              <span className="cat-tile-icon" aria-hidden>{option.icon}</span>
              <span className="cat-tile-name">{option.label}</span>
              <span className="cat-tile-count">{option.count}</span>
            </button>
          ))}
        </nav>
      ) : null}

      <div className="index-header">
        <h2 className="section-title">{en.home.indexTitle}</h2>
        <div className="filter-bar">
          {browse === "menu" ? (
            <Select
              id="index-category"
              label={en.home.filterCategory}
              value={sectionParam}
              options={categoryOptions}
              onChange={setSection}
            />
          ) : null}
          <Select
            id="index-integration"
            label={en.home.filterConnector}
            value={integrationParam}
            options={connectorSelectOptions}
            onChange={(next) => setParam("integration", next)}
          />
          <Select
            id="index-sort"
            label={en.home.sortLabel}
            value={sortParam}
            options={sortOptions}
            onChange={(next) => setParam("sort", next)}
            align="end"
          />
          <span className="filter-views">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                type="button"
                className={`filter-chip${view === v.id ? " is-on" : ""}`}
                aria-pressed={view === v.id}
                onClick={() => setView(v.id)}
              >
                {v.label}
              </button>
            ))}
          </span>
        </div>
      </div>

      {view === "columns" ? (
        <div className="idx-cols" role="table" aria-label={en.home.indexTitle}>
          <div className="idx-colhead" role="row">
            <span role="columnheader">{en.home.colTeam}</span>
            <span role="columnheader">{en.home.colCategory}</span>
            <span role="columnheader" className="idx-num">{en.home.colBots}</span>
            <span role="columnheader">{en.home.colConnectors}</span>
            <span role="columnheader"><span className="sr-only">{en.home.openTeam}</span></span>
          </div>
          {sorted.map((pack) => (
            <Link key={pack.slug} href={`/teams/${pack.slug}`} className="idx-colrow" role="row">
              <span className="idx-colcell" role="cell">
                <span className="idx-colname">{pack.name}</span>
                <span className="idx-coltag">{pack.tagline}</span>
              </span>
              <span className="idx-colcat" role="cell">{pack.section}</span>
              <span className="idx-num" role="cell">{pack.bots}</span>
              <span className="idx-colconn" role="cell"><ConnectorRow names={pack.connectors} size={15} /></span>
              <span className="row-arrow" role="cell"><TeamArrow /></span>
            </Link>
          ))}
        </div>
      ) : view === "cards" ? (
        <div className="idx-cards">
          {sorted.map((pack) => (
            <Link key={pack.slug} href={`/teams/${pack.slug}`} className="idx-card">
              <span className="idx-card-cat">{pack.section}</span>
              <span className="idx-card-name">{pack.name}</span>
              <span className="idx-card-tag">{pack.tagline}</span>
              <span className="idx-card-foot">
                <ConnectorRow names={pack.connectors} size={15} />
                <span className="idx-card-bots">{`${pack.bots} Bots`}</span>
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="pack-table">
          {sorted.map((pack) => (
            <PackExpandable
              key={pack.slug}
              pack={pack}
              variant="row"
              open={open === pack.slug}
              onToggle={() => setOpen(open === pack.slug ? null : pack.slug)}
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
}: {
  pack: Pack;
  variant: "row" | "card";
  open: boolean;
  onToggle: () => void;
}) {
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
          <p className="index-tagline">{pack.tagline}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <ConnectorRow names={pack.connectors} labeled size={16} />
            <span className="inline-flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
              {verified ? <VerifiedChip /> : null}
            </span>
          </div>
        </div>
        <Link
          href={`/teams/${pack.slug}`}
          className="row-arrow row-arrow-link"
          aria-label={`${en.home.openTeam}: ${pack.name}`}
          onClick={(e) => e.stopPropagation()}
        >
          <TeamArrow />
        </Link>
      </div>
      {open ? (
        <div className="index-body" onClick={(e) => e.stopPropagation()}>
          <ul>
            {pack.agents.map((agent, i) => (
              <li key={agent.name} className="bot-row">
                <div className="flex items-start gap-2">
                  <GrokBotMark size={17} animate className="mt-0.5" style={botMarkStyle(i)} />
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-baseline gap-2 text-[0.92rem]" style={{ fontFamily: ledger.serif }}>
                      {agent.name}
                      <span className="bot-tag">{en.pack.botTag}</span>
                    </p>
                    <p className="mt-0.5 text-[0.75rem] leading-snug" style={{ color: ledger.inkMuted }}>{agent.persona}</p>
                    {agent.connectors.length > 0 ? (
                      <div className="mt-1.5">
                        <ConnectorRow names={agent.connectors} labeled size={15} />
                      </div>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <CopyInstallerButton text={prompt} />
          </div>
        </div>
      ) : null}
    </article>
  );
}
