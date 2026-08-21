import { installerPrompt } from "@/lib/installer";
import { listBots, listTeams } from "@/lib/teams";
import { site } from "@/lib/site";
import { resolveConnector } from "@/lib/connectors";
import type { Team } from "@/lib/types";

export const API_VERSION = 1;
export const DEFAULT_LIMIT = 25;
export const MAX_LIMIT = 100;

export type ApiTeam = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  kind: string;
  status: string;
  fromXai: boolean;
  bots: number;
  addedAt: string | null;
  connectors: string[];
  agents: { name: string; persona: string; connectors: string[] }[];
  rooms: { name: string; members: string[] }[];
  routines: { name: string; owner: string; schedule: string; prompt: string }[];
  installer: string;
  contributor: string | null;
  contributorUrl: string | null;
  scoutedBy: string | null;
  sourceUrl: string | null;
  url: string | null;
  detailUrl: string;
};

/*
 * addedAt comes from the team file and nowhere else.
 *
 * It used to fall back to `git log --diff-filter=A`, which stopped being
 * true the day the folder was renamed: git reports every file as added in
 * the rename commit. A date we cannot stand behind is worse than no date,
 * so a file without added_at reports null and sorts last.
 */

export function toApiTeam(team: Team): ApiTeam {
  return {
    slug: team.slug,
    name: team.name,
    tagline: team.tagline,
    category: team.section,
    kind: team.kind,
    status: team.status,
    fromXai: team.fromXai === true,
    bots: team.bots,
    addedAt: team.addedAt ?? null,
    connectors: team.connectors,
    agents: team.agents.map((a) => ({ name: a.name, persona: a.persona, connectors: a.connectors })),
    rooms: team.rooms.map((r) => ({ name: r.name, members: r.members })),
    routines: team.routines.map((r) => ({ name: r.name, owner: r.owner, schedule: r.schedule, prompt: r.prompt })),
    installer: installerPrompt(team),
    contributor: team.contributor ?? null,
    contributorUrl: team.contributorUrl ?? null,
    scoutedBy: team.scoutedBy ?? null,
    sourceUrl: team.addedVia ?? null,
    url: team.url ?? null,
    detailUrl: `${site.url}/teams/${team.slug}`,
  };
}

/* Two collections, never mixed. /api/teams returning a one-Bot recipe
   would be the same lie the site just stopped telling. */
export function allApiTeams(): ApiTeam[] {
  return listTeams().map(toApiTeam);
}

export function allApiBots(): ApiTeam[] {
  return listBots().map(toApiTeam);
}

export type Filters = { q: string | null; category: string | null; integration: string | null; sort: string };

export function applyFilters(teams: ApiTeam[], f: Filters): ApiTeam[] {
  let out = teams;
  if (f.category) {
    const want = f.category.toLowerCase();
    out = out.filter((t) => t.category.toLowerCase() === want);
  }
  if (f.integration) {
    // Resolve BOTH sides to a catalog slug before comparing. Teams write
    // "Calendar"; a client will ask for "Google Calendar". Comparing the
    // normalised strings misses that, comparing resolved slugs does not.
    const want = resolveConnector(f.integration).slug;
    out = out.filter((t) => t.connectors.some((c) => resolveConnector(c).slug === want));
  }
  if (f.q) {
    const q = f.q.toLowerCase();
    out = out.filter((t) =>
      [t.name, t.tagline, t.category, t.slug, t.contributor ?? "", ...t.connectors, ...t.agents.map((a) => a.name), t.installer]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }
  return sortTeams(out, f.sort);
}

export function sortTeams(teams: ApiTeam[], sort: string): ApiTeam[] {
  const copy = [...teams];
  if (sort === "name") return copy.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "oldest") {
    return copy.sort((a, b) => String(a.addedAt ?? "").localeCompare(String(b.addedAt ?? "")) || a.slug.localeCompare(b.slug));
  }
  // newest: undated teams sort last rather than pretending to be new.
  return copy.sort((a, b) => String(b.addedAt ?? "").localeCompare(String(a.addedAt ?? "")) || a.slug.localeCompare(b.slug));
}

export function normalizeSort(value: string | null, cursorMode: boolean): string {
  if (cursorMode) return "oldest";
  return value === "name" || value === "newest" ? value : "newest";
}

export function clampLimit(value: string | null): number {
  const n = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(n) || n < 1) return DEFAULT_LIMIT;
  return Math.min(n, MAX_LIMIT);
}

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

export function jsonResponse(body: unknown, cacheSeconds = 60, status = 200): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": `public, max-age=0, s-maxage=${cacheSeconds}, stale-while-revalidate=300`,
      ...CORS_HEADERS,
    },
  });
}
