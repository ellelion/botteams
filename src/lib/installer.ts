import type { Team } from "@/lib/types";
import { buildPrompt, defaultState } from "@/lib/customize";
import { site } from "@/lib/site";

/*
 * The stock prompt is the customized prompt with nothing customized.
 *
 * Keeping two generators in step by hand is how the API ends up shipping a
 * recipe the team page no longer shows, so there is only one, and this is
 * the name the rest of the app already calls it by.
 */
export function installerPrompt(team: Team): string {
  return buildPrompt(team, defaultState(team), site.url, site.github);
}
