import { authorHref, type SkillselionHit } from "@/lib/skillselion";
import { en } from "@/lib/messages/en";

function fmtCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export function SkillHitFace({
  hit,
  live,
  extra,
}: {
  hit: SkillselionHit;
  live?: SkillselionHit;
  extra?: string;
}) {
  const face = live ?? hit;
  const waiting = !live && face.installs === 0 && face.stars === 0;
  const who = authorHref(face);
  return (
    <span className="cz-skill-face">
      {face.avatarUrl ? (
        // Official GitHub identicon/avatar. Not a vendor logo we invented.
        // eslint-disable-next-line @next/next/no-img-element
        <img className="cz-skill-avatar" src={face.avatarUrl} alt="" width={32} height={32} />
      ) : null}
      <span className="cz-field-grow">
        <span className="cz-conn-name">
          {face.name}
          {face.author ? (
            <span className="cz-hint">
              {" "}
              by{" "}
              <a className="cz-link" href={who} target="_blank" rel="noreferrer">
                {face.author}
              </a>
            </span>
          ) : null}
        </span>
        {face.summary ? <p className="cz-bot-persona">{face.summary}</p> : null}
        <p className="cz-hint">
          {waiting ? "…" : en.customize.skillsMeta(fmtCount(face.installs), fmtCount(face.stars))}
          {extra ? ` · ${extra}` : null}
          {" · "}
          <a className="cz-link" href={face.url} target="_blank" rel="noreferrer">
            {en.customize.skillsView}
          </a>
        </p>
      </span>
    </span>
  );
}
