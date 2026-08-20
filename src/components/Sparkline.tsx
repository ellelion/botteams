export function Sparkline({ series, className = "" }: { series: { date: string; count: number }[]; className?: string }) {
  const w = 132;
  const h = 28;
  const max = Math.max(...series.map((d) => d.count), 1);
  const n = Math.max(series.length - 1, 1);
  const points = series
    .map((d, i) => {
      const x = (i / n) * w;
      const y = h - 2 - (d.count / max) * (h - 4);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className={className} aria-hidden>
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
