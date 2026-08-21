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

export type PackStatus = "team" | "example";

/*
 * How far a connector is allowed to go.
 *
 * This is wording in the installer prompt, not an access control. Grok Bot
 * connectors are account-wide: every Bot on the account can reach every
 * connected tool, and separate Bots are not a security boundary. The only
 * real switch is Settings, then Plugins, which is also account-wide. The
 * mode is here so the recipe says what it expects, and so the UI can point
 * at the switch that actually exists.
 */
export type ConnectorMode = "read" | "draft" | "ask";

/* One "Also tell Grok Bot" chip, owned by the team file that ships it.
   `on` marks the safety chips a team turns on by default. */
export type PackSuggestion = {
  text: string;
  on?: boolean;
};

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
  /* Attribution, all optional. A team written in-house carries none of
     these; one contributed through a pull request or scouted from a post
     carries whichever the contributor supplied. */
  addedAt?: string;
  contributor?: string;
  contributorUrl?: string;
  scoutedBy?: string;
  addedVia?: string;
  url?: string;
  integrationUrls?: Record<string, string>;
  /* Customize inputs, both per team rather than global. Chips for Sales
     should not read like chips for Founder OS. */
  suggest: PackSuggestion[];
  connectorModes: Record<string, ConnectorMode>;
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
