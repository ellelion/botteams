"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ConnectorRow } from "@/components/ConnectorRow";
import { CategoryIcon } from "@/components/icons/LineIcons";
import { en } from "@/lib/messages/en";

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
 * not mounted. The search field is the answer to that, and it is focused
 * on arrival.
 */

export type FinderEntry = {
  name: string;
  slug: string;
  category: string;
  builtIn: boolean;
  teams: number;
  aliases: string[];
};

/* Row height has to be a constant for windowing to know where it is, so
   rows are one line with the name ellipsised rather than wrapping. */
const ROW = 46;
/* Below this, a plain list is cheaper than the machinery. */
const WINDOW_FROM = 60;

function norm(value: string) {
  return value.toLowerCase().trim();
}

/* Prefix beats substring beats alias, so "not" puts Notion above
   "Cloudflare Notifications". Ties fall back to name order. */
function score(entry: FinderEntry, q: string): number {
  const name = norm(entry.name);
  if (name === q) return 0;
  if (name.startsWith(q)) return 1;
  if (entry.slug.startsWith(q.replace(/\s+/g, "-"))) return 2;
  if (name.includes(q)) return 3;
  if (entry.aliases.some((a) => a.startsWith(q))) return 4;
  if (entry.aliases.some((a) => a.includes(q))) return 5;
  if (norm(entry.category).includes(q)) return 6;
  return -1;
}

function Row({ entry }: { entry: FinderEntry }) {
  return (
    <li className="cf-row" style={{ height: ROW }}>
      <span className="cf-row-id">
        <ConnectorRow names={[entry.name]} size={18} />
        <span className="cf-row-name">{entry.name}</span>
        {entry.builtIn ? <span className="cf-flag">{en.connectors.builtInLabel}</span> : null}
      </span>
      {entry.teams > 0 ? (
        /* The count is a link into the team index filtered by this
           connector, which is a page that already exists. No invented
           install numbers: this is teams on this shelf, and nothing else. */
        <Link className="cf-row-teams" href={`/?integration=${encodeURIComponent(entry.name)}#teams`}>
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
  const [top, setTop] = useState(0);
  const [height, setHeight] = useState(520);

  /* The box is sized in CSS so it can respond to the viewport. Measure it
     rather than duplicating that number in JavaScript. */
  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const measure = () => setHeight(box.clientHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  const visible = Math.ceil(height / ROW);
  const start = Math.max(0, Math.floor(top / ROW) - 8);
  const end = Math.min(items.length, start + visible + 16);
  const slice = items.slice(start, end);

  return (
    <div
      ref={boxRef}
      className="cf-scroll"
      onScroll={(e) => setTop(e.currentTarget.scrollTop)}
      tabIndex={0}
      role="group"
      aria-label={en.connectors.allLabel}
    >
      <div style={{ height: items.length * ROW, position: "relative" }}>
        <ul className="cf-list" style={{ position: "absolute", insetInline: 0, transform: `translateY(${start * ROW}px)` }}>
          {slice.map((e) => <Row key={e.slug} entry={e} />)}
        </ul>
      </div>
    </div>
  );
}

export function ConnectorFinder({
  entries,
  categories,
}: {
  entries: FinderEntry[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [builtInOnly, setBuiltInOnly] = useState(false);
  const [browseAll, setBrowseAll] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  /* Focused on arrival, because typing is the intended first move. */
  useEffect(() => {
    searchRef.current?.focus({ preventScroll: true });
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
        setQuery("");
        searchRef.current?.blur();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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

  const reset = useCallback(() => {
    setQuery("");
    setCategory(null);
    setBuiltInOnly(false);
    setBrowseAll(false);
    searchRef.current?.focus();
  }, []);

  function pickCategory(next: string) {
    setCategory((prev) => (prev === next ? null : next));
    setBuiltInOnly(false);
    setBrowseAll(false);
  }

  return (
    <div className="cf">
      {/* Search and chips stay put while a long list moves under them. */}
      <div className="cf-bar">
        <label className="cf-search">
          <span className="sr-only">{en.connectors.searchLabel}</span>
          <svg className="cf-search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            ref={searchRef}
            type="search"
            className="cf-input"
            placeholder={en.connectors.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          <kbd className="cf-kbd" aria-hidden>/</kbd>
        </label>

        <div className="cf-chips">
          <button
            type="button"
            className={`cf-chip${builtInOnly ? " is-on" : ""}`}
            aria-pressed={builtInOnly}
            onClick={() => { setBuiltInOnly((v) => !v); setCategory(null); setBrowseAll(false); }}
          >
            <CategoryIcon name="Built in" className="cf-chip-icon" />
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

      <p className="cf-summary" role="status" aria-live="polite">
        {mode === "shelf"
          ? en.connectors.shelfSummary(entries.length)
          : en.connectors.summary(list.length, entries.length)}
        {mode !== "shelf" ? (
          <button type="button" className="cf-clear" onClick={reset}>{en.connectors.backToShelf}</button>
        ) : null}
      </p>

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
            <button type="button" className="cf-browse" onClick={() => setBrowseAll(true)}>
              {en.connectors.browseAll(entries.length)}
            </button>
            <p className="cf-shelf-note">{en.connectors.browseAllNote}</p>
          </div>
        </>
      ) : list.length === 0 ? (
        <div className="cf-empty">
          <p className="cf-empty-title">{en.connectors.emptyTitle(query)}</p>
          <p className="cf-empty-body">{en.connectors.emptyBody}</p>
          <button type="button" className="cf-browse" onClick={reset}>{en.connectors.backToShelf}</button>
        </div>
      ) : list.length > WINDOW_FROM ? (
        <WindowedList items={list} />
      ) : (
        <PlainList items={list} />
      )}
    </div>
  );
}
