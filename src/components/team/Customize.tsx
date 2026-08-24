"use client";

import { grokDisplayBotName, grokMemberName, grokRecipeTitle } from "@/lib/grok-names";
import { Children, useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ConnectorRow } from "@/components/ConnectorRow";
import { CopyInstallerButton } from "@/components/CopyInstallerButton";
import { FromXaiChip } from "@/components/FromXaiChip";
import { ShareBar } from "@/components/team/ShareBar";
import { SkillHitFace } from "@/components/team/SkillHitFace";
import { SkillselionPicker } from "@/components/team/SkillselionPicker";
import type { SkillselionHit } from "@/lib/skillselion";
import { GrokBotMark } from "@/components/icons/GrokBotMark";
import { RecipeSecIcon } from "@/components/icons/LineIcons";
import { botMarkStyle } from "@/lib/bot-icon";
import { resolveConnector } from "@/lib/connectors";
import { ledger } from "@/lib/ledger-theme";
import { en } from "@/lib/messages/en";
import { site } from "@/lib/site";
import type { Team } from "@/lib/types";
import { useDialogChrome } from "@/lib/use-dialog-chrome";
import { useScrollEdges } from "@/lib/use-scroll-edges";
import {
  MODES,
  MODE_HINT,
  MODE_LABEL,
  buildPrompt,
  check,
  decodeState,
  defaultState,
  encodeState,
  isOn,
  isSolo,
  resolve,
  toMarkdown,
  type CustomState,
} from "@/lib/customize";

/*
 * Customize edits the installer recipe on the page, with no account and no
 * round trip. Everything it changes is text that ends up in one paste.
 *
 * Two rules shape the whole component:
 *   A group chat holds two to six Bots, so anything that leaves it outside
 *   that range blocks Copy rather than shipping a prompt Grok Bot refuses.
 *   Connector modes are wording, never enforcement, so every claim about
 *   them points at Settings, then Plugins, which is the switch that exists.
 */

const HASH_KEY = "c=";


