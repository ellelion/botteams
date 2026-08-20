import { execSync } from "node:child_process";

export type DayCount = { date: string; count: number };

export function packsAddedSeries(days = 30): DayCount[] {
  const counts = new Map<string, number>();
  try {
    const out = execSync("git log --diff-filter=A --pretty=format:%cs --name-only -- packs/", {
      encoding: "utf8",
      cwd: process.cwd(),
    });
    let date = "";
    for (const line of out.split(/\r?\n/)) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(line.trim())) date = line.trim();
      else if (line.trim().endsWith(".md") && date) {
        counts.set(date, (counts.get(date) ?? 0) + 1);
      }
    }
  } catch {
    // git missing: series stays zeros. Do not invent a hockey stick.
  }
  const series: DayCount[] = [];
  const end = new Date();
  end.setUTCHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(end);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    series.push({ date: key, count: counts.get(key) ?? 0 });
  }
  return series;
}

export function addedTotal(series: DayCount[]): number {
  return series.reduce((sum, day) => sum + day.count, 0);
}

export function addedPeak(series: DayCount[]): DayCount | null {
  let peak: DayCount | null = null;
  for (const day of series) {
    if (!peak || day.count > peak.count) peak = day;
  }
  return peak && peak.count > 0 ? peak : null;
}
