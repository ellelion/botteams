"use client";

import { useEffect, useState } from "react";

function useCountUp(to: number, ms = 900) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(to);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      const e = 1 - (1 - p) ** 3;
      setN(Math.round(to * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, ms]);
  return n;
}

export function HeroStats({
  teams,
  bots,
  verifiedOn,
}: {
  teams: number;
  bots: number;
  verifiedOn: string;
}) {
  const teamN = useCountUp(teams, 860);
  const botN = useCountUp(bots, 980);
  return (
    <div className="hero-stats" aria-label={`${teams} teams, ${bots} bots, verified ${verifiedOn}`}>
      <a className="hero-stat" href="/?kind=team">
        <strong>{teamN}</strong>
        <span>Teams</span>
      </a>
      <a className="hero-stat" href="/?kind=bot">
        <strong>{botN}</strong>
        <span>Bots</span>
      </a>
      <p className="hero-stat">
        <strong>
          <time dateTime={verifiedOn}>{verifiedOn}</time>
        </strong>
        <span>Verified</span>
      </p>
    </div>
  );
}
