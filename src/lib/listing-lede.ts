import type { Team } from "@/lib/types";

/*
 * Card lede. Teams ship a real bullets list, one line per Bot.
 * A solo Bot with no bullets field uses the tagline as a single item.
 */
export function listingBullets(team: Pick<Team, "kind" | "tagline" | "bullets">): string[] {
  if (team.bullets.length > 0) return team.bullets;
  const line = team.tagline.trim();
  return line ? [line] : [];
}
