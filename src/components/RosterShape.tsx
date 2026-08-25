import { useId } from "react";
import { GrokBotMark } from "@/components/icons/GrokBotMark";
import { botMarkStyle } from "@/lib/bot-icon";
import { en } from "@/lib/messages/en";
import type { TeamRoutine } from "@/lib/types";

export function RosterShape({
  bots,
  rooms,
  routines = [],
  allowTip = true,
}: {
  bots: number;
  rooms: number;
  routines?: TeamRoutine[];
  /** False when this shape sits inside a card link. A control there would nest in a link. */
  allowTip?: boolean;
}) {
  const tipId = useId();
  const shown = Math.min(Math.max(bots, 0), 4);
  const n = routines.length;
  const label = n === 1 ? "1 routine" : `${n} routines`;
  return (
    <span
      className="roster-shape"
      aria-label={`${en.home.shape(bots, rooms)}${n ? ` · ${label}` : ""}`}
    >
      <span className="roster-shape-stack">
        {Array.from({ length: shown }, (_, i) => (
          <GrokBotMark key={i} size={13} style={botMarkStyle(i)} />
        ))}
      </span>
      <span className="roster-shape-n">{bots === 1 ? "1 Bot" : `${bots} Bots`}</span>
      {rooms > 0 ? <span className="roster-shape-rooms">· {rooms === 1 ? "1 group chat" : `${rooms} group chats`}</span> : null}
      {n > 0 ? (
        allowTip ? (
          <span className="roster-shape-routines">
            <button type="button" className="roster-shape-routines-sum" aria-describedby={tipId}>
              · {label}
            </button>
            <span className="roster-shape-tip" id={tipId} role="tooltip">
              {routines.map((r) => (
                <span key={r.name} className="roster-shape-tip-row">
                  <strong>{r.name}</strong>
                  <em>{r.schedule}{r.owner ? ` · ${r.owner}` : ""}</em>
                  {r.prompt ? <span className="roster-shape-tip-prompt">{r.prompt}</span> : null}
                </span>
              ))}
            </span>
          </span>
        ) : (
          <span className="roster-shape-rooms">· {label}</span>
        )
      ) : null}
    </span>
  );
}
