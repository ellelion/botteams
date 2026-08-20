export type Agent = {
  name: string;
  persona: string;
  reuse?: boolean;
};

export type Room = {
  name: string;
  members: string[];
};

export type Routine = {
  name: string;
  owner: string;
  schedule: string;
  prompt: string;
};

export type Pack = {
  slug: string;
  name: string;
  tagline: string;
  seats: number;
  section: string;
  status?: "pack" | "example";
  connectors: string[];
  agents: Agent[];
  rooms: Room[];
  routines: Routine[];
  skills?: string[];
  body: string;
};
