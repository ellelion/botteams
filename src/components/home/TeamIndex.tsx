"use client";

import { startTransition, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ConnectorRow } from "@/components/ConnectorRow";
import { SectionIcon } from "@/components/icons/LineIcons";
import { Select, type SelectOption } from "@/components/ui/Select";
import { CopyInstallerButton } from "@/components/CopyInstallerButton";
import { FeaturedChip } from "@/components/FeaturedChip";
import { FromXaiChip } from "@/components/FromXaiChip";
import { GrokBotMark } from "@/components/icons/GrokBotMark";
import { RosterShape } from "@/components/RosterShape";
import { botMarkStyle, sectionSlug } from "@/lib/bot-icon";
import { installerPrompt } from "@/lib/installer";
import { ledger } from "@/lib/ledger-theme";
import { en } from "@/lib/messages/en";
import { grokDisplayBotName, grokRecipeTitle } from "@/lib/grok-names";
import { type Team } from "@/lib/types";
import { houseSlots, sponsorHref, type SponsorSlot } from "@/data/sponsors";
import { SponsorTicker } from "@/components/SponsorTicker";
import { resolveConnector, resolveConnectors } from "@/lib/connectors";

/*
 * Two index layouts, one filter model.
 *   ledger   grouped hairline rows. Densest, closest to the house style.
 *   cards    two-up with the tagline visible. Browsing rather than looking
 *            something up.
 */
type View = "ledger" | "cards";

function ViewListIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <rect x="4.5" y="3.5" width="15" height="17" rx="3" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <rect x="7" y="6.2" width="10" height="2.4" rx="1.1" />
      <rect x="7" y="10.8" width="10" height="2.4" rx="1.1" />
      <rect x="7" y="15.4" width="10" height="2.4" rx="1.1" />
    </svg>
  );
}

function ViewGridIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <rect x="4.5" y="3.5" width="15" height="17" rx="3" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <rect x="6.8" y="6" width="4.4" height="4.4" rx="1" />
      <rect x="12.8" y="6" width="4.4" height="4.4" rx="1" />
      <rect x="6.8" y="13.2" width="4.4" height="4.4" rx="1" />
      <rect x="12.8" y="13.2" width="4.4" height="4.4" rx="1" />
    </svg>
  );
}

const VIEWS: { id: View; label: string; icon: ReactNode }[] = [
  { id: "ledger", label: "List", icon: <ViewListIcon /> },
  { id: "cards", label: "Cards", icon: <ViewGridIcon /> },
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

/* A Bot lives under /bots, a team under /teams. Nothing renders a link
   from the noun in the surrounding copy; it comes from the item. */
function hrefFor(team: Team): string {
  return `/${team.kind === "bot" ? "bots" : "teams"}/${team.slug}`;
}

function matchesQuery(team: Team, q: string): boolean {
  if (!q) return true;
  const hay = [
    team.name,
    team.tagline,
    team.section,
    team.slug,
    ...team.connectors,
    ...team.agents.map((a) => a.name),
    ...team.agents.map((a) => a.persona),
  ].join(" ").toLowerCase();
  return hay.includes(q);
}


const AD_EVERY = 7;
const SLOT_EVERY = 21;

type ListingRow =
  | { kind: "team"; team: Team }
  | { kind: "ad"; slot: SponsorSlot; key: string }
  | { kind: "slot"; key: string };

function interleaveAds(teams: Team[], ads: SponsorSlot[]): ListingRow[] {
  const pool = ads.length ? ads : houseSlots;
  const out: ListingRow[] = [];
  let n = 0;
  teams.forEach((team, i) => {
    out.push({ kind: "team", team });
    const k = i + 1;
    if (k % SLOT_EVERY === 0) {
      out.push({ kind: "slot", key: `slot-${i}` });
    } else if (k % AD_EVERY === 0) {
      const slot = pool[(n + 1) % pool.length];
      out.push({ kind: "ad", slot, key: `ad-${i}-${slot.id}` });
      n += 1;
    }
  });
  return out;
}

function ListingAd({ slot, as }: { slot: SponsorSlot; as: "row" | "card" }) {
  return (
    <a
      className={as === "card" ? "idx-card idx-ad" : "index-ad"}
      href={sponsorHref(slot, "rail")}
      target="_blank"
      rel={slot.owned ? "nofollow noopener noreferrer" : "noopener sponsored"}
      aria-label={`${en.sponsor.listingKicker}: ${slot.name ?? "Sponsor"}`}
    >
      <span className="idx-ad-kicker">{en.sponsor.listingKicker}</span>
      <span className="idx-ad-body">
        <span className="idx-ad-name">
          {slot.mark ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="spon-chip-mark" src={slot.mark} alt="" width={16} height={16} />
          ) : null}
          {slot.name ?? "Sponsor"}
        </span>
        {slot.line ? <span className="idx-ad-line">{slot.line}</span> : null}
      </span>
    </a>
  );
}

