import { execSync } from "node:child_process";
import { installerPrompt } from "@/lib/installer";
import { listPacks } from "@/lib/packs";
import { site } from "@/lib/site";
import { resolveConnector } from "@/lib/connectors";
import type { Pack } from "@/lib/types";

export const API_VERSION = 1;
export const DEFAULT_LIMIT = 25;
export const MAX_LIMIT = 100;

export type ApiTeam = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  status: string;
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
 * A team file carries added_at only when a contributor supplied one, so the
 * rest fall back to the commit that first added the file. That keeps
 * sort=newest and the cursor honest without stamping invented dates into
 * the markdown. Read once per process; the catalog is static per deploy.
 */
let addedCache: Map<string, string> | null = null;

function addedDates(): Map<string, string> {
  if (addedCache) return addedCache;
  const map = new Map<string, string>();
  try {
    const out = execSync("git log --diff-filter=A --pretty=format:%cI --name-only -- packs/", {
      encoding: "utf8",
      cwd: process.cwd(),
    });
    let stamp = "";
    for (const line of out.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (/^\d{4}-\d{2}-\d{2}T/.test(trimmed)) stamp = trimmed;
      else if (trimmed.endsWith(".md") && stamp) {
        const slug = trimmed.replace(/^packs\//, "").replace(/\.md$/, "");
        // git log walks newest first, so the last write per slug is the add.
        map.set(slug, new Date(stamp).toISOString());
      }
    }
  } catch {
    // No git (a tarball deploy). addedAt stays null rather than invented.
  }
  addedCache = map;
  return map;
}

export function toApiTeam(pack: Pack): ApiTeam {
  return {
    slug: pack.slug,
    name: pack.name,
    tagline: pack.tagline,
    category: pack.section,
    status: pack.status,
    bots: pack.bots,
    addedAt: pack.addedAt ?? addedDates().get(pack.slug) ?? null,
    connectors: pack.connectors,
    agents: pack.agents.map((a) => ({ name: a.name, persona: a.persona, connectors: a.connectors })),
    rooms: pack.rooms.map((r) => ({ name: r.name, members: r.members })),
    routines: pack.routines.map((r) => ({ name: r.name, owner: r.owner, schedule: r.schedule, prompt: r.prompt })),
    installer: installerPrompt(pack),
    contributor: pack.contributor ?? null,
    contributorUrl: pack.contributorUrl ?? null,
    scoutedBy: pack.scoutedBy ?? null,
    sourceUrl: pack.addedVia ?? null,
    url: pack.url ?? null,
    detailUrl: `${site.url}/teams/${pack.slug}`,
  };
}

export function allApiTeams(): ApiTeam[] {
  return listPacks().map(toApiTeam);
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

export function jsonResponse(body: unknown, cacheSeconds = 60): Response {
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": `public, max-age=0, s-maxage=${cacheSeconds}, stale-while-revalidate=300`,
      ...CORS_HEADERS,
    },
  });
}
