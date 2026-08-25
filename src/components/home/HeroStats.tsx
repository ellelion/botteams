import Link from "next/link";
import { en } from "@/lib/messages/en";

export function HeroStats({
  teams,
  bots,
  verifiedOn,
}: {
  teams: number;
  bots: number;
  verifiedOn: string;
}) {
  return (
    <div className="hero-stats" aria-label={en.home.statsAria(teams, bots, verifiedOn)}>
      <Link className="hero-stat" href="/?kind=team">
        <strong>{teams}</strong>
        <span>{en.home.statsTeams}</span>
      </Link>
      <Link className="hero-stat" href="/?kind=bot">
        <strong>{bots}</strong>
        <span>{en.home.statsBots}</span>
      </Link>
      <Link className="hero-stat" href="/docs#published-limits">
        <strong>
          <time dateTime={verifiedOn}>{verifiedOn}</time>
        </strong>
        <span>{en.home.limitsChecked}</span>
      </Link>
    </div>
  );
}
