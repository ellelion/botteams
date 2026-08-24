"use client";

import { useEffect, useId, useRef, useState } from "react";
import { SkillHitFace } from "@/components/team/SkillHitFace";
import { Select } from "@/components/ui/Select";
import { en } from "@/lib/messages/en";
import type { SkillPick, SkillselionHit, SkillUse } from "@/lib/skillselion";
import type { TeamAgent } from "@/lib/types";

async function searchSkills(q: string): Promise<SkillselionHit[]> {
  const res = await fetch(`/api/skillselion/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error("search failed");
  const body = (await res.json()) as { skills?: SkillselionHit[] };
  return Array.isArray(body.skills) ? body.skills : [];
}

export function SkillselionPicker({
  picks,
  agents,
  liveHits,
  listingsFailed = false,
  skillCounts,
  onRetryListings,
  onChange,
}: {
  picks: SkillPick[];
  agents: TeamAgent[];
  liveHits?: Record<string, SkillselionHit>;
  listingsFailed?: boolean;
  skillCounts?: (id: string) => { pending: boolean; failed: boolean };
  onRetryListings?: () => void;
  onChange: (next: SkillPick[]) => void;
}) {
  const listId = useId();
  const searchRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [fetched, setFetched] = useState<SkillselionHit[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(0);
  const [nonce, setNonce] = useState(0);
  const skipDelay = useRef(false);
  const query = q.trim();
  const hits = query.length < 2 ? [] : fetched;
  const listOpen = open && (hits.length > 0 || busy || failed || query.length >= 2);
  const safeActive = hits.length === 0 ? -1 : Math.min(Math.max(active, 0), hits.length - 1);
  const activeId = safeActive >= 0 ? `${listId}-opt-${hits[safeActive].id}` : undefined;
  const statusId = `${listId}-status`;

  useEffect(() => {
    if (query.length < 2) return;
    let cancelled = false;
    const wait = skipDelay.current ? 0 : 250;
    skipDelay.current = false;
    const t = window.setTimeout(() => {
      setBusy(true);
      setFailed(false);
      searchSkills(query)
        .then((rows) => {
          if (cancelled) return;
          setFetched(rows);
          setActive(0);
        })
        .catch(() => {
          if (cancelled) return;
          setFetched([]);
          setFailed(true);
        })
        .finally(() => {
          if (!cancelled) setBusy(false);
        });
    }, wait);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [query, nonce]);

  function add(hit: SkillselionHit) {
    if (picks.some((p) => p.id === hit.id && p.scope === "team")) return;
    onChange([...picks, { ...hit, use: "fetch", scope: "team" }]);
    setQ("");
    setFetched([]);
    setFailed(false);
    setOpen(false);
    setActive(0);
  }

  function onSearchKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      if (hits.length) setActive((i) => (i + 1) % hits.length);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      if (hits.length) setActive((i) => (i - 1 + hits.length) % hits.length);
      return;
    }
    if (event.key === "Home" && hits.length) {
      event.preventDefault();
      setActive(0);
      return;
    }
    if (event.key === "End" && hits.length) {
      event.preventDefault();
      setActive(hits.length - 1);
      return;
    }
    if (event.key === "Enter" && listOpen && safeActive >= 0 && hits[safeActive]) {
      event.preventDefault();
      add(hits[safeActive]);
    }
  }

  function setUse(id: string, scope: string, use: SkillUse) {
    onChange(picks.map((p) => (p.id === id && p.scope === scope ? { ...p, use } : p)));
  }

  function setScope(id: string, from: string, scope: string) {
    onChange(picks.map((p) => (p.id === id && p.scope === from ? { ...p, scope } : p)));
  }

  function remove(id: string, scope: string) {
    onChange(picks.filter((p) => !(p.id === id && p.scope === scope)));
  }

  function clearSearch() {
    setQ("");
    setFetched([]);
    setFailed(false);
    setOpen(false);
    searchRef.current?.focus();
  }

  return (
    <fieldset className="cz-group">
      <legend className="cz-legend">{en.customize.skills}</legend>
      <p className="cz-truth">{en.customize.skillsLead}</p>
      <p className="cz-truth">{en.customize.skillsScopeLead}</p>
      <label className="cz-field">
        <span className="cz-field-label">{en.customize.skillsSearch}</span>
        <span className="cz-search-wrap">
          <input
            ref={searchRef}
            type="search"
            className="cz-input"
            placeholder={en.customize.skillsPlaceholder}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
              setActive(0);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onSearchKey}
            autoComplete="off"
            role="combobox"
            aria-expanded={listOpen}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={listOpen ? activeId : undefined}
            aria-busy={busy}
            aria-invalid={failed || undefined}
            aria-describedby={listOpen ? statusId : undefined}
          />
          {q ? (
            <button type="button" className="cz-search-clear" onClick={clearSearch}>
              {en.customize.skillsClear}
            </button>
          ) : null}
        </span>
      </label>
      {listOpen ? (
        <>
        {failed && !busy ? (
          <div className="cz-skill-status" role="alert">
            <p id={statusId} className="cz-hint">{en.customize.skillsError}</p>
            <button
              type="button"
              className="cz-btn cz-btn-quiet"
              onClick={() => {
                skipDelay.current = true;
                setNonce((n) => n + 1);
              }}
            >
              {en.customize.skillsRetry}
            </button>
          </div>
        ) : hits.length === 0 && !busy ? (
          <div className="cz-skill-status">
            <p id={statusId} className="cz-hint" role="status" aria-live="polite">
              {en.customize.skillsEmpty}
            </p>
            <button type="button" className="cz-btn cz-btn-quiet" onClick={clearSearch}>
              {en.customize.skillsClear}
            </button>
          </div>
        ) : (
          <p id={statusId} className={hits.length ? "sr-only" : "cz-hint mt-2"} role="status" aria-live="polite">
            {busy ? en.customize.skillsSearching : en.customize.skillsFound(hits.length)}
          </p>
        )}
        <ul id={listId} className="cz-list cz-skill-hits mt-2" role="listbox" aria-label={en.customize.skillsSearch} hidden={hits.length === 0}>
          {hits.map((hit, i) => (
            <li
              key={hit.id}
              id={`${listId}-opt-${hit.id}`}
              className={`cz-bot cz-skill-opt${i === safeActive ? " is-active" : ""}`}
              role="option"
              aria-selected={i === safeActive}
              onMouseEnter={() => setActive(i)}
              onClick={() => add(hit)}
            >
              <div className="cz-bot-top">
                <span className="cz-btn" aria-hidden="true">{en.customize.skillsAdd}</span>
                <SkillHitFace hit={hit} compact />
              </div>
            </li>
          ))}
        </ul>
        </>
      ) : null}
      {picks.length > 0 ? (
        <ul className="cz-list mt-4" aria-busy={picks.some((pick) => skillCounts?.(pick.id).pending) || undefined}>
          {picks.map((pick) => {
            const counts = skillCounts?.(pick.id);
            return (
            <li key={`${pick.id}::${pick.scope}`} className="cz-conn">
              <SkillHitFace
                hit={pick}
                live={liveHits?.[pick.id]}
                pending={counts?.pending}
                failed={counts?.failed}
                extra={pick.use === "install" ? en.customize.skillsInstall : en.customize.skillsFetch}
              />
              <span className="cz-skill-tools">
                <Select
                  className="cz-skill-scope"
                  label={en.customize.skillsScope}
                  bare
                  align="end"
                  value={pick.scope}
                  options={[
                    { value: "team", label: en.customize.skillsScopeTeam },
                    ...agents.map((agent) => ({ value: agent.name, label: agent.name })),
                  ]}
                  onChange={(next) => setScope(pick.id, pick.scope, next)}
                />
              <span className="cz-modes" role="group" aria-label={pick.name}>
                <button
                  type="button"
                  className={`cz-mode${pick.use === "install" ? " is-on" : ""}`}
                  aria-pressed={pick.use === "install"}
                  onClick={() => setUse(pick.id, pick.scope, "install")}
                >
                  {en.customize.skillsInstall}
                </button>
                <button
                  type="button"
                  className={`cz-mode${pick.use === "fetch" ? " is-on" : ""}`}
                  aria-pressed={pick.use === "fetch"}
                  onClick={() => setUse(pick.id, pick.scope, "fetch")}
                >
                  {en.customize.skillsFetch}
                </button>
                <button type="button" className="cz-mode" onClick={() => remove(pick.id, pick.scope)}>
                  {en.customize.skillsRemove}
                </button>
              </span>
              </span>
            </li>
            );
          })}
        </ul>
      ) : null}
      {listingsFailed && onRetryListings ? (
        <div className="cz-skill-status" role="alert">
          <p className="cz-hint">{en.customize.skillsCountsFail}</p>
          <button type="button" className="cz-btn cz-btn-quiet" onClick={onRetryListings}>
            {en.customize.skillsRetry}
          </button>
        </div>
      ) : null}
    </fieldset>
  );
}