function ListingSlot({ as }: { as: "row" | "card" }) {
  return (
    <a className={as === "card" ? "idx-card idx-ad idx-ad-open" : "index-ad index-ad-open"} href="/sponsor">
      <span className="idx-ad-kicker">{en.sponsor.takeSlot}</span>
      <span className="idx-ad-body">
        <span className="idx-ad-name">{en.sponsor.putListing}</span>
      </span>
    </a>
  );
}

const VIEW_KEY = "botteams.indexView";
const viewListeners = new Set<() => void>();

function readStoredView(): View {
  try {
    const stored = window.localStorage.getItem(VIEW_KEY);
    return stored === "cards" || stored === "ledger" ? stored : "ledger";
  } catch {
    return "ledger";
  }
}

function subscribeView(listener: () => void) {
  viewListeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    viewListeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function writeView(next: View) {
  try {
    window.localStorage.setItem(VIEW_KEY, next);
  } catch {
    /* private mode */
  }
  for (const listener of viewListeners) listener();
}

export function TeamIndexFallback() {
  return (
    <div className="idx-skel" aria-busy="true" aria-live="polite">
      <span className="sr-only">{en.home.loading}</span>
      <div className="idx-skel-search" />
      <div className="idx-skel-pills" />
      <div className="idx-skel-row" />
      <div className="idx-skel-row" />
      <div className="idx-skel-row" />
      <div className="idx-skel-row" />
    </div>
  );
}

export function TeamIndex({ teams }: { teams: Team[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const paramsString = params.toString();
  const qParam = params.get("q") ?? "";
  const sectionParam = params.get("category") ?? params.get("section") ?? "all";
  const integrationParam = params.get("integration") ?? "all";
  const sortParam = params.get("sort") === "name" ? "name" : "newest";
  /* Three shelves, not two. Absent means our own company teams, which is
     what a visitor should land on: 56 one-Bot jobs sourced from xAI would
     otherwise be most of the first screen. */
  /* The shelf, not the source. From xAI is a badge on a card, not a
     filter: some Bots may be ours one day, and they will still be Bots. */
  const kindRaw = params.get("kind");
  const kindParam: "team" | "bot" | "all" = kindRaw === "bot" ? "bot" : kindRaw === "all" ? "all" : "team";
  const view = useSyncExternalStore(subscribeView, readStoredView, () => "ledger");
  const [query, setQuery] = useState(qParam);
  const [open, setOpen] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const fromSelf = useRef(false);

  useEffect(() => {
    if (fromSelf.current) {
      fromSelf.current = false;
      return;
    }
    setQuery(qParam);
  }, [qParam]);

  useEffect(() => {
    const next = query.trim();
    if (next === qParam) return;
    const handle = window.setTimeout(() => {
      fromSelf.current = true;
      const usp = new URLSearchParams(paramsString);
      if (!next) usp.delete("q");
      else usp.set("q", next);
      const qs = usp.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    }, 250);
    return () => window.clearTimeout(handle);
  }, [query, qParam, paramsString, pathname, router]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const el = document.activeElement;
      const typing = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || (el instanceof HTMLElement && el.isContentEditable);
      if ((event.key === "k" && (event.metaKey || event.ctrlKey)) || (event.key === "/" && !typing)) {
        event.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
      if (event.key === "Escape" && el === searchRef.current) {
        setQuery("");
        searchRef.current?.blur();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Everything below filters within the chosen shelf, so a category count
     never promises rows the current shelf will not show. */
  const inSource = useMemo(
    () => teams.filter((t) => (kindParam === "all" ? true : t.kind === kindParam)),
    [teams, kindParam],
  );
  const botCount = useMemo(() => teams.filter((t) => t.kind === "bot").length, [teams]);
  const teamCount = teams.length - botCount;

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const team of inSource) map.set(team.section, (map.get(team.section) ?? 0) + 1);
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [inSource]);

  const connectorOptions = useMemo(() => {
    const map = new Map<string, number>();
    for (const team of inSource) {
      for (const mark of resolveConnectors(team.connectors)) {
        map.set(mark.name, (map.get(mark.name) ?? 0) + 1);
      }
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [inSource]);

  const categoryOptions: SelectOption[] = useMemo(
    () => [
      { value: "all", label: en.home.filterAll, count: inSource.length, icon: <AllIcon /> },
      ...categories.map(([name, count]) => ({
        value: sectionSlug(name),
        label: name,
        count,
        icon: <SectionIcon section={name} />,
      })),
    ],
    [categories, inSource.length],
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
  const filtered = inSource.filter((team) => {
    if (sectionParam !== "all" && sectionSlug(team.section) !== sectionParam) return false;
    if (integrationParam !== "all") {
      const want = resolveConnector(integrationParam).slug;
      if (!team.connectors.some((c) => resolveConnector(c).slug === want)) return false;
    }
    if (!matchesQuery(team, q)) return false;
    return true;
  });
  /* Newest matches the API default. The index has no dates of its own, so
     it mirrors the file order the API sorts on and falls back to name. */
  const sorted = [...filtered].sort((a, b) => {
    const feat = Number(!!b.featured) - Number(!!a.featured);
    if (feat) return feat;
    if (sortParam === "name") return a.name.localeCompare(b.name);
    return String(b.addedAt ?? "").localeCompare(String(a.addedAt ?? "")) || a.slug.localeCompare(b.slug);
  });

  /* One writer for every filter, so each one lands in the URL and the page
     stays shareable. "all" clears rather than encoding a default. */
  function setParam(key: string, next: string) {
    const usp = new URLSearchParams(paramsString);
    usp.delete("section");
    if (!next || next === "all" || (key === "sort" && next === "newest")) usp.delete(key);
    else usp.set(key, next);
    const qs = usp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }
  const setSection = (next: string) => setParam("category", next);

  /* "all" means everything here, not "no filter", so this cannot go
     through setParam, which treats "all" as a clear. Switching shelf also
     drops the category, which belongs to the shelf you just left. */
  function setKind(next: "team" | "bot" | "all") {
    const usp = new URLSearchParams(paramsString);
    usp.delete("section");
    usp.delete("category");
    if (next === "team") usp.delete("kind");
    else usp.set("kind", next);
    const qs = usp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const categoryLabel = categoryOptions.find((option) => option.value === sectionParam)?.label;
  const hasFilters = Boolean(query.trim()) || sectionParam !== "all" || integrationParam !== "all";

  function clearFilters() {
    setQuery("");
    fromSelf.current = true;
    const usp = new URLSearchParams(paramsString);
    usp.delete("q");
    usp.delete("category");
    usp.delete("section");
    usp.delete("integration");
    const qs = usp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    searchRef.current?.focus();
  }

  const listing = sorted.length === 0 ? (
    <div className="idx-empty">
      <p className="idx-empty-title">{en.home.emptyTitle(query.trim())}</p>
      <p className="idx-empty-body">{en.home.emptyBody}</p>
      <button type="button" className="cf-browse" onClick={clearFilters}>
        {en.home.clearFilters}
      </button>
    </div>
  ) : view === "cards" ? (
    <div className="idx-cards">
      {interleaveAds(sorted, houseSlots).map((row) =>
        row.kind === "ad" ? (
          <ListingAd key={row.key} slot={row.slot} as="card" />
        ) : row.kind === "slot" ? (
          <ListingSlot key={row.key} as="card" />
        ) : (
          <Link key={row.team.slug} href={hrefFor(row.team)} className="idx-card">
            <span className="idx-card-cat">
              {kindParam === "all" ? `${row.team.kind === "bot" ? en.home.labelBot : en.home.labelTeam} · ` : ""}
              {row.team.section}
            </span>
            <span className="idx-card-name">{grokRecipeTitle(row.team.kind, row.team.name)}</span>
            <span className="idx-card-tag">{row.team.tagline}</span>
            <span className="idx-card-foot">
              <ConnectorRow names={row.team.connectors} size={15} />
              <span className="idx-card-bots"><RosterShape bots={row.team.bots} rooms={row.team.rooms.length} routines={row.team.routines} /></span>
            </span>
          </Link>
        ),
      )}
    </div>
  ) : (
    <div className="team-table">
      {interleaveAds(sorted, houseSlots).map((row) =>
        row.kind === "ad" ? (
          <ListingAd key={row.key} slot={row.slot} as="row" />
        ) : row.kind === "slot" ? (
          <ListingSlot key={row.key} as="row" />
        ) : (
          <TeamExpandable
            key={row.team.slug}
            team={row.team}
            variant="row"
            open={open === row.team.slug}
            onToggle={() => setOpen(open === row.team.slug ? null : row.team.slug)}
          />
        ),
      )}
    </div>
  );

  return (
    <section id="teams">
      <SponsorTicker place="top" />
      <div className="index-tools">
        <label className="search-wrap">
          <span className="sr-only">{en.home.searchLabel}</span>
          <svg className="search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            ref={searchRef}
            className="search-input"
            type="search"
            placeholder={en.home.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            enterKeyHint="search"
            aria-keyshortcuts="/ Meta+k Control+k"
          />
          {query ? (
            <button type="button" className="search-clear" onClick={() => { setQuery(""); searchRef.current?.focus(); }}>
              {en.home.clearSearch}
            </button>
          ) : (
            <kbd className="search-kbd" aria-hidden>{en.home.searchKbd}</kbd>
          )}
        </label>

        <div className="browse-pick" role="radiogroup" aria-label={en.home.kindLabel}>
          {([
            ["team", en.home.kindTeams, teamCount],
            ["bot", en.home.kindBots, botCount],
            ["all", en.home.kindAll, teams.length],
          ] as const).map(([id, label, count]) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={kindParam === id}
              className={`browse-pick-btn${kindParam === id ? " is-on" : ""}`}
              onClick={() => setKind(id)}
            >
              {label} <span className="browse-pick-count">{count}</span>
            </button>
          ))}
        </div>

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

        <div className="index-header">
          <h2 className="section-title">
            {kindParam === "bot" ? en.home.indexTitleBots : kindParam === "all" ? en.home.indexTitleAll : en.home.indexTitle}
          </h2>
          <div className="filter-bar">
            <div className="filter-selects">
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
            </div>
            <span className="filter-views" role="radiogroup" aria-label={en.home.listingView}>
              {VIEWS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  aria-checked={view === v.id}
                  className={`filter-chip filter-chip--icon${view === v.id ? " is-on" : ""}`}
                  aria-label={v.label}
                  title={v.label}
                  onClick={() => writeView(v.id)}
                >
                  {v.icon}
                </button>
              ))}
            </span>
          </div>
        </div>

        <div className="idx-status">
          <p className="idx-count" role="status" aria-live="polite">
            {en.home.results(sorted.length, inSource.length)}
          </p>
          {hasFilters ? (
            <div className="idx-chips">
              {query.trim() ? (
                <button type="button" className="idx-chip" onClick={() => setQuery("")}>
                  {query.trim()} <span aria-hidden>×</span>
                </button>
              ) : null}
              {sectionParam !== "all" && categoryLabel ? (
                <button type="button" className="idx-chip" onClick={() => setSection("all")}>
                  {categoryLabel} <span aria-hidden>×</span>
                </button>
              ) : null}
              {integrationParam !== "all" ? (
                <button type="button" className="idx-chip" onClick={() => setParam("integration", "all")}>
                  {integrationParam} <span aria-hidden>×</span>
                </button>
              ) : null}
              <button type="button" className="idx-chip-clear" onClick={clearFilters}>
                {en.home.clearFilters}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {listing}
    </section>
  );
}

function TeamExpandable({
  team,
  variant,
  open,
  onToggle,
}: {
  team: Team;
  variant: "row" | "card";
  open: boolean;
  onToggle: () => void;
}) {
  const prompt = installerPrompt(team);
  const shellClass = variant === "card" ? "team-card" : "index-row";
  const bodyId = useId();
  const title = grokRecipeTitle(team.kind, team.name);

  return (
    <article className={`${shellClass}${open ? " is-open" : ""}`}>
      <div className="index-head">
        <button
          type="button"
          className="index-expand-hit"
          aria-expanded={open}
          aria-controls={bodyId}
          aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
          onClick={onToggle}
        />
        <div className="min-w-0 flex-1">
          <div className="index-titleline flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
            <Link href={hrefFor(team)} className="index-name">
              {title}
            </Link>
            <span className="chevron" aria-hidden>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d={open ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} />
              </svg>
            </span>
            <span className="team-card-meta"><RosterShape bots={team.bots} rooms={team.rooms.length} routines={team.routines} /></span>
          </div>
          <p className="index-tagline">{team.tagline}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <ConnectorRow names={team.connectors} size={16} />
            <span className="index-chips inline-flex flex-wrap gap-1.5">
              {team.featured ? <FeaturedChip /> : null}
              {team.fromXai ? <FromXaiChip /> : null}
            </span>
          </div>
        </div>
      </div>
      <Link
        href={hrefFor(team)}
        className="row-arrow row-arrow-link"
        aria-label={`${en.home.viewFull(team.kind)}: ${title}`}
      >
        <span className="row-arrow-text">{en.home.viewFull(team.kind)}</span>
        <TeamArrow />
      </Link>
      {open ? (
        <div className="index-body" id={bodyId}>
          <ul>
            {team.agents.map((agent, i) => (
              <li key={agent.name} className="bot-row">
                <div className="flex items-start gap-2">
                  <GrokBotMark size={17} animate className="mt-0.5" style={botMarkStyle(i)} />
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-baseline gap-2 text-[0.92rem]" style={{ fontFamily: ledger.serif }}>
                      {grokDisplayBotName(agent.name)}
                      <span className="bot-tag">{en.team.botTag}</span>
                    </p>
                    <p className="mt-0.5 text-[0.75rem] leading-snug" style={{ color: ledger.inkMuted }}>{agent.persona}</p>
                    {agent.connectors.length > 0 ? (
                      <div className="mt-1.5">
                        <ConnectorRow names={agent.connectors} size={15} />
                      </div>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="index-copy">
            <CopyInstallerButton text={prompt} />
          </div>
        </div>
      ) : null}
    </article>
  );
}
