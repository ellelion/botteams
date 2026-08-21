import { listTeams } from "@/lib/teams";

export type DayCount = { date: string; count: number };

/*
 * When each team arrived, taken from the team file.
 *
 * This used to read the git log for the team folder, which broke the day
 * that folder was renamed: git saw 130 files added at once and the
 * sparkline drew a spike that never happened. The date in the front matter
 * is the claim we actually stand behind, so read that. A file without one
 * simply does not appear in the series rather than being given a date.
 */
export function teamsAddedSeries(days = 30): DayCount[] {
  const counts = new Map<string, number>();
  for (const team of listTeams()) {
    if (!team.addedAt) continue;
    const day = team.addedAt.slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) continue;
    counts.set(day, (counts.get(day) ?? 0) + 1);
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
