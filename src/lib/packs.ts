import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type PackAgent = {
  name: string;
  persona: string;
  reuse?: boolean;
};

export type PackRoom = {
  name: string;
  members: string[];
};

export type PackRoutine = {
  name: string;
  owner: string;
  schedule: string;
  prompt: string;
};

export type PackStatus = "pack" | "example";

export type Pack = {
  slug: string;
  name: string;
  tagline: string;
  seats: number;
  section: string;
  status: PackStatus;
  connectors: string[];
  agents: PackAgent[];
  rooms: PackRoom[];
  routines: PackRoutine[];
  skills: string[];
  body: string;
};

const PACKS_DIR = path.join(process.cwd(), "packs");

function asStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`${field} must be an array of strings`);
  }
  return value;
}

function asAgents(value: unknown): PackAgent[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("agents must be a non-empty array");
  }
  return value.map((item, i) => {
    if (!item || typeof item !== "object") throw new Error(`agents[${i}] is invalid`);
    const row = item as Record<string, unknown>;
    if (typeof row.name !== "string" || typeof row.persona !== "string") {
      throw new Error(`agents[${i}] needs name and persona`);
    }
    const agent: PackAgent = { name: row.name, persona: row.persona };
    if (row.reuse === true) agent.reuse = true;
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
    if (members.length > 6) throw new Error(`rooms[${i}] exceeds the 6-seat cap`);
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
  if (typeof data.seats !== "number") throw new Error(`${filename}: missing seats`);
  if (typeof data.section !== "string") throw new Error(`${filename}: missing section`);
  if (data.status !== "pack" && data.status !== "example") {
    throw new Error(`${filename}: status must be pack or example`);
  }
  return {
    slug: data.slug,
    name: data.name,
    tagline: data.tagline,
    seats: data.seats,
    section: data.section,
    status: data.status,
    connectors: asStringArray(data.connectors, "connectors"),
    agents: asAgents(data.agents),
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

export function isExample(pack: Pack): boolean {
  return pack.status === "example";
}
