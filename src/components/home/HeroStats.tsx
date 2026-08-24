import Link from "next/link";

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
    <div className="hero-stats" aria-label={`${teams} teams, ${bots} Bots, verified ${verifiedOn}`}>
      <Link className="hero-stat" href="/?kind=team">
        <strong>{teams}</strong>
        <span>Teams</span>
      </Link>
      <Link className="hero-stat" href="/?kind=bot">
        <strong>{bots}</strong>
        <span>Bots</span>
      </Link>
      <p className="hero-stat">
        <strong>
          <time dateTime={verifiedOn}>{verifiedOn}</time>
        </strong>
        <span>Verified</span>
      </p>
    </div>
  );
}
