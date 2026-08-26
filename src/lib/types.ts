export type TeamBot = {
  name: string;
  persona: string;
  /** One line for the group-chat roster. Falls back to the first sentence of persona. */
  brings?: string;
  reuse?: boolean;
  icon?: string;
  connectors: string[];
  skills?: string[];
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

/*
 * Two shapes, and they are not the same product.
 *
 *   bot   one named Bot doing one job. No group chat, so nothing to
 *         verify: Verified is a claim about a group chat.
 *   team  two to six Bots in one group chat.
 *
 * `status: team` used to mean "this is real, not a demo", which put the
 * word team on 56 files that have no group chat. Kind says what it is,
 * status says whether it is a recipe or a format demo, and neither has to
 * do the other's job.
 */

export type ConversationTurn = {
  speaker: string;
  /* Bot name as in the recipe, used to highlight the rail. */
  speakerKey?: string;
  role?: "user" | "bot";
  text: string;
  checks?: string[];
  working?: { label: string; detail: string; state?: "work" | "done"; screen?: string };
  fromBots?: { keys: string[]; text: string };
};

export type TeamKind = "bot" | "team";
export type TeamStatus = "installable" | "example";

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
  kind: TeamKind;
  name: string;
  tagline: string;
  bots: number;
  section: string;
  status: TeamStatus;
  connectors: string[];
  botRoster: TeamBot[];
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
  /* True when the recipe is our write-up of a job xAI publishes in its own
     Grok Bot use-case gallery. Sourcing, never endorsement: xAI does not
     review, certify, or endorse anything on this shelf. */
  fromXai?: boolean;
  /* One team can sit first on the index. Not a pack. */
  featured?: boolean;
  /* Optional staged group chat. Omit it and the page has no Watch
     control. First-party recipes get a generated script at load if this
     is empty. Contributor files stay quiet unless they author turns. */
  conversation?: ConversationTurn[];
  conversationByBot?: Record<string, ConversationTurn[]>;
};

export function isExample(team: Team): boolean {
  return team.status === "example";
}

export function isBot(team: Team): boolean {
  return team.kind === "bot";
}

/*
 * Verified is one claim and only one: this recipe fits the limits Grok Bot
 * publishes. At least one Bot, at least one group chat holding two to six
 * of them, the Bot count matching the roster, and the whole thing under
 * the account cap of 50 Bots and group chats combined.
 *
 * `rooms.some(...)` used to carry the group-chat check, which is vacuously
 * true for an empty list. A one-Bot recipe with no group chat therefore
 * passed, and the shelf stamped Verified on something that makes no claim
 * about group chats at all. It now needs a real one, and it needs to be a
 * team in the first place.
 *
 * xAI also documents a per-Bot cap of 50 routines. That is enforced in the
 * validate script, not here: it is a property of one Bot, not of the
 * roster this function is looking at.
 */
export const MAX_ROUTINES_PER_BOT = 50;
export const MIN_ROOM = 2;
export const MAX_ROOM = 6;
export const ACCOUNT_CAP = 50;

export function isVerified(team: Team): boolean {
  /* Only a team can be Verified. A Bot is one Bot with no group chat,
     so the claim has nothing to be true about. */
  if (team.kind !== "team") return false;
  if (team.botRoster.length === 0) return false;
  if (team.bots !== team.botRoster.length) return false;
  if (team.botRoster.length + team.rooms.length > ACCOUNT_CAP) return false;
  if (team.rooms.length === 0) return false;
  return team.rooms.every((room) => room.members.length >= MIN_ROOM && room.members.length <= MAX_ROOM);
}
