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

export function Customize({ team, children }: { team: Team; children?: ReactNode }) {
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

  const readish = team.connectors.filter((c) => (state.modes[c] ?? "draft") !== "ask");

  return (
    <>
      {/* Connect first, then copy. Both stay above the roster: the shelf
          sells one paste, so the action cannot sit below three screens. */}
      <div className="mt-7 border-t pt-6" style={{ borderColor: ledger.hairline }}>
        <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>
          {en.team.connectFirst}
        </h2>
        <div className="mt-3">
          <ConnectorRow names={team.connectors} labeled size={18} />
        </div>

        <div className="cz-actions mt-5">
          <CopyInstallerButton text={verdict.canCopy ? prompt : ""} disabled={!verdict.canCopy} />
          <button
            type="button"
            className="theme-control theme-control-label"
            aria-expanded={editing}
            onClick={() => setEditing((v) => !v)}
          >
            {editing ? en.customize.close : en.customize.open}
          </button>
          {/* Lives beside Copy, not in the page header, so it describes the
              recipe as it stands rather than the one on the shelf. */}
          {solo ? null : <VerifiedChip on={verdict.verified} />}
        </div>

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

        <div className="mt-5 grid gap-2 text-[0.82rem] leading-relaxed" style={{ color: ledger.inkMuted }}>
          {solo ? <p>{en.xai.soloNote}</p> : null}
          <p>{en.team.connectorsNote}</p>
          <p>{en.team.installNote}</p>
        </div>
      </div>

      {pending ? (
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
      ) : null}

      {editing ? (
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
      ) : null}

      {/* The roster, the room, and the routines as they stand right now.
          Read them and you know what the paste will do. */}
      <section className="mt-12 border-t pt-8" style={{ borderColor: ledger.hairline }}>
        <h2 className="text-[0.6rem] uppercase tracking-[0.26em]" style={{ color: ledger.accentText }}>{en.team.agents}</h2>
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

      {solo ? null : (
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
      )}

      {resolved.routines.length > 0 ? (
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
      ) : null}

      {children}

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
    </>
  );
}
