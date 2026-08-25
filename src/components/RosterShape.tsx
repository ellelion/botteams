import { useId } from "react";
import { GrokBotMark } from "@/components/icons/GrokBotMark";
import { botMarkStyle } from "@/lib/bot-icon";
import { en } from "@/lib/messages/en";
import type { TeamRoutine } from "@/lib/types";

function rosterMarkStyle(index: number): Record<string, string> {
  const x = [-2, 1, 2, -1, 0, 2][index % 6];
  const tilt = [-7, 5, 8, -5, 3, -8][index % 6];
  const height = [7, 5, 8, 6, 7, 5][index % 6];
  return {
    ...botMarkStyle(index),
    "--roster-hop-x": `${x}px`,
    "--roster-hop-x-back": `${x * -0.5}px`,
    "--roster-hop-y": `-${height}px`,
    "--roster-hop-y-small": `-${Math.max(2, height - 4)}px`,
    "--roster-hop-tilt": `${tilt}deg`,
    "--roster-hop-tilt-back": `${tilt * -0.45}deg`,
    "--roster-hop-delay": `-${90 + ((index * 113) % 620)}ms`,
    "--roster-hop-duration": `${570 + ((index * 83) % 230)}ms`,
    "--roster-z": String(12 - index),
  };
}

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
  const botCount = Number.isFinite(bots) ? Math.max(0, Math.trunc(bots)) : 0;
  const n = routines.length;
  const label = n === 1 ? "1 routine" : `${n} routines`;
  return (
    <span
      className="roster-shape"
      aria-label={`${en.home.shape(botCount, rooms)}${n ? ` · ${label}` : ""}`}
    >
      <span className="roster-shape-stack">
        {Array.from({ length: botCount }, (_, i) => (
          <GrokBotMark key={i} size={13} frontFacing style={rosterMarkStyle(i)} />
        ))}
      </span>
      <span className="roster-shape-n">{botCount === 1 ? "1 Bot" : `${botCount} Bots`}</span>
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