export function Customize({
  team,
  related,
  extras,
  children,
}: {
  team: Team;
  related?: ReactNode;
  extras?: ReactNode;
  children?: ReactNode;
}) {
  const [sheet, setSheet] = useState<"customize" | null>(null);
  const sheetId = useId();
  const overwriteTitleId = useId();
  const overwriteBodyId = useId();
  const modeHintId = useId();
  const sheetRef = useRef<HTMLDivElement>(null);
  const overwriteRef = useRef<HTMLDivElement>(null);
  const closeSheet = useCallback(() => setSheet(null), []);
  /* Portals need a document, so nothing renders one until after hydration. */
  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [state, setState] = useState<CustomState>(() => defaultState(team));
  const [shared, setShared] = useState(false);
  const [liveHits, setLiveHits] = useState<Record<string, SkillselionHit>>({});

  /* A recipe change while a hand-edited prompt exists parks here until the
     human says which one wins. */
  const [pending, setPending] = useState<(() => void) | null>(null);
  const hydrated = useRef(false);

  /* A shared link carries its edits in the hash, so it never reaches the
     server and the page stays static. Opening one starts in edit mode,
     because arriving at someone's customized team and seeing the stock
     recipe would be a lie. */
  useEffect(() => {
    /* Once, on mount. The server has no document and no hash, so reading
       either any earlier would render one recipe and hydrate another. */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const raw = window.location.hash.replace(/^#/, "");
    if (raw.startsWith(HASH_KEY)) {
      const payload = raw.slice(HASH_KEY.length);
      if (payload) {
        /* Once, on mount. The server cannot see the hash, so reading it
           any earlier would render one recipe and hydrate another. */
        setState(decodeState(team, payload));
        setEditing(true);
      }
    }
    hydrated.current = true;
  }, [team]);

  useDialogChrome({ open: sheet !== null && mounted, rootRef: sheetRef, onClose: closeSheet });
  const actionsRef = useScrollEdges<HTMLDivElement>();

  useEffect(() => {
    if (!pending) return;
    overwriteRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }, [pending]);

  const askedHits = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!mounted) return;
    const ids = [...new Set(state.skillPicks.map((p) => p.id).filter(Boolean))];
    const missing = ids.filter((id) => !liveHits[id] && !askedHits.current.has(id));
    if (missing.length === 0) return;
    for (const id of missing) askedHits.current.add(id);
    let cancelled = false;
    fetch(`/api/skillselion/listings?ids=${missing.map(encodeURIComponent).join(",")}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((body: { skills?: SkillselionHit[] } | null) => {
        if (cancelled || !body?.skills) return;
        setLiveHits((prev) => {
          const next = { ...prev };
          for (const hit of body.skills ?? []) next[hit.id] = hit;
          return next;
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [mounted, state.skillPicks, liveHits]);



  /* Keep the address bar in step, so copying the URL is enough to share. */
  useEffect(() => {
    if (!hydrated.current) return;
    const payload = encodeState(team, state);
    const next = payload ? `#${HASH_KEY}${payload}` : window.location.pathname + window.location.search;
    window.history.replaceState(null, "", next);
  }, [team, state]);

  const resolved = useMemo(() => resolve(team, state), [team, state]);
  /* One Bot means there is no group chat to edit and no roster to grow.
     Offering "add Bots up to six" here would invent a team the published
     job never described. */
  const solo = isSolo(team);
  const verdict = useMemo(() => check(team, state), [team, state]);
  const generated = useMemo(() => buildPrompt(team, state, site.url, site.github), [team, state]);
  const prompt = state.override ?? generated;

  /* Every recipe edit goes through here. If the prompt has been rewritten
     by hand, the edit waits for a confirmation instead of silently
     throwing the rewrite away. */
  const guard = useCallback(
    (change: () => void) => {
      if (state.override !== null) setPending(() => change);
      else change();
    },
    [state.override],
  );

  const patch = useCallback(
    (next: Partial<CustomState>) => guard(() => setState((prev) => ({ ...prev, ...next }))),
    [guard],
  );

  function toggleBot(name: string) {
    guard(() =>
      setState((prev) => ({
        ...prev,
        off: prev.off.includes(name) ? prev.off.filter((n) => n !== name) : [...prev.off, name],
      })),
    );
  }

  function toggleMember(name: string) {
    guard(() =>
      setState((prev) => ({
        ...prev,
        members: prev.members.includes(name) ? prev.members.filter((n) => n !== name) : [...prev.members, name],
      })),
    );
  }

  function toggleChip(text: string) {
    guard(() =>
      setState((prev) => ({
        ...prev,
        chips: prev.chips.includes(text) ? prev.chips.filter((c) => c !== text) : [...prev.chips, text],
      })),
    );
  }

  function reset() {
    setPending(null);
    setState(defaultState(team));
  }

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      window.setTimeout(() => setShared(false), 2000);
    } catch {
      setShared(false);
    }
  }

  function download() {
    const blob = new Blob([toMarkdown(team, state)], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${team.slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* The page hands us several sibling sections. Key them once so the
     array is safe to render wherever it lands. */
  const notes = Children.toArray(children);

  function openCustomize() {
    setEditing(true);
    setSheet("customize");
  }

  const readish = team.connectors.filter((c) => (state.modes[c] ?? "draft") !== "ask");
  const verdictPart = (
    <>
      {verdict.errors.length > 0 ? (
        <div className="cz-alert cz-alert-stop" role="alert">
          <p className="cz-alert-title">{en.customize.blocked}</p>
          <ul>{verdict.errors.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
      ) : null}
      {verdict.warnings.length > 0 ? (
        <div className="cz-alert cz-alert-warn" role="status">
          <p className="cz-alert-title">{en.customize.warn}</p>
          <ul>{verdict.warnings.map((w) => <li key={w}>{w}</li>)}</ul>
          <p className="cz-alert-foot">{en.customize.copyAnyway}</p>
        </div>
      ) : null}
    </>
  );

  const connectorsPart = (
    <div className="rc-connectors">
      <h2 className="rc-h2">{en.team.connectFirst}</h2>
      <div className="mt-3">
        <ConnectorRow names={team.connectors} labeled size={18} />
      </div>
      <div className="mt-4 grid gap-2 text-[0.82rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
        {solo ? <p>{en.xai.soloNote}</p> : null}
        <p>{en.team.connectorsNote}</p>
        <p>{en.team.installNote}</p>
      </div>
    </div>
  );

  const overwritePart = pending ? (
      <div
        ref={overwriteRef}
        className="cz-alert cz-alert-stop"
        role="alertdialog"
        aria-labelledby={overwriteTitleId}
        aria-describedby={overwriteBodyId}
      >
        <h3 id={overwriteTitleId} className="cz-alert-title">{en.customize.overwriteTitle}</h3>
        <p id={overwriteBodyId}>{en.customize.overwriteBody}</p>
        <div className="cz-alert-actions">
          <button
            type="button"
            className="cz-btn"
            onClick={() => {
              const run = pending;
              setPending(null);
              setState((prev) => ({ ...prev, override: null }));
              run();
            }}
          >
            {en.customize.overwriteGo}
          </button>
          <button type="button" className="cz-btn cz-btn-quiet" onClick={() => setPending(null)}>
            {en.customize.overwriteKeep}
          </button>
        </div>
      </div>
  ) : null;

  const panelPart = editing ? (
      <div className="cz-panel mt-8">
        <p className="cz-lead">{en.customize.lead}</p>
        <div className="cz-panel-head">
          <button type="button" className="cz-btn cz-btn-quiet" onClick={reset}>{en.customize.reset}</button>
          <span className="cz-hint">{en.customize.resetHint}</span>
        </div>

        <fieldset className="cz-group">
          <legend className="cz-legend">{en.customize.connectors}</legend>
          <p className="cz-truth">{en.customize.connectorTruth}</p>
          <ul className="cz-list">
            {team.connectors.map((connector) => {
              const mark = resolveConnector(connector);
              const mode = state.modes[connector] ?? "draft";
              return (
                <li key={connector} className="cz-conn">
                  <span className="cz-conn-name">
                    {mark.src ? (
                      <img src={mark.src} alt="" width={16} height={16} className="connector-mark" />
                    ) : (
                      <span className="connector-fallback" aria-hidden>{mark.name.slice(0, 1)}</span>
                    )}
                    {connector}
                  </span>
                  <span className="cz-modes" role="group" aria-label={`${connector} mode`}>
                    {MODES.map((m) => (
                      <button
                        key={m}
                        type="button"
                        className={`cz-mode${mode === m ? " is-on" : ""}`}
                        aria-pressed={mode === m}
                        title={MODE_HINT[m]}
                        aria-describedby={`${modeHintId}-${m}`}
                        onClick={() => patch({ modes: { ...state.modes, [connector]: m } })}
                      >
                        {MODE_LABEL[m]}
                      </button>
                    ))}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="sr-only">
            {MODES.map((m) => (
              <p key={m} id={`${modeHintId}-${m}`}>{MODE_HINT[m]}</p>
            ))}
          </div>
          {readish.length > 0 ? <p className="cz-hint mt-3">{en.customize.pluginsNote(readish.join(", "))}</p> : null}
        </fieldset>

        <fieldset className="cz-group">
          <legend className="cz-legend">{en.customize.bots}</legend>
          {solo ? <p className="cz-truth">{en.xai.soloRoster}</p> : null}
          <ul className="cz-list">
            {team.agents.map((agent, i) => {
              const on = isOn(state, agent.name);
              return (
                <li key={agent.name} className={`cz-bot${on ? "" : " is-off"}`}>
                  <div className="cz-bot-top">
                    {solo ? null : (
                      <label className="cz-check">
                        <input type="checkbox" checked={on} onChange={() => toggleBot(agent.name)} />
                        <span className="sr-only">{`${en.customize.botOn}: ${agent.name}`}</span>
                      </label>
                    )}
                    <GrokBotMark size={18} animate={on} style={botMarkStyle(i)} />
                    <label className="cz-field cz-field-grow">
                      <span className="sr-only">{`${en.customize.botName}: ${agent.name}`}</span>
                      <input
                        type="text"
                        className="cz-input"
                        value={state.names[agent.name] ?? grokMemberName(team.name, agent.name)}
                        disabled={!on}
                        onChange={(e) => patch({ names: { ...state.names, [agent.name]: e.target.value } })}
                      />
                    </label>
                  </div>
                  <p className="cz-bot-persona">{agent.persona}</p>
                  {agent.reuse ? <p className="cz-hint">{en.customize.reuseNote}</p> : null}
                  {agent.connectors.length > 0 ? (
                    <div className="mt-2"><ConnectorRow names={agent.connectors} labeled size={14} /></div>
                  ) : null}
                  {on ? (
                    <label className="cz-field mt-2">
                      <span className="cz-field-label">{en.customize.botNote}</span>
                      <input
                        type="text"
                        className="cz-input"
                        placeholder={en.customize.botNotePlaceholder}
                        value={state.notes[agent.name] ?? ""}
                        onChange={(e) => patch({ notes: { ...state.notes, [agent.name]: e.target.value } })}
                      />
                      <span className="cz-hint">{en.customize.botNoteHint}</span>
                    </label>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </fieldset>

        {solo ? null : (
        <fieldset className="cz-group">
          <legend className="cz-legend">{en.customize.room}</legend>
          <label className="cz-field">
            <span className="cz-field-label">{en.customize.roomName}</span>
            <input
              type="text"
              className="cz-input"
              value={state.roomName}
              onChange={(e) => patch({ roomName: e.target.value })}
            />
          </label>
          <p className="cz-field-label mt-4">
            {en.customize.roomMembers} · {en.customize.roomRule}{" "}
            <span className={resolved.members.length < 2 || resolved.members.length > 6 ? "cz-count-bad" : "cz-count"}>
              {en.customize.roomCount(resolved.members.length)}
            </span>
          </p>
          <ul className="cz-members">
            {team.agents.filter((a) => isOn(state, a.name)).map((agent) => (
              <li key={agent.name}>
                <label className="cz-check cz-check-row">
                  <input
                    type="checkbox"
                    checked={state.members.includes(agent.name)}
                    onChange={() => toggleMember(agent.name)}
                  />
                  <span>{grokDisplayBotName(state.names[agent.name] ?? agent.name)}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
        )}


        <SkillselionPicker
          picks={state.skillPicks}
          agents={team.agents}
          liveHits={liveHits}
          onChange={(skillPicks) => patch({ skillPicks })}
        />

        <fieldset className="cz-group">
          <legend className="cz-legend">{en.customize.also}</legend>
          <p className="cz-truth">{en.customize.alsoLead}</p>
          {team.suggest.length > 0 ? (
            <div className="cz-chips">
              {team.suggest.map((s) => (
                <button
                  key={s.text}
                  type="button"
                  className={`cz-chip${state.chips.includes(s.text) ? " is-on" : ""}`}
                  aria-pressed={state.chips.includes(s.text)}
                  onClick={() => toggleChip(s.text)}
                >
                  {s.text}
                </button>
              ))}
            </div>
          ) : null}
          <label className="cz-field mt-3">
            <span className="sr-only">{en.customize.also}</span>
            <textarea
              className="cz-input cz-textarea"
              rows={3}
              placeholder={en.customize.alsoPlaceholder}
              value={state.free}
              onChange={(e) => patch({ free: e.target.value })}
            />
          </label>
          <p className="cz-hint">{en.customize.alsoNoSecrets}</p>
        </fieldset>

        <fieldset className="cz-group">
          <legend className="cz-legend">{en.customize.paste}</legend>
          <label className="cz-check cz-check-row">
            <input
              type="checkbox"
              checked={state.installed}
              onChange={() => patch({ installed: !state.installed })}
            />
            <span>{en.customize.installed}</span>
          </label>
          <p className="cz-hint">{en.customize.installedHint}</p>
          <div className="cz-actions mt-4">
            <button type="button" className="cz-btn cz-btn-quiet" onClick={copyShareLink}>
              {shared ? en.customize.shared : en.customize.share}
            </button>
            <button type="button" className="cz-btn cz-btn-quiet" onClick={download}>
              {en.customize.download}
            </button>
          </div>
        </fieldset>
      </div>
  ) : null;

  /* The roster, the room, and the routines as they stand right now. Read
     them and you know what the paste will do. */
  const rosterPart = (
    <section className="rp-job-list">
      <ul>
        {resolved.agents.map(({ source, name, note }, i) => (
          <li key={source.name} className="hairline-row">
            <div className="flex gap-3">
              <GrokBotMark size={19} animate className="mt-0.5" style={botMarkStyle(i)} />
              <div className="min-w-0">
                <p className="flex flex-wrap items-baseline gap-2" style={{ fontFamily: ledger.serif }}>
                  <span>{grokDisplayBotName(name || source.name)}{source.reuse ? ` · ${en.team.reuse}` : ""}</span>
                  <span className="bot-tag">{en.team.botTag}</span>
                </p>
                <p className="mt-1 text-[0.82rem] leading-relaxed" style={{ color: ledger.inkMuted }}>{source.persona}</p>
                {note ? <p className="mt-1 text-[0.82rem] leading-relaxed" style={{ color: ledger.inkMuted }}>{note}</p> : null}
                {source.connectors.length > 0 ? (
                  <div className="mt-2"><ConnectorRow names={source.connectors} labeled size={16} /></div>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );

  const routinesPart = resolved.routines.length > 0 ? (
      <section className="rp-job-list">
        <ul>
          {resolved.routines.map(({ source, owner }) => (
            <li key={source.name} className="hairline-row">
              <p style={{ fontFamily: ledger.serif }}>{source.name}</p>
              <p className="rp-run-meta">
                <span className="rp-run-owner"><span className="rp-run-k">{en.team.ownerBot}</span> {grokDisplayBotName(owner)}</span>
                <span className="rp-run-cadence">{source.schedule}</span>
              </p>
              <p className="mt-1 text-[0.82rem] leading-relaxed" style={{ color: ledger.inkMuted }}>{source.prompt}</p>
            </li>
          ))}
        </ul>
      </section>
  ) : null;

  const promptPart = (
    <div className="mt-12 border-t pt-8" style={{ borderColor: ledger.hairline }}>
      <h2 className="eyebrow mb-4">
        {en.team.promptTitle}
      </h2>
      <div className="cz-actions">
        <CopyInstallerButton text={verdict.canCopy ? prompt : ""} disabled={!verdict.canCopy} />
      </div>
      <details className="cz-advanced mt-4">
        <summary>{en.customize.advanced}</summary>
        <p className="cz-hint mt-2">{en.customize.advancedHint}</p>
        {state.override !== null ? (
          <p className="cz-hint mt-2">
            {en.customize.advancedEdited}{" "}
            <button type="button" className="cz-link" onClick={() => setState((p) => ({ ...p, override: null }))}>
              {en.customize.advancedRegenerate}
            </button>
          </p>
        ) : null}
        <textarea
          className="cz-input cz-prompt-edit mt-3"
          rows={14}
          value={prompt}
          onChange={(e) => setState((p) => ({ ...p, override: e.target.value }))}
        />
      </details>
      <pre className="installer-prompt mt-4 overflow-x-auto p-4 text-[0.72rem] leading-relaxed" style={{ fontFamily: ledger.mono }}>
        <code>{prompt}</code>
      </pre>
    </div>
  );

  /*
   * One page.
   *
   * It used to be eight arrangements of the same pile, which is a way of
   * avoiding the question of what belongs where. This answers it:
   *
   *   The install never leaves. Name, chip, one line of job, and Copy sit
   *   in a header that stays put, because copying the prompt is the whole
   *   transaction and it should never require scrolling back.
   *
   *   The Bots are the product, so they are chips you can see without
   *   clicking anything. A recipe with one Bot still shows that Bot here.
   *
   *   Job, routines, notes and the prompt are skippable and wildly
   *   different lengths, so they are a vertical accordion with every
   *   title visible. Not tabs: roughly a quarter of people never open a
   *   horizontal tab and conclude the content is missing.
   *
   *   Customize is a mode rather than a read, so it opens as a sheet over
   *   this page and closes back onto it.
   */
  const rosterLabel = solo ? en.recipe.secJob : en.recipe.secRoster;

  return (
    <div className="rp">
      <header className="rp-head">
        <div className="rp-head-row">
          <div className="rp-head-id">
            <p className="rp-name">{grokRecipeTitle(team.kind, team.name)}</p>
            <p className="rp-job">{team.tagline}</p>
          </div>
          <div
            ref={actionsRef.ref}
            className={`rp-head-act scroll-fade${actionsRef.edges.start ? " has-start" : ""}${actionsRef.edges.end ? " has-end" : ""}`}
          >
            <CopyInstallerButton
              text={verdict.canCopy ? prompt : ""}
              disabled={!verdict.canCopy}
              disabledReason={verdict.errors[0]}
            />
            {/* Secondary on purpose. Copy is the transaction. */}
            <button
              type="button"
              className="rp-secondary"
              aria-expanded={sheet !== null}
              aria-haspopup="dialog"
              aria-controls={sheet !== null ? sheetId : undefined}
              onClick={openCustomize}
            >
              {en.customize.open}
            </button>
            <ShareBar name={grokRecipeTitle(team.kind, team.name)} />
          </div>
        </div>
        {team.fromXai ? (
          <div className="rp-head-chips">
            <FromXaiChip />
          </div>
        ) : null}
      </header>

      {verdictPart}
      {overwritePart}

      {/* The roster, visible without a click. Inline actions land on these
          chips later; today they are honest labels. */}
      <section className="rp-roster" aria-label={rosterLabel}>
        <h2 className="rc-h2">{rosterLabel}</h2>
        <ul className="rp-chips">
          {resolved.agents.map(({ source, name }, i) => (
            <li key={source.name} className="rp-chip">
              <GrokBotMark size={17} animate style={botMarkStyle(i)} />
              <span className="rp-chip-name">{grokDisplayBotName(name || source.name)}</span>
              {source.reuse ? <span className="rp-chip-note">{en.team.reuse}</span> : null}
            </li>
          ))}
        </ul>
        {solo ? null : (
          <div className="rp-room">
            <span className="rp-room-label">{en.recipe.secRoom}</span>
            <p className="rp-room-name">{resolved.roomName}</p>
            <ul className="rp-room-grid">
              {resolved.members.map((m) => (
                <li key={m}>{grokDisplayBotName(m)}</li>
              ))}
            </ul>
          </div>
        )}
        {/* The connectors the account needs, in the open, not behind a
            fourth mystery tab. */}
        <div className="rp-connectors">
          <span className="rp-room-label">{en.recipe.secConnectors}</span>
          <ConnectorRow names={team.connectors} labeled size={18} />
        </div>
      </section>

      {/* Native exclusive accordion. Opening one section closes the
          others so sticky titles cannot stack into a wall on a phone. */}
      <div
        className="rp-acc"
        onToggle={(event) => {
          const section = event.target;
          if (!(section instanceof HTMLDetailsElement) || !section.open) return;
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
              const head = document.querySelector(".rp-head");
              const offset = (head?.getBoundingClientRect().bottom ?? 0) + 8;
              const top = section.getBoundingClientRect().top + window.scrollY - offset;
              window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
            });
          });
        }}
      >
        <details className="rp-sec" name="recipe" open>
          <summary className="rp-sum"><RecipeSecIcon name="job" /><span className="rp-sum-lab">{en.recipe.secJob}</span></summary>
          <div className="rp-secbody">
            {rosterPart}
          </div>
        </details>

        <details className="rp-sec" name="recipe">
          <summary className="rp-sum">
            <RecipeSecIcon name="routines" />
            <span className="rp-sum-lab">{en.recipe.secRoutines}</span>
            <span className="rp-count">{resolved.routines.length}</span>
          </summary>
          <div className="rp-secbody">
            {resolved.routines.length > 0 ? routinesPart : <p className="rc-empty">{en.recipe.noRoutines}</p>}
          </div>
        </details>

        <details className="rp-sec" name="recipe">
          <summary className="rp-sum">
            <RecipeSecIcon name="skills" />
            <span className="rp-sum-lab">{en.customize.skills}</span>
            <span className="rp-count">{state.skillPicks.length || team.skills.length}</span>
          </summary>
          <div className="rp-secbody">
            {state.skillPicks.length > 0 ? (
              <ul className="cz-list">
                {state.skillPicks.map((pick) => (
                  <li key={`${pick.id}::${pick.scope}`} className="hairline-row">
                    <SkillHitFace
                      hit={pick}
                      live={liveHits[pick.id]}
                      extra={pick.use === "install" ? en.customize.skillsInstall : en.customize.skillsFetch}
                    />
                  </li>
                ))}
              </ul>
            ) : team.skills.length > 0 ? (
              <ul className="cz-list">{team.skills.map((name) => <li key={name} className="hairline-row">{name}</li>)}</ul>
            ) : (
              <p className="rc-empty">{en.customize.skillsLead}</p>
            )}
          </div>
        </details>

        <details className="rp-sec" name="recipe">
          <summary className="rp-sum">
            <RecipeSecIcon name="notes" />
            <span className="rp-sum-lab">{en.recipe.secNotes}</span>
            <span className="rp-count">{notes.length}</span>
          </summary>
          <div className="rp-secbody">{notes.length > 0 ? notes : <p className="rc-empty">{en.recipe.noNotes}</p>}</div>
        </details>

        <details className="rp-sec" name="recipe">
          <summary className="rp-sum"><RecipeSecIcon name="installer" /><span className="rp-sum-lab">{en.recipe.secInstaller}</span></summary>
          <div className="rp-secbody">
            <p className="rp-note">{en.team.installNote}</p>
            <pre className="installer-prompt mt-4 overflow-x-auto p-4 text-[0.72rem] leading-relaxed" style={{ fontFamily: ledger.mono }}>
              <code>{prompt}</code>
            </pre>
          </div>
        </details>
      </div>

      {related}
      {extras}

      {/* Customize: a mode over the page, not a different page. Closing it
          leaves the URL exactly as it was. */}
      {sheet !== null && mounted
        ? createPortal(
        <div id={sheetId} ref={sheetRef} className="rp-sheet-wrap" role="dialog" aria-modal="true" aria-labelledby={`${sheetId}-title`}>
          <button type="button" className="rp-scrim" aria-label={en.recipe.close} onClick={closeSheet} />
          <div className="rp-sheet">
            <div className="rp-sheet-head">
              <h2 id={`${sheetId}-title`} className="rc-h2">{en.customize.title}</h2>
              <div className="rp-sheet-act">
                <CopyInstallerButton
              text={verdict.canCopy ? prompt : ""}
              disabled={!verdict.canCopy}
              disabledReason={verdict.errors[0]}
            />
                <button type="button" className="rp-secondary" onClick={closeSheet}>{en.recipe.close}</button>
              </div>
            </div>
            <div className="rp-sheet-body">
              {verdictPart}
              {connectorsPart}
              {panelPart}
              {promptPart}
            </div>
          </div>
        </div>,
        document.body,
      )
        : null}
    </div>
  );
}
