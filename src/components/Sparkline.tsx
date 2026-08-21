/*
 * Thirty-day "teams added" tick chart, read straight from git history.
 *
 * Bars, not a polyline. The real series is mostly zeros with one or two
 * spikes (a batch of team files lands in a single commit), and a line
 * through that draws one long diagonal that reads as a stray rule, not
 * as data. Bars keep a single busy day honest: one tick, and the rest
 * of the month visibly empty.
 */
export function Sparkline({ series, className = "" }: { series: { date: string; count: number }[]; className?: string }) {
  const w = 132;
  const h = 28;
  const max = Math.max(...series.map((d) => d.count), 1);
  const n = Math.max(series.length, 1);
  const slot = w / n;
  const bar = Math.max(slot - 1.4, 1);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className={className} aria-hidden>
      {/* Baseline: without it, an empty month renders as nothing at all. */}
      <line x1="0" y1={h - 0.5} x2={w} y2={h - 0.5} stroke="currentColor" strokeWidth="1" opacity="0.28" />
      {series.map((d, i) => {
        if (d.count <= 0) return null;
        const height = Math.max((d.count / max) * (h - 3), 2);
        return (
          <rect
            key={d.date}
            x={(i * slot).toFixed(2)}
            y={(h - 1 - height).toFixed(2)}
            width={bar.toFixed(2)}
            height={height.toFixed(2)}
            fill="currentColor"
          />
        );
      })}
    </svg>
  );
}
