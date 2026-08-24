"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useOptimistic, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ConnectorRow } from "@/components/ConnectorRow";
import { CategoryIcon } from "@/components/icons/LineIcons";
import { connectorQuerySearch, type ConnectorFinderQuery } from "@/lib/catalog-query";
import { en } from "@/lib/messages/en";
import { focusWithoutPageScroll, scrollIntoRail, useScrollEdges } from "@/lib/use-scroll-edges";

/*
 * Finding one connector in 306.
 *
 * The page used to render all of them, grouped, on first paint. That is a
 * catalog dump, not a tool: the visitor who wants Gmail has to scroll past
 * two hundred Cursor Marketplace plugins to reach it.
 *
 * So search is the page. An empty query shows a short shelf, a category
 * chip shows that category and nothing else, and the full list is a thing
 * you ask for. When it is asked for, it is windowed: 306 rows in the DOM
 * makes a phone stutter, and pagination over a list you are scanning is
 * worse than either.
 *
 * The one thing windowing costs is browser find-in-page over rows that are
 * not mounted. The search field is the answer to that, and slash focuses it.
 */

export type FinderEntry = {
  name: string;
  slug: string;
  category: string;
  builtIn: boolean;
  teams: number;
  aliases: string[];
};

/* Row height has to be a constant for windowing to know where it is.
   Two lines fit a spaced name at 320; a one-line ellipsis clipped
   "Google Calendar" when letter-spacing was 0.12em. */
const ROW = 72;
/* Below this, a plain list is cheaper than the machinery. */
const WINDOW_FROM = 60;

function norm(value: string) {
  return value.toLowerCase().trim();
}

/* Case-insensitive substring on name, slug, and aliases.
   Prefix still ranks first so "not" puts Notion above
   "Cloudflare Notifications". Ties fall back to name order. */
function haystacks(entry: FinderEntry): string[] {
  const slug = norm(entry.slug);
  return [norm(entry.name), slug, slug.replace(/-/g, " "), ...entry.aliases.map(norm)];
}

function matches(entry: FinderEntry, q: string): boolean {
  if (!q) return false;
  return haystacks(entry).some((field) => field.includes(q));
}

function score(entry: FinderEntry, q: string): number {
  if (!matches(entry, q)) return -1;
  const name = norm(entry.name);
  const slug = norm(entry.slug);
  const slugQ = q.replace(/\s+/g, "-");
  if (name === q || slug === slugQ) return 0;
  if (name.startsWith(q) || slug.startsWith(slugQ)) return 1;
  if (name.includes(q) || slug.includes(slugQ) || slug.replace(/-/g, " ").includes(q)) return 2;
  return 3;
}

function Row({ entry, locked = false }: { entry: FinderEntry; locked?: boolean }) {
  return (
    <li className="cf-row" style={locked ? { height: ROW } : undefined}>
      <span className="cf-row-id">
        <ConnectorRow names={[entry.name]} size={18} />
        <span className="cf-row-name">{entry.name}</span>
        {entry.builtIn ? <span className="cf-flag">{en.connectors.builtInLabel}</span> : null}
      </span>
      {entry.teams > 0 ? (
        /* The count is a link into the team index filtered by this
           connector, which is a page that already exists. No invented
           install numbers: this is teams on this shelf, and nothing else. */
        <Link className="cf-row-teams" href={`/?integration=${encodeURIComponent(entry.name)}`}>
          {en.connectors.teamCount(entry.teams)}
        </Link>
      ) : (
        <span className="cf-row-quiet">{en.connectors.noTeams}</span>
      )}
    </li>
  );
}

function PlainList({ items }: { items: FinderEntry[] }) {
  return (
    <ul className="cf-list">
      {items.map((e) => <Row key={e.slug} entry={e} />)}
    </ul>
  );
}

