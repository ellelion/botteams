"use client";

import { grokDisplayBotName, grokMemberName, grokRecipeTitle } from "@/lib/grok-names";
import { Children, useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
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
import { botBringsLine } from "@/lib/bot-line";
import { ledger } from "@/lib/ledger-theme";
import { en } from "@/lib/messages/en";
import { site } from "@/lib/site";
import type { Team } from "@/lib/types";
import { useCopyFeedback } from "@/lib/use-copy-feedback";
import { useDialogChrome } from "@/lib/use-dialog-chrome";
import { cssZoom, useScrollEdges } from "@/lib/use-scroll-edges";
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
  const roomNameErrorId = useId();
  const roomSizeErrorId = useId();
  const alsoHintId = useId();
  const botNameErrorBase = useId();
  const botNoteHintBase = useId();
  const promptEditLabelId = useId();
  const promptEditHintId = useId();
  const promptEditEditedId = useId();
  const sheetRef = useRef<HTMLDivElement>(null);
  const overwriteRef = useRef<HTMLDivElement>(null);
  const overwriteRestoreRef = useRef<HTMLElement | null>(null);
  const closeSheet = useCallback(() => setSheet(null), []);
  /* Portals need a document, so nothing renders one until after hydration. */
  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [state, setState] = useState<CustomState>(() => defaultState(team));
  const { copied: shared, failed: shareFail, copyText } = useCopyFeedback();
  const { copied: saved, failed: saveFail, pulse: pulseSave } = useCopyFeedback();
  const [liveHits, setLiveHits] = useState<Record<string, SkillselionHit>>({});
  const [resolvedHits, setResolvedHits] = useState<Record<string, true>>({});
  const [listingsFailed, setListingsFailed] = useState(false);
  const [listingsNonce, setListingsNonce] = useState(0);

  /* A recipe change while a hand-edited prompt exists parks here until the
     human says which one wins. */
  const [pending, setPending] = useState<(() => void) | null>(null);
  const closeOverwrite = useCallback(() => setPending(null), []);
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

  useDialogChrome({ open: sheet !== null && mounted, paused: Boolean(pending), rootRef: sheetRef, onClose: closeSheet });
  useDialogChrome({
    open: Boolean(pending) && mounted,
    rootRef: overwriteRef,
    onClose: closeOverwrite,
    restoreFromRef: overwriteRestoreRef,
  });
  const { ref: actionsRef, edges: actionEdges } = useScrollEdges<HTMLDivElement>();

  const askedHits = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!mounted) return;
    const ids = [...new Set(state.skillPicks.map((p) => p.id).filter(Boolean))];
    const missing = ids.filter((id) => !liveHits[id] && !resolvedHits[id] && !askedHits.current.has(id));
    if (missing.length === 0) return;
    const asked = askedHits.current;
    for (const id of missing) asked.add(id);
    let cancelled = false;
    const ac = new AbortController();
    const cap = window.setTimeout(() => ac.abort(), 10_000);
    fetch(`/api/skillselion/listings?ids=${missing.map(encodeURIComponent).join(",")}`, { signal: ac.signal })
      .then((res) => {
        if (!res.ok) throw new Error("listings failed");
        return res.json() as Promise<{ skills?: SkillselionHit[] }>;
      })
      .then((body) => {
        if (cancelled) return;
        setLiveHits((prev) => {
          const next = { ...prev };
          for (const hit of body.skills ?? []) next[hit.id] = hit;
          return next;
        });
        setResolvedHits((prev) => {
          const next = { ...prev };
          for (const id of missing) next[id] = true;
          return next;
        });
      })
      .catch(() => {
        if (cancelled) return;
        for (const id of missing) asked.delete(id);
        setListingsFailed(true);
      })
      .finally(() => window.clearTimeout(cap));
    return () => {
      cancelled = true;
      ac.abort();
      /* React remounts this effect in development. Keep the ids askable
         or a cancelled first flight leaves every row pending forever. */
      for (const id of missing) asked.delete(id);
    };
  }, [mounted, state.skillPicks, liveHits, resolvedHits, listingsNonce]);

  function retryListings() {
    askedHits.current.clear();
    setResolvedHits({});
    setListingsFailed(false);
    setListingsNonce((n) => n + 1);
  }

  function skillCounts(id: string): { pending: boolean; failed: boolean } {
    if (liveHits[id] || resolvedHits[id]) return { pending: false, failed: false };
    if (listingsFailed) return { pending: false, failed: true };
    return { pending: true, failed: false };
  }



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
      if (state.override !== null) {
        overwriteRestoreRef.current =
          document.activeElement instanceof HTMLElement ? document.activeElement : null;
        setPending(() => change);
      } else change();
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
    await copyText(window.location.href);
  }

  function download() {
    try {
      const blob = new Blob([toMarkdown(team, state)], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${team.slug}.md`;
      a.click();
      URL.revokeObjectURL(url);
      pulseSave("ok");
    } catch {
      pulseSave("fail");
    }
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

  const hasConnectors = team.connectors.length > 0;
  const connectorsEmpty = (
    <div className="rc-empty-block">
      <p className="rc-empty">{en.recipe.noConnectors}</p>
      <p className="cz-hint">{en.recipe.noConnectorsHint}</p>
      <Link href="/guides/grok-bot-connectors" className="rp-secondary mt-3">
        {en.recipe.noConnectorsGuide}
      </Link>
    </div>
  );
  const connectorsPart = (
    <div className="rc-connectors">
      <h2 className="rc-h2">{hasConnectors ? en.team.connectFirst : en.recipe.secConnectors}</h2>
      <div className="mt-3">
        {hasConnectors ? <ConnectorRow names={team.connectors} labeled size={18} /> : connectorsEmpty}
      </div>
      <div className="mt-4 grid gap-2 text-[0.82rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
        {solo ? <p>{en.xai.soloNote}</p> : null}
        {hasConnectors ? <p>{en.team.connectorsNote}</p> : null}
        <p>{en.team.installNote}</p>
      </div>
    </div>
  );

  const overwritePart = pending && mounted ? createPortal(
      <div
        ref={overwriteRef}
        className="cz-overwrite"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={overwriteTitleId}
        aria-describedby={overwriteBodyId}
      >
        <button type="button" className="cz-overwrite-scrim" tabIndex={-1} aria-label={en.customize.overwriteKeep} onClick={closeOverwrite} />
        <div className="cz-overwrite-card cz-alert cz-alert-stop">
          <h3 id={overwriteTitleId} className="cz-alert-title">{en.customize.overwriteTitle}</h3>
          <p id={overwriteBodyId}>{en.customize.overwriteBody}</p>
          <div className="cz-alert-actions">
            <button type="button" className="cz-btn cz-btn-quiet" onClick={closeOverwrite}>
              {en.customize.overwriteKeep}
            </button>
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
          </div>
        </div>
      </div>,
      document.body,
    ) : null;

  const panelPart = editing ? (
      <div className="cz-panel mt-8">
        <p className="cz-lead">{en.customize.lead}</p>
        <div className="cz-panel-head">
          <button type="button" className="cz-btn cz-btn-quiet" onClick={reset}>{en.customize.reset}</button>
          <span className="cz-hint">{en.customize.resetHint}</span>
        </div>

        {hasConnectors ? (
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
                        aria-describedby={`${modeHintId}-${m}`}
                        onClick={() => patch({ modes: { ...state.modes, [connector]: m } })}
                      >
                        {MODE_LABEL[m]}
                      </button>
                    ))}
                  </span>
                  <p className="cz-hint cz-mode-hint">{MODE_HINT[mode]}</p>
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
        ) : null}

        <fieldset className="cz-group">
          <legend className="cz-legend">{en.customize.bots}</legend>
          {solo ? <p className="cz-truth">{en.xai.soloRoster}</p> : null}
          <ul className="cz-list">
            {team.agents.map((agent, i) => {
              const on = isOn(state, agent.name);
              const resolvedAgent = resolved.agents.find((row) => row.source.name === agent.name);
              const blankName = on && !resolvedAgent?.name;
              const clashName = Boolean(
                on &&
                  resolvedAgent?.name &&
                  resolved.agents.filter((row) => row.name.toLowerCase() === resolvedAgent.name.toLowerCase()).length > 1,
              );
              const nameErrorId = `${botNameErrorBase}-${i}`;
              const noteHintId = `${botNoteHintBase}-${i}`;
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
                        aria-invalid={blankName || clashName || undefined}
                        aria-describedby={blankName || clashName ? nameErrorId : undefined}
                      />
                    </label>
                  </div>
                  {blankName || clashName ? (
                    <p id={nameErrorId} className="cz-hint" role="alert">
                      {blankName ? en.customize.botNameNeeded : en.customize.botNameClash}
                    </p>
                  ) : null}
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
                        aria-describedby={noteHintId}
                      />
                      <span id={noteHintId} className="cz-hint">{en.customize.botNoteHint}</span>
                    </label>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </fieldset>

        {solo ? null : (
        <fieldset className="cz-group" aria-invalid={resolved.members.length < 2 || resolved.members.length > 6 ? true : undefined} aria-describedby={resolved.members.length < 2 || resolved.members.length > 6 ? roomSizeErrorId : undefined}>
          <legend className="cz-legend">{en.customize.room}</legend>
          <label className="cz-field">
            <span className="cz-field-label">{en.customize.roomName}</span>
            <input
              type="text"
              className="cz-input"
              value={state.roomName}
              onChange={(e) => patch({ roomName: e.target.value })}
              aria-invalid={!resolved.roomName || undefined}
              aria-describedby={!resolved.roomName ? roomNameErrorId : undefined}
            />
            {!resolved.roomName ? (
              <p id={roomNameErrorId} className="cz-hint" role="alert">{en.customize.roomNameNeeded}</p>
            ) : null}
          </label>
          <p className="cz-field-label mt-4">
            {en.customize.roomMembers} · {en.customize.roomRule}{" "}
            <span className={resolved.members.length < 2 || resolved.members.length > 6 ? "cz-count-bad" : "cz-count"}>
              {en.customize.roomCount(resolved.members.length)}
            </span>
          </p>
          {resolved.members.length < 2 || resolved.members.length > 6 ? (
            <p id={roomSizeErrorId} className="cz-hint" role="alert">{en.customize.roomSizeNeeded}</p>
          ) : null}
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
          listingsFailed={listingsFailed}
          skillCounts={skillCounts}
          onRetryListings={retryListings}
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
              aria-describedby={alsoHintId}
            />
          </label>
          <p id={alsoHintId} className="cz-hint">{en.customize.alsoNoSecrets}</p>
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
            <button type="button" className={`cz-btn cz-btn-quiet${shareFail ? " is-copy-fail" : ""}`} onClick={copyShareLink}>
              {shareFail ? en.customize.shareFail : shared ? en.customize.shared : en.customize.share}
            </button>
            <span className="sr-only" role="status" aria-live="polite">
              {shareFail ? en.customize.shareFail : shared ? en.customize.shared : ""}
            </span>
            <button type="button" className={`cz-btn cz-btn-quiet${saveFail ? " is-copy-fail" : ""}`} onClick={download}>
              {saveFail ? en.customize.saveFail : saved ? en.customize.saving : en.customize.download}
            </button>
            <span className="sr-only" role="status" aria-live="polite">
              {saveFail ? en.customize.saveFail : saved ? en.customize.saving : ""}
            </span>
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
        <CopyInstallerButton
          text={verdict.canCopy ? prompt : ""}
          disabled={!verdict.canCopy}
          disabledReason={verdict.errors[0]}
        />
      </div>
      <details className="cz-advanced mt-4">
        <summary id={promptEditLabelId}>{en.customize.advanced}</summary>
        <p id={promptEditHintId} className="cz-hint mt-2">{en.customize.advancedHint}</p>
        {state.override !== null ? (
          <p id={promptEditEditedId} className="cz-hint mt-2">
            {en.customize.advancedEdited}{" "}
            <button type="button" className="cz-link" onClick={() => setState((p) => ({ ...p, override: null }))}>
              {en.customize.advancedRegenerate}
            </button>
          </p>
        ) : null}
        <textarea
          className="cz-input cz-prompt-edit mt-3"
          rows={14}
          spellCheck={false}
          value={prompt}
          onChange={(e) => setState((p) => ({ ...p, override: e.target.value }))}
          aria-labelledby={promptEditLabelId}
          aria-describedby={state.override !== null ? `${promptEditHintId} ${promptEditEditedId}` : promptEditHintId}
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
      <div className="rp-head-id">
        <p className="rp-name">{grokRecipeTitle(team.kind, team.name)}</p>
        <p className="rp-job">{team.tagline}</p>
      </div>
      <header className="rp-head">
        <div
          ref={actionsRef}
          className={`rp-head-act scroll-fade${actionEdges.start ? " has-start" : ""}${actionEdges.end ? " has-end" : ""}`}
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
      </header>
      {team.fromXai ? (
        <div className="rp-head-chips">
          <FromXaiChip />
        </div>
      ) : null}

      {verdictPart}

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
              {state.members
                .map((sourceName) => resolved.agents.find((a) => a.source.name === sourceName))
                .filter((row): row is (typeof resolved.agents)[number] => row != null)
                .map((row) => (
                  <li key={row.source.name}>
                    <span className="rp-room-bot-name">{grokDisplayBotName(row.name)}</span>
                    <span className="rp-room-bot-line">{botBringsLine(row.source.persona, row.source.brings)}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}
        {/* The connectors the account needs, in the open, not behind a
            fourth mystery tab. */}
        <div className="rp-connectors">
          <span className="rp-room-label">{en.recipe.secConnectors}</span>
          {hasConnectors ? (
            <ConnectorRow names={team.connectors} labeled size={18} />
          ) : connectorsEmpty}
        </div>
      </section>

      {/* Native exclusive accordion. Opening one section closes the
          others so sticky titles cannot stack into a wall on a phone. */}
      <div
        className="rp-acc"
        onToggleCapture={(event) => {
          const section = event.target;
          if (!(section instanceof HTMLDetailsElement) || !section.open) return;
          const pin = () => {
            const head = document.querySelector(".rp-head");
            const col = section.closest(".wings-main-col");
            const scale = cssZoom();
            const bar = (head?.getBoundingClientRect().height ?? 0) / scale;
            const sum = section.querySelector(".rp-sum") ?? section;
            const scroller =
              col instanceof HTMLElement && getComputedStyle(col).overflowY !== "visible"
                ? col
                : null;
            if (scroller) {
              const next =
                (sum.getBoundingClientRect().top - scroller.getBoundingClientRect().top) / scale +
                scroller.scrollTop -
                bar -
                32;
              scroller.scrollTo({ top: Math.max(0, next), behavior: "auto" });
              return;
            }
            const offset = (head?.getBoundingClientRect().bottom ?? 0) / scale + 8;
            const top = sum.getBoundingClientRect().top / scale + window.scrollY - offset;
            window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
          };
          /* Exclusive close settles in 2 frames at 100% and several more
             at CSS zoom 200%. Pin each frame until the page height stops
             moving the summary. */
          const chase = (left: number) => {
            pin();
            if (left > 1) window.requestAnimationFrame(() => chase(left - 1));
          };
          window.requestAnimationFrame(() => chase(8));
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
            {resolved.routines.length > 0 ? routinesPart : (
              <div className="rc-empty-block">
                <p className="rc-empty">{en.recipe.noRoutines}</p>
                <p className="cz-hint">{en.recipe.noRoutinesHint}</p>
                <Link
                  href={solo ? "/guides/create-a-grok-bot" : "/guides/install-a-grok-bot-team"}
                  className="rp-secondary mt-3"
                >
                  {solo ? en.recipe.noRoutinesBotGuide : en.recipe.noRoutinesGuide}
                </Link>
              </div>
            )}
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
              <>
              <ul className="cz-list" aria-busy={state.skillPicks.some((pick) => skillCounts(pick.id).pending) || undefined}>
                {state.skillPicks.map((pick) => {
                  const counts = skillCounts(pick.id);
                  return (
                    <li key={`${pick.id}::${pick.scope}`} className="hairline-row">
                      <SkillHitFace
                        hit={pick}
                        live={liveHits[pick.id]}
                        pending={counts.pending}
                        failed={counts.failed}
                        extra={pick.use === "install" ? en.customize.skillsInstall : en.customize.skillsFetch}
                      />
                    </li>
                  );
                })}
              </ul>
              {listingsFailed ? (
                <div className="cz-skill-status" role="alert">
                  <p className="cz-hint">{en.customize.skillsCountsFail}</p>
                  <button type="button" className="cz-btn cz-btn-quiet" onClick={retryListings}>
                    {en.customize.skillsRetry}
                  </button>
                </div>
              ) : null}
              </>
            ) : team.skills.length > 0 ? (
              <ul className="cz-list">{team.skills.map((name) => <li key={name} className="hairline-row">{name}</li>)}</ul>
            ) : (
              <div className="rc-empty-block">
                <p className="rc-empty">{en.recipe.noSkills}</p>
                <p className="cz-hint">{en.recipe.noSkillsHint}</p>
                <button type="button" className="rp-secondary mt-3" onClick={openCustomize}>
                  {en.customize.open}
                </button>
              </div>
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
      {overwritePart}

      {sheet !== null && mounted
        ? createPortal(
        <div id={sheetId} ref={sheetRef} className="rp-sheet-wrap" role="dialog" aria-modal="true" aria-labelledby={`${sheetId}-title`}>
          <button type="button" className="rp-scrim" tabIndex={-1} aria-label={en.recipe.close} onClick={closeSheet} />
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
