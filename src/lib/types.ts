export type PackAgent = {
  name: string;
  persona: string;
  reuse?: boolean;
  icon?: string;
  connectors: string[];
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
  bots: number;
  section: string;
  status: PackStatus;
  connectors: string[];
  agents: PackAgent[];
  rooms: PackRoom[];
  routines: PackRoutine[];
  skills: string[];
  body: string;
};

export function isExample(pack: Pack): boolean {
  return pack.status === "example";
}

export function isVerified(pack: Pack): boolean {
  if (pack.agents.length === 0) return false;
  if (pack.rooms.some((room) => room.members.length < 2 || room.members.length > 6)) return false;
  if (pack.agents.length + pack.rooms.length > 50) return false;
  if (pack.bots !== pack.agents.length) return false;
  return true;
}
