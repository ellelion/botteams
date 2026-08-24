"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { GrokBotMark } from "@/components/icons/GrokBotMark";
import { botMarkStyle, botUiKind } from "@/lib/bot-icon";
import { grokDisplayBotName, grokRecipeTitle, grokRoomName } from "@/lib/grok-names";
import { en } from "@/lib/messages/en";
import type { ConversationTurn, Team } from "@/lib/types";
import { useDialogChrome } from "@/lib/use-dialog-chrome";

const YOU_KEYS = new Set(["you", "itzik", "itzik dabush", "founder"]);

function isYouTurn(turn: ConversationTurn): boolean {
  if (turn.role === "user") return true;
  const speaker = turn.speaker.trim().toLowerCase();
  const key = (turn.speakerKey ?? "").trim().toLowerCase();
  return YOU_KEYS.has(speaker) || YOU_KEYS.has(key);
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function shortBot(name: string): string {
  return grokDisplayBotName(name).replace(/ Grok Bot$/i, "").trim();
}

function TalkMention({
  name,
  persona,
  index,
  size = 16,
}: {
  name: string;
  persona?: string;
  index: number;
  size?: number;
}) {
  const style = botMarkStyle(index, name, persona);
  return (
    <span className="talk-mention" style={style}>
      <GrokBotMark size={size} style={style} />
      <span className="talk-mention-name">{shortBot(name)}</span>
    </span>
  );
}

function lastSnippet(turns: ConversationTurn[], upto: number, speakerKey: string, speaker: string): string {
  for (let i = upto - 1; i >= 0; i--) {
    const t = turns[i];
    if (t.speakerKey === speakerKey || t.speaker === speaker) return t.text;
  }
  return "";
}

function hasWatch(team: Team): boolean {
  if (team.conversation && team.conversation.length > 0) return true;
  return Boolean(team.conversationByBot && Object.keys(team.conversationByBot).length > 0);
}

export function WatchControl({ team }: { team: Team }) {
  if (!hasWatch(team)) return null;
  return <WatchOverlay team={team} />;
}

function WatchOverlay({ team }: { team: Team }) {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const label = team.kind === "bot" ? en.team.watchBot : en.team.watchTeam;
  const dialogTitle = team.kind === "bot" ? en.team.watchLabelBot : en.team.watchLabel;

  const openWatch = useCallback(() => {
    setOpen(true);
    if (typeof window !== "undefined") history.replaceState(null, "", "#watch");
  }, []);

  const closeWatch = useCallback(() => {
    setOpen(false);
    if (typeof window === "undefined") return;
    if (window.location.hash === "#watch") {
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  }, []);

  useEffect(() => {
    const onHash = () => setOpen(window.location.hash === "#watch");
    window.addEventListener("hashchange", onHash);
    const boot = window.setTimeout(onHash, 0);
    return () => {
      window.clearTimeout(boot);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  useDialogChrome({ open, rootRef: overlayRef, onClose: closeWatch });

  return (
    <>
      <button
        type="button"
        className="talk-watch-btn"
        onClick={openWatch}
      >
        {label}
      </button>
      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={overlayRef}
              className="talk-overlay"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
            >
              <button type="button" className="talk-overlay-scrim" aria-label={en.recipe.close} onClick={closeWatch} />
              <div className="talk-overlay-canvas">
                <h2 id={titleId} className="sr-only">{dialogTitle}</h2>
                <button type="button" className="talk-overlay-close" onClick={closeWatch}>
                  {en.recipe.close}
                </button>
                <ConversationStage team={team} />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

export function ConversationStage({ team }: { team: Team }) {
  if (!hasWatch(team)) return null;
  return <ConversationStageLive team={team} />;
}

function ConversationStageLive({ team }: { team: Team }) {
  const turns = team.conversation ?? [];
  const byBot = team.conversationByBot ?? {};

  const rootRef = useRef<HTMLElement | null>(null);
  const threadRef = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(0);
  const [playing, setPlaying] = useState(false);
  /* null = group chat. a number = 1:1 with that Bot. */
  const [view, setView] = useState<number | null>(team.kind === "bot" ? 0 : null);
  const reduceRef = useRef(false);

  const agents = team.agents;
  const hasGroup = team.kind === "team" && agents.length > 1;
  const roomLabel = team.rooms[0] ? grokRoomName(team.rooms[0].name) : grokRecipeTitle(team.kind, team.name);
  const solo = view !== null ? agents[view] : null;
  const soloName = solo ? grokDisplayBotName(solo.name) : "";
  const headTitle = solo ? soloName : roomLabel;

  const script = useMemo(() => {
    if (view === null) return turns;
    const agent = agents[view];
    if (!agent) return turns;
    return byBot[agent.name] ?? [];
  }, [turns, view, agents, byBot]);

  const start = useCallback(() => {
    if (reduceRef.current) {
      setShown(script.length);
      setPlaying(false);
      return;
    }
    setShown(0);
    setPlaying(true);
  }, [script.length]);

  useEffect(() => {
    reduceRef.current = prefersReducedMotion();
    const el = rootRef.current;
    if (!el) return;

    const onPlay = () => start();
    el.addEventListener("talk-play", onPlay);

    if (reduceRef.current) {
      setShown(script.length);
      return () => el.removeEventListener("talk-play", onPlay);
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) start();
      },
      { threshold: 0.28 },
    );
    io.observe(el);

    if (typeof window !== "undefined" && window.location.hash === "#watch") {
      start();
    }

    return () => {
      io.disconnect();
      el.removeEventListener("talk-play", onPlay);
    };
  }, [start, turns.length]);

  useEffect(() => {
    if (!playing) return;
    if (shown >= script.length) {
      const pause = window.setTimeout(() => start(), 2400);
      return () => window.clearTimeout(pause);
    }
    const wait = 720 + Math.min(script[shown]?.text.length ?? 20, 80) * 12;
    const id = window.setTimeout(() => setShown((n) => n + 1), wait);
    return () => window.clearTimeout(id);
  }, [playing, shown, script, start]);

  useEffect(() => {
    const pane = threadRef.current;
    if (!pane) return;
    pane.scrollTop = pane.scrollHeight;
  }, [shown, view]);

  useEffect(() => {
    start();
  }, [view, start]);

  const visible = script.slice(0, shown);
  const typing = playing && shown < script.length;

  return (
    <section id="watch" ref={rootRef} className="talk-stage" aria-label={`${roomLabel} conversation`}>
      <div className="talk-body">
      <aside className="talk-rail" aria-label={en.team.watchTeammates}>
        <div className="talk-rail-head" aria-hidden>
          <div className="talk-chrome">
            <span className="talk-dot" />
            <span className="talk-dot" />
            <span className="talk-dot" />
          </div>
        </div>
        <div className="talk-rail-list">
          {agents.map((agent, i) => {
            const name = grokDisplayBotName(agent.name);
            const own = byBot[agent.name] ?? [];
            const snippet = lastSnippet(own, own.length, agent.name, name);
            const selected = view === i;
            const typingHere = selected && typing;
            return (
              <button
                key={agent.name}
                type="button"
                className={`talk-rail-row talk-var-${botUiKind(agent.name, agent.persona)}${selected ? " is-on" : ""}`}
                style={botMarkStyle(i, agent.name, agent.persona)}
                aria-pressed={selected}
                onClick={() => setView(i)}
              >
                <GrokBotMark size={32} animate={typingHere} style={botMarkStyle(i, agent.name, agent.persona)} />
                <span className="talk-rail-meta">
                  <span className="talk-rail-name">{name}</span>
                  <span className="talk-rail-snip">{typingHere ? en.team.watchTyping : snippet || agent.persona}</span>
                </span>
              </button>
            );
          })}
          {hasGroup ? (
            <button
              type="button"
              className={`talk-rail-row talk-rail-room${view === null ? " is-on" : ""}`}
              aria-pressed={view === null}
              onClick={() => setView(null)}
            >
              <span className="talk-stack" aria-hidden>
                {agents.slice(0, 3).map((agent, i) => (
                  <GrokBotMark key={agent.name} size={16} style={botMarkStyle(i, agent.name, agent.persona)} />
                ))}
              </span>
              <span className="talk-rail-meta">
                <span className="talk-rail-name">{roomLabel}</span>
                <span className="talk-rail-snip">{view === null && typing ? en.team.watchTyping : (turns.filter((t) => !isYouTurn(t)).at(-1)?.text ?? en.team.watchGroup)}</span>
              </span>
            </button>
          ) : null}
        </div>
        <div className="talk-you" aria-hidden>
          <span className="talk-you-av">{en.team.watchYouMark}</span>
          <span>{en.team.watchYou}</span>
        </div>
      </aside>

      <div className="talk-main">
        <header className="talk-head">
          <h3 className="talk-head-title">{headTitle}</h3>
          <button type="button" className="talk-replay" onClick={start}>
            {en.team.watchReplay}
          </button>
        </header>

        <div className="talk-dock" aria-label={en.team.watchDock}>
          {hasGroup ? (
            <button
              type="button"
              className={`talk-dock-item${view === null ? " is-on" : ""}`}
              aria-pressed={view === null}
              onClick={() => setView(null)}
              title={roomLabel}
            >
              <span className="talk-stack talk-stack-sm">
                {agents.slice(0, 3).map((agent, i) => (
                  <GrokBotMark key={agent.name} size={12} style={botMarkStyle(i, agent.name, agent.persona)} />
                ))}
              </span>
              <span>{en.team.watchGroup}</span>
            </button>
          ) : null}
          {agents.map((agent, i) => (
            <button
              key={agent.name}
              type="button"
              className={`talk-dock-item talk-var-${botUiKind(agent.name, agent.persona)}${view === i ? " is-on" : ""}`}
              style={botMarkStyle(i, agent.name, agent.persona)}
              aria-pressed={view === i}
              onClick={() => setView(i)}
              title={grokDisplayBotName(agent.name)}
            >
              <GrokBotMark size={22} animate={view === i} style={botMarkStyle(i, agent.name, agent.persona)} />
              <span>{grokDisplayBotName(agent.name).replace(" Grok Bot", "")}</span>
            </button>
          ))}
        </div>

        <div
          className="talk-thread talk-thread-swap"
          key={view === null ? "group" : `bot-${view}`}
          ref={threadRef}
          tabIndex={0}
          aria-label={en.team.watchThread}
        >
          {visible.map((turn, i) => {
            const agentIdx = Math.max(
              0,
              agents.findIndex((a) => a.name === turn.speakerKey || grokDisplayBotName(a.name) === turn.speaker),
            );
            const prev = visible[i - 1];
            const stack = Boolean(prev && (prev.speakerKey ?? prev.speaker) === (turn.speakerKey ?? turn.speaker));
            const you = isYouTurn(turn);
            const mine = !you && view === agentIdx;
            const kind = you ? "you" : botUiKind(turn.speakerKey ?? turn.speaker);
            const hideWho = view !== null || you;
            if (turn.fromBots) {
              const faces = turn.fromBots.keys
                .map((key) => agents.find((a) => a.name === key))
                .filter((a): a is (typeof agents)[number] => Boolean(a));
              const parts: Array<{ key: string; node: ReactNode }> = [];
              let rest = turn.fromBots.text;
              const names = faces
                .map((a) => ({ agent: a, labels: [grokDisplayBotName(a.name), shortBot(a.name), a.name] }))
                .flatMap((x, fi) => x.labels.map((label) => ({ label, agent: x.agent, fi })))
                .sort((a, b) => b.label.length - a.label.length);
              while (rest.length) {
                let hit: { at: number; label: string; agent: (typeof agents)[number]; fi: number } | null = null;
                for (const n of names) {
                  const at = rest.indexOf(n.label);
                  if (at === -1) continue;
                  if (!hit || at < hit.at) hit = { at, label: n.label, agent: n.agent, fi: n.fi };
                }
                if (!hit) {
                  parts.push({ key: `t-${parts.length}`, node: rest });
                  break;
                }
                if (hit.at > 0) parts.push({ key: `t-${parts.length}`, node: rest.slice(0, hit.at) });
                parts.push({
                  key: `m-${hit.agent.name}-${parts.length}`,
                  node: <TalkMention name={hit.agent.name} persona={hit.agent.persona} index={hit.fi} />,
                });
                rest = rest.slice(hit.at + hit.label.length);
              }
              return (
                <article key={`frombots-${i}`} className="talk-frombots">
                  <p className="talk-frombots-kicker">
                    {en.team.watchFrom}{" "}
                    {faces.map((agent, fi) => (
                      <span key={agent.name}>
                        {fi > 0 ? ` ${en.team.watchAnd} ` : ""}
                        <TalkMention name={agent.name} persona={agent.persona} index={fi} />
                      </span>
                    ))}
                  </p>
                  <div className="talk-bubble">
                    <p className="talk-bubble-text">
                      {parts.map((p) => (
                        <span key={p.key}>{p.node}</span>
                      ))}
                    </p>
                  </div>
                </article>
              );
            }
            if (turn.working) {
              const done = turn.working.state === "done";
              const checks = (turn.checks ?? []).slice(0, 4);
              return (
                <article
                  key={`${turn.speaker}-comp-${i}`}
                  className={`talk-entry talk-row talk-var-${kind}${mine ? " is-focus" : ""}${stack ? " is-stack" : ""}`}
                  style={botMarkStyle(agentIdx, turn.speakerKey ?? turn.speaker)}
                >
                  <div className="talk-avatar" aria-hidden>
                    {stack ? null : <GrokBotMark size={26} style={botMarkStyle(agentIdx, turn.speakerKey ?? turn.speaker)} />}
                  </div>
                  <div className={`talk-card talk-computer ${done ? "is-done" : "is-work"}`}>
                    <div className="talk-card-top">
                      <span className="talk-card-title">{en.team.watchComputer}</span>
                      <span className="talk-card-badge"><i />{done ? en.team.watchDone : en.team.watchWorking}</span>
                    </div>
                    {turn.working.detail ? <p className="talk-card-copy">{turn.working.detail}</p> : null}
                    {checks.length ? (
                      <ul className="talk-check talk-check-compact" aria-label={en.team.watchReceipts}>
                        {checks.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </article>
              );
            }
            const receipts = (turn.checks ?? []).slice(0, 4);
            return (
              <article
                key={`${turn.speaker}-${i}`}
                className={`talk-entry talk-row talk-var-${kind}${you ? " is-you" : ""}${mine ? " is-focus" : ""}${stack ? " is-stack" : ""}`}
                style={you ? undefined : botMarkStyle(agentIdx, turn.speakerKey ?? turn.speaker)}
              >
                <div className="talk-avatar" aria-hidden>
                  {stack || you ? null : <GrokBotMark size={26} style={botMarkStyle(agentIdx, turn.speakerKey ?? turn.speaker)} />}
                </div>
                <div className="talk-bubble">
                  {stack || hideWho ? null : <p className="talk-bubble-who">{turn.speaker}</p>}
                  <p className="talk-bubble-text">{turn.text}</p>
                  {receipts.length ? (
                    <ul className="talk-check talk-check-compact" aria-label={en.team.watchReceipts}>
                      {receipts.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </article>
            );
          })}

          {typing ? (
            <div className="talk-typing" role="status" aria-live="polite">
              <span className="sr-only">{en.team.watchTyping}</span>
              <span aria-hidden /><span aria-hidden /><span aria-hidden />
            </div>
          ) : null}
        </div>

        <p className="talk-compose-bar" role="note">
          <span className="talk-composer-ph">{en.team.watchReplayHint}</span>
        </p>
      </div>
      </div>
    </section>
  );
}
