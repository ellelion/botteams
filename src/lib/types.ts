export type TeamAgent = {
  name: string;
  persona: string;
  reuse?: boolean;
  icon?: string;
  connectors: string[];
};

export type TeamRoom = {
  name: string;
  members: string[];
};

export type TeamRoutine = {
  name: string;
  owner: string;
  schedule: string;
  prompt: string;
};

export type TeamStatus = "team" | "example";

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
export type TeamSuggestion = {
  text: string;
  on?: boolean;
};

export type Team = {
  slug: string;
  name: string;
  tagline: string;
  bots: number;
  section: string;
  status: TeamStatus;
  connectors: string[];
  agents: TeamAgent[];
  rooms: TeamRoom[];
  routines: TeamRoutine[];
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
  suggest: TeamSuggestion[];
  connectorModes: Record<string, ConnectorMode>;
};

export function isExample(team: Team): boolean {
  return team.status === "example";
}

export function isVerified(team: Team): boolean {
  if (team.agents.length === 0) return false;
  if (team.rooms.some((room) => room.members.length < 2 || room.members.length > 6)) return false;
  if (team.agents.length + team.rooms.length > 50) return false;
  if (team.bots !== team.agents.length) return false;
  return true;
}
