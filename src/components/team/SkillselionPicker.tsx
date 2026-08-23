"use client";

import { useEffect, useState } from "react";
import { SkillHitFace } from "@/components/team/SkillHitFace";
import { en } from "@/lib/messages/en";
import type { SkillPick, SkillselionHit, SkillUse } from "@/lib/skillselion";
import type { TeamAgent } from "@/lib/types";

async function searchSkills(q: string): Promise<SkillselionHit[]> {
  const res = await fetch(`/api/skillselion/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) return [];
  const body = (await res.json()) as { skills?: SkillselionHit[] };
  return Array.isArray(body.skills) ? body.skills : [];
}

export function SkillselionPicker({
  picks,
  agents,
  liveHits,
  onChange,
}: {
  picks: SkillPick[];
  agents: TeamAgent[];
  liveHits?: Record<string, SkillselionHit>;
  onChange: (next: SkillPick[]) => void;
}) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<SkillselionHit[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const query = q.trim();
    if (query.length < 2) {
      setHits([]);
      return;
    }
    const t = window.setTimeout(() => {
      setBusy(true);
      searchSkills(query)
        .then((rows) => setHits(rows))
        .finally(() => setBusy(false));
    }, 250);
    return () => window.clearTimeout(t);
  }, [q]);

  function add(hit: SkillselionHit) {
    if (picks.some((p) => p.id === hit.id && p.scope === "team")) return;
    onChange([...picks, { ...hit, use: "fetch", scope: "team" }]);
    setQ("");
    setHits([]);
    setOpen(false);
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

  return (
    <fieldset className="cz-group">
      <legend className="cz-legend">{en.customize.skills}</legend>
      <p className="cz-truth">{en.customize.skillsLead}</p>
      <p className="cz-truth">{en.customize.skillsScopeLead}</p>
      <label className="cz-field">
        <span className="cz-field-label">{en.customize.skillsSearch}</span>
        <input
          type="search"
          className="cz-input"
          placeholder={en.customize.skillsPlaceholder}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          autoComplete="off"
        />
      </label>
      {open && (hits.length > 0 || busy || q.trim().length >= 2) ? (
        <ul className="cz-list mt-2" role="listbox" aria-label={en.customize.skillsSearch}>
          {busy ? <li className="cz-hint">{en.customize.skillsSearching}</li> : null}
          {!busy && hits.length === 0 ? <li className="cz-hint">{en.customize.skillsEmpty}</li> : null}
          {hits.map((hit) => (
            <li key={hit.id} className="cz-bot">
              <div className="cz-bot-top">
                <button type="button" className="cz-btn" onClick={() => add(hit)}>
                  {en.customize.skillsAdd}
                </button>
                <SkillHitFace hit={hit} />
              </div>
            </li>
          ))}
        </ul>
      ) : null}
      {picks.length > 0 ? (
        <ul className="cz-list mt-4">
          {picks.map((pick) => (
            <li key={`${pick.id}::${pick.scope}`} className="cz-conn">
              <SkillHitFace
                hit={pick}
                live={liveHits?.[pick.id]}
                extra={pick.use === "install" ? en.customize.skillsInstall : en.customize.skillsFetch}
              />
              <span className="cz-modes" role="group" aria-label={pick.name}>
                <label className="cz-skill-scope">
                  <span className="sr-only">{en.customize.skillsScope}</span>
                  <select
                    className="cz-input"
                    value={pick.scope}
                    onChange={(e) => setScope(pick.id, pick.scope, e.target.value)}
                  >
                    <option value="team">{en.customize.skillsScopeTeam}</option>
                    {agents.map((agent) => (
                      <option key={agent.name} value={agent.name}>
                        {agent.name}
                      </option>
                    ))}
                  </select>
                </label>
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
            </li>
          ))}
        </ul>
      ) : null}
    </fieldset>
  );
}
