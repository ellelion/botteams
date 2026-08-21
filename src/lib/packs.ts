import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Pack, PackAgent, PackRoom, PackRoutine, PackStatus } from "@/lib/types";
export type { Pack, PackAgent, PackRoom, PackRoutine, PackStatus } from "@/lib/types";
export { isExample, isVerified } from "@/lib/types";

const PACKS_DIR = path.join(process.cwd(), "packs");

function asStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`${field} must be an array of strings`);
  }
  return value;
}

function asAgents(value: unknown, packConnectors: string[]): PackAgent[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("agents must be a non-empty array");
  }
  const allowed = new Set(packConnectors.map((name) => name.trim()));
  return value.map((item, i) => {
    if (!item || typeof item !== "object") throw new Error(`agents[${i}] is invalid`);
    const row = item as Record<string, unknown>;
    if (typeof row.name !== "string" || typeof row.persona !== "string") {
      throw new Error(`agents[${i}] needs name and persona`);
    }
    const connectors = row.connectors === undefined ? [] : asStringArray(row.connectors, `agents[${i}].connectors`);
    for (const name of connectors) {
      if (!allowed.has(name)) {
        throw new Error(`agents[${i}] connector "${name}" is not in pack connectors`);
      }
    }
    const agent: PackAgent = { name: row.name, persona: row.persona, connectors };
    if (row.reuse === true) agent.reuse = true;
    if (typeof row.icon === "string" && row.icon.trim()) agent.icon = row.icon.trim();
    return agent;
  });
}

function asRooms(value: unknown): PackRoom[] {
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

function asRoutines(value: unknown): PackRoutine[] {
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

export function parsePack(raw: string, filename: string): Pack {
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
  // "pack" is the pre-rename spelling of "team". Still parsed so an older
  // team file (or a fork) keeps working; everything downstream sees "team".
  const rawStatus = data.status === "pack" ? "team" : data.status;
  if (rawStatus !== "team" && rawStatus !== "example") {
    throw new Error(`${filename}: status must be team or example`);
  }
  const status: PackStatus = rawStatus;
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
  };
}

export function listPacks(): Pack[] {
  const files = fs
    .readdirSync(PACKS_DIR)
    .filter((file) => file.endsWith(".md"))
    .sort();
  return files.map((file) => parsePack(fs.readFileSync(path.join(PACKS_DIR, file), "utf8"), file));
}

export function getPack(slug: string): Pack | null {
  return listPacks().find((pack) => pack.slug === slug) ?? null;
}

