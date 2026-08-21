import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ConnectorMode, Team, TeamAgent, TeamRoom, TeamRoutine, TeamStatus, TeamSuggestion } from "@/lib/types";
export type { ConnectorMode, Team, TeamAgent, TeamRoom, TeamRoutine, TeamStatus, TeamSuggestion } from "@/lib/types";
export { isExample, isVerified } from "@/lib/types";

const TEAMS_DIR = path.join(process.cwd(), "teams");

function asStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`${field} must be an array of strings`);
  }
  return value;
}

function asAgents(value: unknown, teamConnectors: string[]): TeamAgent[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("agents must be a non-empty array");
  }
  const allowed = new Set(teamConnectors.map((name) => name.trim()));
  return value.map((item, i) => {
    if (!item || typeof item !== "object") throw new Error(`agents[${i}] is invalid`);
    const row = item as Record<string, unknown>;
    if (typeof row.name !== "string" || typeof row.persona !== "string") {
      throw new Error(`agents[${i}] needs name and persona`);
    }
    const connectors = row.connectors === undefined ? [] : asStringArray(row.connectors, `agents[${i}].connectors`);
    for (const name of connectors) {
      if (!allowed.has(name)) {
        throw new Error(`agents[${i}] connector "${name}" is not in team connectors`);
      }
    }
    const agent: TeamAgent = { name: row.name, persona: row.persona, connectors };
    if (row.reuse === true) agent.reuse = true;
    if (typeof row.icon === "string" && row.icon.trim()) agent.icon = row.icon.trim();
    return agent;
  });
}

function asRooms(value: unknown): TeamRoom[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("rooms must be a non-empty array");
  }
  return value.map((item, i) => {
    if (!item || typeof item !== "object") throw new Error(`rooms[${i}] is invalid`);
    const row = item as Record<string, unknown>;
    if (typeof row.name !== "string") throw new Error(`rooms[${i}] needs name`);
    const members = asStringArray(row.members, `rooms[${i}].members`);
    if (members.length === 0) throw new Error(`rooms[${i}].members is empty`);
    if (members.length < 2 || members.length > 6) {
      throw new Error(`rooms[${i}] must have two to six Bots`);
    }
    return { name: row.name, members };
  });
}

function asRoutines(value: unknown): TeamRoutine[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("routines must be a non-empty array");
  }
  return value.map((item, i) => {
    if (!item || typeof item !== "object") throw new Error(`routines[${i}] is invalid`);
    const row = item as Record<string, unknown>;
    if (
      typeof row.name !== "string" ||
      typeof row.owner !== "string" ||
      typeof row.schedule !== "string" ||
      typeof row.prompt !== "string"
    ) {
      throw new Error(`routines[${i}] needs name, owner, schedule, prompt`);
    }
    return {
      name: row.name,
      owner: row.owner,
      schedule: row.schedule,
      prompt: row.prompt,
    };
  });
}

/* Chips a team offers under "Also tell Grok Bot". A bare string is a chip
   that starts off; an object may mark it on by default, which is how a team
   ships its own safety lines ("never send mail"). */
function asSuggestions(value: unknown): TeamSuggestion[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) throw new Error("suggest must be an array");
  return value.map((item, i) => {
    if (typeof item === "string") return { text: item };
    if (!item || typeof item !== "object") throw new Error(`suggest[${i}] is invalid`);
    const row = item as Record<string, unknown>;
    if (typeof row.text !== "string" || !row.text.trim()) throw new Error(`suggest[${i}] needs text`);
    return row.on === true ? { text: row.text.trim(), on: true } : { text: row.text.trim() };
  });
}

function asConnectorModes(value: unknown, connectors: string[]): Record<string, ConnectorMode> {
  if (value === undefined) return {};
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("connector_modes must be a map of connector to mode");
  }
  const allowed = new Set(connectors.map((name) => name.trim()));
  const out: Record<string, ConnectorMode> = {};
  for (const [name, mode] of Object.entries(value as Record<string, unknown>)) {
    if (!allowed.has(name)) throw new Error(`connector_modes names "${name}", which the team does not list`);
    if (mode !== "read" && mode !== "draft" && mode !== "ask") {
      throw new Error(`connector_modes["${name}"] must be read, draft, or ask`);
    }
    out[name] = mode;
  }
  return out;
}

export function parseTeam(raw: string, filename: string): Team {
  const { data, content } = matter(raw);
  const slug = path.basename(filename, ".md");
  if (typeof data.slug !== "string" || data.slug !== slug) {
    throw new Error(`${filename}: slug must match filename`);
  }
  if (typeof data.name !== "string") throw new Error(`${filename}: missing name`);
  if (typeof data.tagline !== "string") throw new Error(`${filename}: missing tagline`);
  const bots = typeof data.bots === "number" ? data.bots : data.seats;
  if (typeof bots !== "number") throw new Error(`${filename}: missing bots`);
  if (typeof data.section !== "string") throw new Error(`${filename}: missing section`);
  const rawStatus = data.status;
  if (rawStatus !== "team" && rawStatus !== "example") {
    throw new Error(`${filename}: status must be team or example`);
  }
  const status: TeamStatus = rawStatus;
  const connectors = asStringArray(data.connectors, "connectors");
  const agents = asAgents(data.agents, connectors);
  const union = new Set<string>();
  for (const agent of agents) for (const name of agent.connectors) union.add(name);
  const merged = connectors.slice();
  for (const name of union) if (!merged.includes(name)) merged.push(name);
  return {
    slug: data.slug,
    name: data.name,
    tagline: data.tagline,
    bots,
    section: data.section,
    status,
    connectors: merged,
    agents,
    rooms: asRooms(data.rooms),
    routines: asRoutines(data.routines),
    skills: data.skills === undefined ? [] : asStringArray(data.skills, "skills"),
    body: content.trim(),
    addedAt: typeof data.added_at === "string" ? data.added_at : undefined,
    contributor: typeof data.contributor === "string" ? data.contributor : undefined,
    // A bare handle implies a GitHub profile; an explicit URL wins.
    contributorUrl:
      typeof data.contributor_url === "string"
        ? data.contributor_url
        : typeof data.contributor === "string"
          ? `https://github.com/${String(data.contributor).replace(/^@/, "")}`
          : undefined,
    scoutedBy: typeof data.scouted_by === "string" ? data.scouted_by : undefined,
    addedVia: typeof data.added_via === "string" ? data.added_via : undefined,
    url: typeof data.url === "string" ? data.url : undefined,
    integrationUrls:
      data.integration_urls && typeof data.integration_urls === "object"
        ? (data.integration_urls as Record<string, string>)
        : undefined,
    suggest: asSuggestions(data.suggest),
    connectorModes: asConnectorModes(data.connector_modes, merged),
  };
}

export function listTeams(): Team[] {
  const files = fs
    .readdirSync(TEAMS_DIR)
    .filter((file) => file.endsWith(".md"))
    .sort();
  return files.map((file) => parseTeam(fs.readFileSync(path.join(TEAMS_DIR, file), "utf8"), file));
}

export function getTeam(slug: string): Team | null {
  return listTeams().find((team) => team.slug === slug) ?? null;
}

