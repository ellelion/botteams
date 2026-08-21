"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ConnectorRow } from "@/components/ConnectorRow";
import { CategoryIcon } from "@/components/icons/LineIcons";
import { en } from "@/lib/messages/en";

export type ExplorerEntry = {
  name: string;
  slug: string;
  category: string;
  builtIn: boolean;
  teams: { slug: string; name: string }[];
};

type Variant = "console" | "rail" | "wall";

const VARIANTS: { id: Variant; label: string }[] = [
  { id: "console", label: "Console" },
  { id: "rail", label: "Rail" },
  { id: "wall", label: "Wall" },
];

function norm(value: string) {
  return value.toLowerCase().trim();
}

/*
 * One filter model, three presentations. Search and facets live here so the
 * three layouts cannot drift apart in behaviour, only in how they look.
 */
export function ConnectorExplorer({
  entries,
  categories,
  variant: initialVariant,
}: {
  entries: ExplorerEntry[];
  categories: string[];
  variant: Variant;
}) {
  const [variant, setVariant] = useState<Variant>(initialVariant);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string[]>([]);
  const [builtInOnly, setBuiltInOnly] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Slash and cmd-K both land in the field. A catalog this long is unusable
  // without a way to start typing that does not involve aiming at an input.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = document.activeElement;
      const typing = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
      if (e.key === "Escape" && typing) searchRef.current?.blur();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const q = norm(query);
  const results = useMemo(() => {
    return entries.filter((e) => {
      if (builtInOnly && !e.builtIn) return false;
      if (active.length && !active.includes(e.category)) return false;
      if (!q) return true;
      if (norm(e.name).includes(q)) return true;
      if (e.slug.includes(q.replace(/\s+/g, "-"))) return true;
      return e.teams.some((t) => norm(t.name).includes(q));
    });
  }, [entries, q, active, builtInOnly]);

  // Counts reflect every other active filter but not the facet itself, so a
  // facet never shows zero for something you could still click into.
  const counts = useMemo(() => {
    const base = entries.filter((e) => {
      if (builtInOnly && !e.builtIn) return false;
      if (!q) return true;
      return norm(e.name).includes(q) || e.teams.some((t) => norm(t.name).includes(q));
    });
    const map = new Map<string, number>();
    for (const e of base) map.set(e.category, (map.get(e.category) ?? 0) + 1);
    return map;
  }, [entries, q, builtInOnly]);

  const grouped = useMemo(() => {
    const map = new Map<string, ExplorerEntry[]>();
    for (const e of results) {
      const list = map.get(e.category) ?? [];
      list.push(e);
      map.set(e.category, list);
    }
    return categories.filter((c) => map.has(c)).map((c) => [c, map.get(c)!] as const);
  }, [results, categories]);

  const filtering = Boolean(q) || active.length > 0 || builtInOnly;

  function toggle(cat: string) {
    setActive((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  }
  function clear() {
    setQuery("");
    setActive([]);
    setBuiltInOnly(false);
    searchRef.current?.focus();
  }

  return (
    <div className={`cx cx--${variant}`}>
      <div className="cx-bar">
        <label className="cx-search">
          <span className="sr-only">{en.connectors.searchLabel}</span>
          <svg className="cx-search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            ref={searchRef}
            type="search"
            className="cx-input"
            placeholder={en.connectors.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          <kbd className="cx-kbd" aria-hidden>/</kbd>
        </label>

        <div className="cx-views" role="group" aria-label={en.connectors.viewLabel}>
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              type="button"
              className={`cx-view${variant === v.id ? " is-on" : ""}`}
              aria-pressed={variant === v.id}
              onClick={() => setVariant(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div className="cx-facets">
        <button
          type="button"
          className={`cx-facet${builtInOnly ? " is-on" : ""}`}
          aria-pressed={builtInOnly}
          onClick={() => setBuiltInOnly((v) => !v)}
        >
          <CategoryIcon name="Built in" className="cx-facet-icon" />
          {en.connectors.builtInLabel}
          <span className="cx-count">{entries.filter((e) => e.builtIn).length}</span>
        </button>
        {categories.map((cat) => {
          const n = counts.get(cat) ?? 0;
          const on = active.includes(cat);
          return (
            <button
              key={cat}
              type="button"
              className={`cx-facet${on ? " is-on" : ""}`}
              aria-pressed={on}
              disabled={n === 0 && !on}
              onClick={() => toggle(cat)}
            >
              <CategoryIcon name={cat} className="cx-facet-icon" />
              {cat}
              <span className="cx-count">{n}</span>
            </button>
          );
        })}
      </div>

      <div className="cx-results">
      <p className="cx-summary" role="status" aria-live="polite">
        {en.connectors.summary(results.length, entries.length)}
        {filtering ? (
          <button type="button" className="cx-clear" onClick={clear}>
            {en.connectors.clear}
          </button>
        ) : null}
      </p>

      {results.length === 0 ? (
        <div className="cx-empty">
          <p className="cx-empty-title">{en.connectors.emptyTitle(query)}</p>
          <p className="cx-empty-body">{en.connectors.emptyBody}</p>
          <button type="button" className="cx-empty-action" onClick={clear}>
            {en.connectors.clear}
          </button>
        </div>
      ) : variant === "wall" ? (
        <ul className="cx-wall">
          {results.map((e) => (
            <li key={e.slug} className="cx-tile">
              <ConnectorRow names={[e.name]} size={26} />
              <span className="cx-tile-name">{e.name}</span>
              {e.teams.length > 0 ? <span className="cx-tile-meta">{en.connectors.teamCount(e.teams.length)}</span> : null}
              {e.builtIn ? <span className="cx-tile-flag">{en.connectors.builtInLabel}</span> : null}
            </li>
          ))}
        </ul>
      ) : (
        grouped.map(([cat, list]) => (
          <section key={cat} className="cx-group">
            <h2 className="cx-group-title">
              <CategoryIcon name={cat} className="cx-group-icon" />
              {cat}
              <span className="cx-count">{list.length}</span>
            </h2>
            <ul className="cx-list">
              {list.map((e) => (
                <li key={e.slug} className="cx-row">
                  <span className="cx-row-id">
                    <ConnectorRow names={[e.name]} labeled size={18} />
                    {e.builtIn ? <span className="cx-flag">{en.connectors.builtInLabel}</span> : null}
                  </span>
                  {e.teams.length > 0 ? (
                    <span className="cx-row-teams">
                      {e.teams.slice(0, 3).map((t, i) => (
                        <span key={t.slug}>
                          {i > 0 ? ", " : ""}
                          <Link href={`/teams/${t.slug}`} className="cx-team">{t.name}</Link>
                        </span>
                      ))}
                      {e.teams.length > 3 ? en.connectors.andMore(e.teams.length - 3) : null}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
      </div>
    </div>
  );
}
