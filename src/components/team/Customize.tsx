"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ConnectorRow } from "@/components/ConnectorRow";
import { CopyInstallerButton } from "@/components/CopyInstallerButton";
import { VerifiedChip } from "@/components/VerifiedChip";
import { GrokBotMark } from "@/components/icons/GrokBotMark";
import { botMarkStyle } from "@/lib/bot-icon";
import { resolveConnector } from "@/lib/connectors";
import { ledger } from "@/lib/ledger-theme";
import { en } from "@/lib/messages/en";
import type { RecipeLayout } from "@/lib/recipe-layout";
import { site } from "@/lib/site";
import type { ConnectorMode, Team } from "@/lib/types";
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

type WorkbenchTab = "roster" | "routines" | "customize" | "notes";

export function Customize({
  team,
  layout = "rail",
  identity,
  related,
  extras,
  children,
}: {
  team: Team;
  layout?: RecipeLayout;
  /* The identity block is rendered by the page and passed in, because
     where it sits is a layout decision and the page cannot know it. */
  identity?: ReactNode;
  related?: ReactNode;
  extras?: ReactNode;
  children?: ReactNode;
}) {
  const [tab, setTab] = useState<WorkbenchTab>("roster");
  const topActionsRef = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(false);
  const [editing, setEditing] = useState(false);
  const [state, setState] = useState<CustomState>(() => defaultState(team));
  const [shared, setShared] = useState(false);
  /* A recipe change while a hand-edited prompt exists parks here until the
     human says which one wins. */
  const [pending, setPending] = useState<(() => void) | null>(null);
  const hydrated = useRef(false);

  /* A shared link carries its edits in the hash, so it never reaches the
     server and the page stays static. Opening one starts in edit mode,
     because arriving at someone's customized team and seeing the stock
     recipe would be a lie. */
  useEffect(() => {
    const raw = window.location.hash.replace(/^#/, "");
    if (raw.startsWith(HASH_KEY)) {
      const payload = raw.slice(HASH_KEY.length);
      if (payload) {
        /* Once, on mount. The server cannot see the hash, so reading it
           any earlier would render one recipe and hydrate another. */
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState(decodeState(team, payload));
        setEditing(true);
      }
    }
    hydrated.current = true;
  }, [team]);

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

  /* The mobile bar appears only once the in-page Copy has left the
     viewport, so a phone does not arrive with a pinned bar over content
     it has not read yet. Desktop never shows it. */
  useEffect(() => {
    const el = topActionsRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setShowBar(!entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [layout]);

  const readish = team.connectors.filter((c) => (state.modes[c] ?? "draft") !== "ask");
  /*
   * The page is assembled from named parts rather than one long column,
   * because the three layouts put the same parts in different places.
   * Nothing below decides where it goes; the switch at the bottom does.
   */
  const actionsPart = (
    <div className="cz-actions" ref={topActionsRef}>
      <CopyInstallerButton text={verdict.canCopy ? prompt : ""} disabled={!verdict.canCopy} />
      <button
        type="button"
        className="theme-control theme-control-label"
        aria-expanded={editing}
        onClick={() => setEditing((v) => !v)}
      >
        {editing ? en.customize.close : en.customize.open}
      </button>
      {/* Beside Copy, not in the page header, so it describes the recipe
          as it stands rather than the one on the shelf. */}
      {solo ? null : <VerifiedChip on={verdict.verified} />}
    </div>
  );

  const verdictPart = (
    <>
      {verdict.errors.length > 0 ? (
        <div className="cz-alert cz-alert-stop" role="alert">
          <p className="cz-alert-title">{en.customize.blocked}</p>
          <ul>{verdict.errors.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
      ) : null}
      {verdict.warnings.length > 0 ? (
        <div className="cz-alert cz-alert-warn">
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
      <div className="cz-alert cz-alert-stop" role="alertdialog" aria-label={en.customize.overwriteTitle}>
        <p className="cz-alert-title">{en.customize.overwriteTitle}</p>
        <p>{en.customize.overwriteBody}</p>
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
                        value={state.names[agent.name] ?? agent.name}
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
                  <span>{state.names[agent.name] ?? agent.name}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
        )}

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
    <section className="mt-12 border-t pt-8" style={{ borderColor: ledger.hairline }}>
      {/* One Bot is a job, not a roster. */}
      <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>
        {solo ? en.recipe.secJob : en.team.agents}
      </h2>
      <ul className="mt-4">
        {resolved.agents.map(({ source, name, note }, i) => (
          <li key={source.name} className="hairline-row py-3">
            <div className="flex gap-3">
              <GrokBotMark size={19} animate className="mt-0.5" style={botMarkStyle(i)} />
              <div className="min-w-0">
                <p className="flex flex-wrap items-baseline gap-2" style={{ fontFamily: ledger.serif }}>
                  <span>{name || source.name}{source.reuse ? ` · ${en.team.reuse}` : ""}</span>
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

  const roomPart = solo ? null : (
    <section className="mt-10 border-t pt-8" style={{ borderColor: ledger.hairline }}>
      <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>{en.team.rooms}</h2>
      <ul className="mt-4">
        <li className="hairline-row py-3">
          <p style={{ fontFamily: ledger.serif }}>{resolved.roomName}</p>
          <p className="mt-1 text-[0.82rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
            {resolved.members.join(", ")}
          </p>
        </li>
      </ul>
    </section>
  );

  const routinesPart = resolved.routines.length > 0 ? (
      <section className="mt-10 border-t pt-8" style={{ borderColor: ledger.hairline }}>
        <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>{en.team.routines}</h2>
        <ul className="mt-4">
          {resolved.routines.map(({ source, owner }) => (
            <li key={source.name} className="hairline-row py-3">
              <p style={{ fontFamily: ledger.serif }}>{source.name}</p>
              <p className="mt-1 text-[0.62rem] uppercase tracking-[0.14em]" style={{ color: ledger.label }}>
                {en.team.ownerBot} {owner} · {source.schedule}
              </p>
              <p className="mt-1 text-[0.82rem] leading-relaxed" style={{ color: ledger.inkMuted }}>{source.prompt}</p>
            </li>
          ))}
        </ul>
      </section>
  ) : null;

  const promptPart = (
    <div className="mt-12 border-t pt-8" style={{ borderColor: ledger.hairline }}>
      <h2 className="mb-4 text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>
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

  const sections: { id: string; label: string }[] = [
    { id: "overview", label: en.recipe.secOverview },
    { id: "roster", label: solo ? en.recipe.secJob : en.recipe.secRoster },
    ...(solo ? [] : [{ id: "room", label: en.recipe.secRoom }]),
    ...(resolved.routines.length > 0 ? [{ id: "routines", label: en.recipe.secRoutines }] : []),
    { id: "installer", label: en.recipe.secInstaller },
    ...(related ? [{ id: "related", label: en.recipe.secRelated }] : []),
  ];

  /* A. Rail. Two columns on desktop, the action column sticky. The reading
     column keeps everything you scroll through, including Related, which
     belongs to the page rather than to the action. */
  if (layout === "rail") {
    return (
      <div className="rc rc-rail">
        <div className="rc-rail-main">
          {identity}
          {/* On a phone the action is here, in the identity block, not
              pinned to the bottom on arrival. The bar comes later. */}
          <div className="rc-inline-actions">
            {actionsPart}
            {verdictPart}
          </div>
          {overwritePart}
          <div className="rc-rail-connectors">{connectorsPart}</div>
          {panelPart}
          <div id="roster">{rosterPart}</div>
          {solo ? null : <div id="room">{roomPart}</div>}
          {resolved.routines.length > 0 ? <div id="routines">{routinesPart}</div> : null}
          {children}
          <div id="installer">{promptPart}</div>
          {related ? <div id="related">{related}</div> : null}
          {extras}
        </div>

        <aside className="rc-rail-side" aria-label={en.recipe.sideAria}>
          <div className="rc-rail-stick">
            {actionsPart}
            {verdictPart}
            {connectorsPart}
            {editing ? null : <p className="rc-side-hint">{en.recipe.sideHint}</p>}
          </div>
        </aside>

        {/* Mobile only, and only once the first Copy has scrolled away.
            It sits above the safe area and never covers Customize, which
            is why the bar carries Customize too. */}
        <div className={`rc-bottom${showBar ? " is-up" : ""}`} aria-hidden={!showBar}>
          <CopyInstallerButton text={verdict.canCopy ? prompt : ""} disabled={!verdict.canCopy} />
          <button
            type="button"
            className="theme-control theme-control-label"
            aria-expanded={editing}
            onClick={() => setEditing((v) => !v)}
          >
            {editing ? en.customize.close : en.customize.open}
          </button>
        </div>
      </div>
    );
  }

  /* B. Workbench. Identity and the action above the fold, then one panel
     at a time. Tabs here are sibling panels, not navigation, which is the
     only thing tabs are good at. */
  if (layout === "workbench") {
    const panels: { id: WorkbenchTab; label: string; node: React.ReactNode }[] = [
      { id: "roster", label: solo ? en.recipe.secJob : en.recipe.secRoster, node: (
        <>
          {rosterPart}
          {solo ? null : roomPart}
        </>
      ) },
      { id: "routines", label: en.recipe.secRoutines, node: resolved.routines.length > 0 ? routinesPart : <p className="rc-empty">{en.recipe.noRoutines}</p> },
      { id: "customize", label: en.customize.title, node: (
        <>
          {connectorsPart}
          {editing ? panelPart : <p className="rc-empty">{en.recipe.customizeClosed}</p>}
          {promptPart}
        </>
      ) },
      { id: "notes", label: en.recipe.secNotes, node: children ?? <p className="rc-empty">{en.recipe.noNotes}</p> },
    ];
    const current = panels.find((p) => p.id === tab) ?? panels[0];

    return (
      <div className="rc rc-workbench">
        {identity}
        <div className="rc-inline-actions">
          {actionsPart}
          {verdictPart}
        </div>
        {overwritePart}

        {/* Four labels wrap to two lines at 390px, which is fine. A
            select would be needed past that, and it is not. */}
        <div className="rc-tabs" role="tablist" aria-label={en.recipe.tabsAria}>
          {panels.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              id={`rc-tab-${p.id}`}
              aria-selected={p.id === current.id}
              aria-controls={`rc-panel-${p.id}`}
              className={`rc-tab${p.id === current.id ? " is-on" : ""}`}
              onClick={() => {
                setTab(p.id);
                if (p.id === "customize") setEditing(true);
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="rc-panel" role="tabpanel" id={`rc-panel-${current.id}`} aria-labelledby={`rc-tab-${current.id}`}>
          {current.node}
        </div>

        {related ? <div className="rc-after">{related}</div> : null}
        {extras}
      </div>
    );
  }

  /* C. Outline. One reading column. The page owns the scroll; the only
     fixed thing is a short list of where you are, and on a phone that is
     a closed disclosure rather than a third sticky strip. */
  return (
    <div className="rc rc-outline">
      <details className="rc-toc-m">
        <summary>{en.recipe.onThisPage}</summary>
        <ul>
          {sections.map((s) => (
            <li key={s.id}><a href={`#${s.id}`}>{s.label}</a></li>
          ))}
        </ul>
      </details>

      <div className="rc-outline-main">
        <div id="overview">
          {identity}
          <div className="rc-inline-actions">
            {actionsPart}
            {verdictPart}
          </div>
          {overwritePart}
          {connectorsPart}
        </div>
        {panelPart}
        <div id="roster">{rosterPart}</div>
        {solo ? null : <div id="room">{roomPart}</div>}
        {resolved.routines.length > 0 ? <div id="routines">{routinesPart}</div> : null}
        {children}
        <div id="installer">{promptPart}</div>
        {related ? <div id="related">{related}</div> : null}
        {extras}
      </div>

      <nav className="rc-toc" aria-label={en.recipe.onThisPage}>
        <div className="rc-toc-stick">
          <p className="rc-toc-title">{en.recipe.onThisPage}</p>
          <ul>
            {sections.map((s) => (
              <li key={s.id}><a href={`#${s.id}`}>{s.label}</a></li>
            ))}
          </ul>
          {/* Small, not a second column. The real Copy is in Installer. */}
          <div className="rc-toc-copy">
            <CopyInstallerButton text={verdict.canCopy ? prompt : ""} disabled={!verdict.canCopy} />
          </div>
        </div>
      </nav>
    </div>
  );
}