function WindowedList({ items }: { items: FinderEntry[] }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [top, setTop] = useState(0);
  const [height, setHeight] = useState(520);
  const [cols, setCols] = useState(1);

  /* Both numbers are set in CSS so they can respond to the viewport, and
     both are read back rather than duplicated here. The column count
     comes from the resolved grid track list, which is the only honest
     source once the breakpoint lives in the stylesheet. */
  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const measure = () => {
      setHeight(box.clientHeight);
      const list = listRef.current;
      if (!list) return;
      const tracks = getComputedStyle(list).gridTemplateColumns.split(" ").filter(Boolean).length;
      setCols(Math.max(1, tracks));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  /* Rows of `cols` items each, so the scroll height and the window are
     both counted in grid rows and never in items. */
  const rows = Math.ceil(items.length / cols);
  const visibleRows = Math.ceil(height / ROW);
  const startRow = Math.max(0, Math.floor(top / ROW) - 4);
  const endRow = Math.min(rows, startRow + visibleRows + 8);
  const slice = items.slice(startRow * cols, endRow * cols);

  return (
    <div
      ref={boxRef}
      className="cf-scroll"
      onScroll={(e) => setTop(e.currentTarget.scrollTop)}
      tabIndex={0}
      role="group"
      aria-label={en.connectors.allLabel}
    >
      <div style={{ height: rows * ROW, position: "relative" }}>
        <ul
          ref={listRef}
          className="cf-list"
          style={{ position: "absolute", insetInline: 0, transform: `translateY(${startRow * ROW}px)` }}
        >
          {slice.map((e) => <Row key={e.slug} entry={e} locked />)}
        </ul>
      </div>
    </div>
  );
}

export function ConnectorFinder({
  entries,
  categories,
  query: initial,
}: {
  entries: FinderEntry[];
  categories: string[];
  query: ConnectorFinderQuery;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const resultsId = useId();
  type FinderFilters = Omit<ConnectorFinderQuery, "q">;
  const serverFilters = useMemo<FinderFilters>(
    () => ({
      category: initial.category,
      builtin: initial.builtin,
      all: initial.all,
    }),
    [initial.category, initial.builtin, initial.all],
  );
  const [filters, setFilters] = useOptimistic(serverFilters, (_current, next: FinderFilters) => next);
  const category = filters.category;
  const builtInOnly = filters.builtin;
  const browseAll = filters.all;
  const [query, setQuery] = useState(initial.q);
  const [seenQ, setSeenQ] = useState(initial.q);
  const [pushedQ, setPushedQ] = useState(initial.q);
  if (initial.q !== seenQ) {
    setSeenQ(initial.q);
    if (initial.q !== pushedQ) {
      setQuery(initial.q);
      setPushedQ(initial.q);
    }
  }
  const searchRef = useRef<HTMLInputElement>(null);
  const chipsRef = useScrollEdges<HTMLDivElement>(categories.length);
  const [isPending, startFilter] = useTransition();
  const [resume, setResume] = useState<FinderFilters>(serverFilters);

  function commit(next: ConnectorFinderQuery) {
    const normalized = next.q.trim()
      ? { q: next.q.trim(), category: null, builtin: false, all: false }
      : { ...next, q: "" };
    setPushedQ(normalized.q);
    startFilter(() => {
      setFilters({ category: normalized.category, builtin: normalized.builtin, all: normalized.all });
      const qs = connectorQuerySearch(normalized);
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  const reset = () => {
    setQuery("");
    setResume({ category: null, builtin: false, all: false });
    commit({ q: "", category: null, builtin: false, all: false });
    searchRef.current?.focus();
  };

  const clearSearchOnly = (opts?: { blur?: boolean }) => {
    setQuery("");
    commit({ q: "", category: resume.category, builtin: resume.builtin, all: resume.all });
    if (opts?.blur) searchRef.current?.blur();
    else searchRef.current?.focus();
  };

  const canResume = Boolean(resume.category || resume.builtin || resume.all);

  useEffect(() => {
    const next = query.trim();
    if (next === initial.q.trim()) return;
    const handle = window.setTimeout(() => {
      commit({
        q: next,
        category,
        builtin: builtInOnly,
        all: browseAll,
      });
    }, 250);
    return () => window.clearTimeout(handle);
    // commit writes the URL; the listed fields are the debounce inputs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, initial.q, category, builtInOnly, browseAll]);

  /* Focus only when the URL already asked for a search, so a first visit
     keeps keyboard order at the skip link and the masthead. */
  useEffect(() => {
    if (initial.q) searchRef.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = document.activeElement;
      const typing = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
      if (e.key === "Escape" && typing) {
        e.preventDefault();
        clearSearchOnly({ blur: true });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [resume]);

  const q = norm(query);

  const searched = useMemo(() => {
    if (!q) return [];
    return entries
      .map((e) => ({ e, s: score(e, q) }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => a.s - b.s || a.e.name.localeCompare(b.e.name))
      .map((x) => x.e);
  }, [entries, q]);

  const featured = useMemo(() => entries.filter((e) => e.category === "Featured"), [entries]);
  /* Gmail is both featured and built in. Printing it twice on a shelf this
     short would read as a bug, so the built-in strip is the remainder. */
  const builtIns = useMemo(
    () => entries.filter((e) => e.builtIn && e.category !== "Featured"),
    [entries],
  );

  const counts = useMemo(() => {
    const pool = q ? searched : entries;
    const map = new Map<string, number>();
    for (const e of pool) map.set(e.category, (map.get(e.category) ?? 0) + 1);
    return map;
  }, [entries, searched, q]);

  const builtInTotal = useMemo(() => entries.filter((e) => e.builtIn).length, [entries]);

  const mode: "search" | "category" | "builtin" | "all" | "shelf" =
    q ? "search" : category ? "category" : builtInOnly ? "builtin" : browseAll ? "all" : "shelf";

  const list = useMemo(() => {
    if (mode === "search") return searched;
    if (mode === "category") return entries.filter((e) => e.category === category);
    if (mode === "builtin") return entries.filter((e) => e.builtIn);
    if (mode === "all") return entries;
    return [];
  }, [mode, searched, entries, category]);

  function pickCategory(next: string) {
    const categoryNext = category === next ? null : next;
    setQuery("");
    commit({ q: "", category: categoryNext, builtin: false, all: false });
  }

  return (
    <div className="cf">
      {/* Search and chips stay put while a long list moves under them. */}
      <div className={mode === "all" ? "cf-bar is-bare" : "cf-bar"}>
        <form
          className="cf-search"
          action="/connectors"
          method="get"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            commit({ q: query, category, builtin: builtInOnly, all: browseAll });
          }}
        >
          <label className="cf-search-field">
            <span className="sr-only">{en.connectors.searchLabel}</span>
            <svg className="cf-search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              ref={searchRef}
              type="search"
              name="q"
              className="cf-input"
              placeholder={en.connectors.searchPlaceholder}
              value={query}
              onChange={(e) => {
                const next = e.target.value;
                if (!query.trim() && next.trim()) {
                  setResume({ category, builtin: builtInOnly, all: browseAll });
                }
                setQuery(next);
              }}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="search"
              aria-keyshortcuts="/ Meta+k Control+k"
              aria-describedby={resultsId}
            />
          </label>
          {query ? (
            <button type="button" className="cf-search-clear" onClick={() => clearSearchOnly()}>
              {en.connectors.clearSearch}
            </button>
          ) : (
            <kbd className="cf-kbd" aria-hidden>/</kbd>
          )}
        </form>

        <div
          ref={chipsRef.ref}
          className={`cf-chips scroll-fade${chipsRef.edges.start ? " has-start" : ""}${chipsRef.edges.end ? " has-end" : ""}`}
          onKeyDown={(event) => {
            if (event.key !== "Tab") return;
            const chips = [...event.currentTarget.querySelectorAll<HTMLElement>(".cf-chip:not([disabled])")];
            const index = chips.indexOf(event.target as HTMLElement);
            if (index < 0) return;
            const next = chips[index + (event.shiftKey ? -1 : 1)];
            if (!next) return;
            event.preventDefault();
            focusWithoutPageScroll(next);
            scrollIntoRail(event.currentTarget, next);
          }}
          onFocus={(event) => {
            const chip = event.target;
            if (chip instanceof HTMLElement && chip.classList.contains("cf-chip")) {
              scrollIntoRail(event.currentTarget, chip);
            }
          }}
        >
          <button
            type="button"
            className={`cf-chip${builtInOnly ? " is-on" : ""}`}
            aria-pressed={builtInOnly}
            onClick={() => {
              const next = !builtInOnly;
              setQuery("");
              commit({ q: "", category: null, builtin: next, all: false });
            }}
          >
            <CategoryIcon name={en.connectors.builtInLabel} className="cf-chip-icon" />
            {en.connectors.builtInLabel}
            <span className="cf-count">{builtInTotal}</span>
          </button>
          {categories.map((cat) => {
            const n = counts.get(cat) ?? 0;
            const on = category === cat;
            return (
              <button
                key={cat}
                type="button"
                className={`cf-chip${on ? " is-on" : ""}`}
                aria-pressed={on}
                disabled={n === 0 && !on}
                onClick={() => pickCategory(cat)}
              >
                <CategoryIcon name={cat} className="cf-chip-icon" />
                {cat}
                <span className="cf-count">{n}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="cf-summary" id={resultsId} role="status" aria-live="polite" aria-busy={isPending}>
        {mode === "shelf"
          ? en.connectors.shelfSummary(entries.length)
          : en.connectors.summary(list.length, entries.length)}
        {isPending ? <span className="cf-updating"> {en.connectors.updating}</span> : null}
        {mode !== "shelf" ? (
          <button type="button" className="cf-clear" onClick={reset}>{en.connectors.backToShelf}</button>
        ) : null}
      </p>

      <div className={`cf-results${isPending ? " is-pending" : ""}`} aria-busy={isPending || undefined}>
      {mode === "shelf" ? (
        <>
          <section className="cf-shelf">
            <h2 className="cf-shelf-title">{en.connectors.featuredTitle}</h2>
            <PlainList items={featured} />
          </section>
          <section className="cf-shelf">
            <h2 className="cf-shelf-title">{en.connectors.builtInTitle}</h2>
            <p className="cf-shelf-note">{en.connectors.builtInShelfNote}</p>
            <PlainList items={builtIns} />
          </section>
          <div className="cf-more">
            <button type="button" className="cf-browse" onClick={() => {
              setQuery("");
              commit({ q: "", category: null, builtin: false, all: true });
            }}>
              {en.connectors.browseAll(entries.length)}
            </button>
            <p className="cf-shelf-note">{en.connectors.browseAllNote}</p>
          </div>
        </>
      ) : list.length === 0 ? (
        <div className="cf-empty">
          <p className="cf-empty-title">{en.connectors.emptyTitle(query)}</p>
          <p className="cf-empty-body">{en.connectors.emptyBody}</p>
          <nav className="notfound-nav" aria-label={en.connectors.emptyNav}>
            {mode === "search" ? (
              <button type="button" className="cf-browse" onClick={() => clearSearchOnly()}>
                {en.connectors.clearSearch}
              </button>
            ) : null}
            {mode !== "search" || canResume ? (
              <button type="button" className={mode === "search" ? "theme-control theme-control-label" : "cf-browse"} onClick={reset}>
                {en.connectors.backToShelf}
              </button>
            ) : null}
            <Link href="/guides/grok-bot-connectors" className="theme-control theme-control-label">
              {en.connectors.emptyGuide}
            </Link>
          </nav>
        </div>
      ) : list.length > WINDOW_FROM ? (
        <WindowedList items={list} />
      ) : (
        <PlainList items={list} />
      )}
      </div>
    </div>
  );
}
