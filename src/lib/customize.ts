import type { ConnectorMode, Team, TeamBot, TeamRoutine } from "@/lib/types";
import { resolveConnector } from "@/lib/connectors";
import { connectorFamily, type ConnectorFamily } from "@/lib/connector-families";
import { seedSkillPicks } from "@/lib/skill-defaults";
import { createBotName, grokBotName, grokRoomName, grokTeamName } from "@/lib/grok-names";
import { normalizeSkillPick, type SkillPick } from "@/lib/skillselion";

/*
 * Customize edits the installer RECIPE.
 *
 * Nothing here is enforcement. Grok Bot connectors are account-wide: every
 * Bot on the account can reach every connected tool, and separate Bots are
 * not a security boundary. The one real switch is Settings, then Plugins,
 * which is also account-wide. So a mode changes what the prompt SAYS, and
 * the UI points at the switch that actually exists rather than drawing a
 * padlock the product does not have.
 *
 * Copy and paste is still how a team installs.
 */

/* Shared-link payload. Watch uses the same prefix so it does not
   replace `#c=…` with `#watch` and throw away the recipe. */
export const CUSTOMIZE_HASH_KEY = "c=";

export const MODES: ConnectorMode[] = ["read", "draft", "ask"];

export const MODE_LABEL: Record<ConnectorMode, string> = {
  read: "Read",
  draft: "Draft",
  ask: "Ask before send",
};

export const MODE_HINT: Record<ConnectorMode, string> = {
  read: "Look, summarise, never change anything.",
  draft: "Write it, leave it unsent for a human.",
  ask: "Say what it will do, wait for a yes.",
};

const FAMILY_MODE: Record<ConnectorFamily, Record<ConnectorMode, (name: string) => string>> = {
  mail: {
    read: (n) => `Use ${n} read-only. Read and summarise mail. Do not draft, send, or delete anything in ${n}.`,
    draft: (n) => `Use ${n} for drafts only. Draft the message, do not send.`,
    ask: (n) => `Use ${n} only after a human says yes in the chat. State the mail you are about to send, wait for the reply, then act.`,
  },
  git: {
    read: (n) => `Use ${n} read-only. Read and summarise it. Do not open a PR, create a branch, or merge.`,
    draft: (n) => `Use ${n} for drafts only. Draft the PR or branch, never merge.`,
    ask: (n) => `Use ${n} only after a human says yes in the chat. State the PR or branch, wait for the reply, then act. Never merge.`,
  },
  docs: {
    read: (n) => `Use ${n} read-only. Read and summarise it. Do not create, edit, or publish anything in ${n}.`,
    draft: (n) => `Use ${n} for drafts only. Write the page, never publish.`,
    ask: (n) => `Use ${n} only after a human says yes in the chat. State the page you will write, wait for the reply, then act. Never publish.`,
  },
  calendar: {
    read: (n) => `Use ${n} read-only. Read and summarise events. Do not create events or send invites.`,
    draft: (n) => `Use ${n} for drafts only. Draft the event, do not send invites.`,
    ask: (n) => `Use ${n} only after a human says yes in the chat. State the event, wait for the reply, then act. Do not send invites until then.`,
  },
  chat: {
    read: (n) => `Use ${n} read-only. Read and summarise it. Do not post, send, or reply in ${n}.`,
    draft: (n) => `Use ${n} for drafts only. Write the post, do not publish it.`,
    ask: (n) => `Use ${n} only after a human says yes in the chat. Say the post, wait for a yes.`,
  },
  money: {
    read: (n) => `Use ${n} read-only. Never move funds.`,
    draft: (n) => `Use ${n} for drafts only. Never move funds.`,
    ask: (n) => `Use ${n} only after a human says yes in the chat. Never move funds.`,
  },
  search: {
    read: (n) => `Use ${n} read-only.`,
    draft: (n) => `Use ${n} read-only.`,
    ask: (n) => `Use ${n} read-only.`,
  },
  hosting: {
    read: (n) => `Use ${n} read-only. Do not deploy to production.`,
    draft: (n) => `Use ${n} for drafts only. Do not deploy to production.`,
    ask: (n) => `Use ${n} only after a human says yes in the chat. Do not deploy to production.`,
  },
};

export function modeRule(connector: string, mode: ConnectorMode): string {
  const mark = resolveConnector(connector);
  const family = connectorFamily(mark.slug);
  return FAMILY_MODE[family][mode](mark.name);
}

export function defaultMode(connector: string): ConnectorMode {
  const family = connectorFamily(connector);
  if (family === "money" || family === "search") return "read";
  if (family === "chat") return "ask";
  return "draft";
}

/** The mode a team ships, falling back to the shape of the connector. */
export function teamMode(team: Team, connector: string): ConnectorMode {
  return team.connectorModes[connector] ?? defaultMode(connector);
}

export type CustomState = {
  /* Keyed by the Bot's name in the team file, which never changes. A rename
     lives in `names`, so turning a Bot off and on does not lose it. */
  off: string[];
  names: Record<string, string>;
  roomName: string;
  members: string[];
  modes: Record<string, ConnectorMode>;
  /* Extra wording per Bot, e.g. "only the Stripe watcher touches Stripe".
     Wording only: it cannot stop another Bot reaching the connector. */
  notes: Record<string, string>;
  chips: string[];
  free: string;
  /* Set once the human edits the full prompt by hand. Regenerating throws
     it away, so every path that regenerates has to warn first. */
  override: string | null;
  /* "I already installed the stock team": the paste becomes a diff. */
  installed: boolean;
  /* Skillselion skills on this recipe. Per-team; the prompt lists them for every live Bot. */
  skillPicks: SkillPick[];
};

/* A one-Bot recipe has no group chat to edit, and inventing one so the
   editor has something to show would put a step in the paste that the
   recipe never asked for. */
export function isSolo(team: Team): boolean {
  return team.kind === "bot";
}

export function defaultState(team: Team): CustomState {
  const room = team.rooms[0];
  const modes: Record<string, ConnectorMode> = {};
  for (const connector of team.connectors) modes[connector] = teamMode(team, connector);
  return {
    off: [],
    names: {},
    roomName: room ? grokRoomName(room.name) : "",
    members: room ? [...room.members] : [],
    modes,
    notes: {},
    chips: team.suggest.filter((s) => s.on).map((s) => s.text),
    free: "",
    override: null,
    installed: false,
    skillPicks: seedSkillPicks(team),
  };
}

export function isOn(state: CustomState, name: string): boolean {
  return !state.off.includes(name);
}

/** The name a Bot ends up with, trimmed. Blank means the human cleared it. */
export function finalName(state: CustomState, name: string): string {
  const renamed = state.names[name];
  return (renamed === undefined ? name : renamed).trim();
}

export function activeBots(team: Team, state: CustomState): TeamBot[] {
  return team.botRoster.filter((bot) => isOn(state, bot.name));
}

/* ── The recipe after edits ─────────────────────────────────────────── */

export type Resolved = {
  botRoster: { source: TeamBot; name: string; note: string }[];
  roomName: string;
  members: string[];
  routines: { source: TeamRoutine; owner: string }[];
  connectors: string[];
};

export function resolve(team: Team, state: CustomState): Resolved {
  const botRoster = activeBots(team, state).map((source) => ({
    source,
    name: createBotName(team.kind, team.name, finalName(state, source.name)),
    note: (state.notes[source.name] ?? "").trim(),
  }));
  const live = new Set(botRoster.map((bot) => bot.source.name));
  return {
    botRoster,
    roomName: grokRoomName(state.roomName),
    /* A Bot that is off cannot sit in the room, so membership is filtered
       here rather than trusted from state. */
    members: state.members.filter((m) => live.has(m)).map((m) => createBotName(team.kind, team.name, finalName(state, m))),
    /* Same for a routine: its owner Bot has to exist to own it. */
    routines: team.routines
      .filter((r) => live.has(r.owner))
      .map((r) => ({ source: r, owner: createBotName(team.kind, team.name, finalName(state, r.owner)) })),
    connectors: team.connectors,
  };
}

/* ── Validation ─────────────────────────────────────────────────────── */

export type Check = {
  errors: string[];
  warnings: string[];
  canCopy: boolean;
  /* Verified is the same claim the shelf makes elsewhere: the group chat
     holds two to six Bots and every Bot in it exists. */
  verified: boolean;
};

/* Free text that asks for the thing a Read or Draft mode just forbade.
   Matched loosely on purpose: this warns, it never blocks. */
const WRITE_WORDS = [
  "refund", "charge", "capture", "payout", "pay out", "transfer", "wire",
  "send", "email them", "reply to", "post", "publish", "tweet", "delete",
  "cancel the", "issue a credit", "move funds", "invoice them",
];

export function check(team: Team, state: CustomState): Check {
  const errors: string[] = [];
  const warnings: string[] = [];
  const r = resolve(team, state);

  if (r.botRoster.length === 0) {
    errors.push("A team needs at least one Bot. Turn one back on, or reset to the recipe.");
  }
  const blank = r.botRoster.filter((a) => !a.name);
  if (blank.length > 0) {
    errors.push("Every Bot needs a name. Give the blank one a name, or turn it off.");
  }
  /* Compared case-insensitively, reported in the casing they typed. Two
     Bots called "Money" and "money" are still two Bots to read and one to
     confuse. */
  const seen = new Map<string, string[]>();
  for (const a of r.botRoster) {
    if (!a.name) continue;
    const key = a.name.toLowerCase();
    seen.set(key, [...(seen.get(key) ?? []), a.name]);
  }
  const clash = [...seen.values()].find((names) => names.length > 1);
  if (clash) {
    errors.push(`Two Bots share the name "${clash[0]}". Grok Bot would end up with duplicates, so make them different.`);
  }
  if (isSolo(team)) {
    /* Nothing to check beyond the roster. Verified is a claim about a
       group chat holding two to six Bots, and this recipe makes no such
       claim, so it is never Verified however valid it is. */
    return { errors, warnings, canCopy: errors.length === 0, verified: false };
  }
  if (!r.roomName) {
    errors.push("The group chat needs a name.");
  }
  if (r.members.length < 2) {
    errors.push(`A group chat holds two to six Bots. Add ${2 - r.members.length === 1 ? "one more Bot" : "more Bots"} to ${r.roomName || "the group chat"}.`);
  } else if (r.members.length > 6) {
    errors.push(`A group chat holds two to six Bots. Remove ${r.members.length - 6} from ${r.roomName}.`);
  }

  /* A mode the free text then asks the team to break. Worth saying out
     loud, not worth blocking: the human may know something we do not. */
  const free = state.free.toLowerCase();
  const asks = WRITE_WORDS.filter((word) => free.includes(word));
  if (asks.length > 0) {
    const restricted = Object.entries(state.modes)
      .filter(([, mode]) => mode !== "ask")
      .map(([name]) => name);
    /* If the text names a connector, warn about that one. Listing every
       restricted connector when they wrote "refund" buries the point. */
    const named = restricted.filter((name) => free.includes(name.toLowerCase()));
    const subject = named.length > 0 ? named : restricted;
    if (subject.length > 0) {
      const which = subject.slice(0, 3).join(", ");
      warnings.push(
        `Your extra instructions ask it to ${asks[0]}, but ${which} ${subject.length === 1 ? "is" : "are"} set to Read or Draft. The prompt will contain both. Change the mode, or copy it anyway if you meant it.`,
      );
    }
  }

  const verified = errors.length === 0 && r.members.length >= 2 && r.members.length <= 6;
  return { errors, warnings, canCopy: errors.length === 0, verified };
}

/* ── The prompt ─────────────────────────────────────────────────────── */

function writeConnectors(team: Team, state: CustomState): string[] {
  const restricted: string[] = [];
  for (const connector of team.connectors) {
    const mode = state.modes[connector] ?? teamMode(team, connector);
    if (mode !== "ask") restricted.push(connector);
  }
  return restricted;
}

function connectorSection(team: Team, state: CustomState): string[] {
  const lines: string[] = [];
  for (const connector of team.connectors) {
    const mode = state.modes[connector] ?? teamMode(team, connector);
    lines.push(`- ${connector}: ${MODE_LABEL[mode]}. ${modeRule(connector, mode)}`);
  }
  return lines;
}

function alsoSection(state: CustomState): string[] {
  const out = [...state.chips.map((chip) => `- ${chip}`)];
  const free = state.free.trim();
  if (free) {
    if (out.length > 0) out.push("");
    out.push(free);
  }
  return out;
}

function botTitle(persona: string): string {
  const first = persona.split(/(?<=[.!?])\s+/)[0]?.trim() ?? persona.trim();
  if (first.length <= 90) return first;
  return `${first.slice(0, 89).trimEnd()}…`;
}

function botDescription(persona: string): string {
  const body = persona.trim();
  return `${body} Never send, spend, or delete anything without my approval. Wait for a confirm card when the product shows one.`;
}

function profileLines(name: string, persona: string): string[] {
  return [
    "After this Bot exists, set its profile (Bot actions → Edit Profile):",
    `- Name: exactly ${name}`,
    `- Title: ${botTitle(persona)}`,
    `- Description: ${botDescription(persona)}`,
  ];
}

function skillsSection(team: Team, state: CustomState): string[] {
  const picks = state.skillPicks;
  const lines: string[] = [
    "Skills live under Settings → Plugins → Yours, and they are per Bot. Reference a skill with /.",
    "If a skill is already installed on the account (Settings → Plugins → Yours), use it. Enable it for this Bot if / does not show it.",
    "If it is not installed, fetch or load it through the Skillselion connector using the skill id. Do not install a second copy.",
    "Connect the Skillselion connector only when a fetch is needed. Do not start OAuth from this prompt.",
    "Do not pin or hide a Bot unless I say so. Hide does not pause routines.",
  ];
  if (team.routines.length > 0 || picks.length > 0) {
    lines.push("If a workflow should be demonstrated later, mention Teach a task after the first success (browser workflows).");
  }
  lines.push("");
  if (picks.length === 0) {
    if (team.skills.length === 0) {
      lines.push("(none picked. Look skills up on Skillselion if I name one later.)");
      return lines;
    }
    lines.push("Recipe skill names (look each one up on Skillselion, then enable it under Settings → Plugins → Yours):");
    for (const name of team.skills) lines.push(`- ${name}`);
    return lines;
  }
  for (const pick of picks) {
    const scoped =
      pick.scope === "team"
        ? "every Bot on this team (team scope)"
        : `only ${createBotName(team.kind, team.name, pick.scope)}`;
    lines.push(`### ${pick.name}`);
    lines.push(pick.url);
    if (pick.author) lines.push(`Creator: ${pick.author}`);
    if (pick.summary) lines.push(pick.summary);
    lines.push(`Skill id: \`${pick.id}\`.`);
    lines.push(`Scope: ${scoped}.`);
    lines.push("");
  }
  return lines;
}

function humanSteps(team: Team, state: CustomState): string[] {
  const restricted = writeConnectors(team, state);
  const lines = [
    "## Human steps",
    "",
    "These are yours. The Bot cannot do them.",
    "",
    "- Set each Bot avatar (Bot actions → Edit Profile). Attach an image if you want a custom one.",
  ];
  if (!isSolo(team)) {
    /* Sidebar section is the team create name. team.section is the website
       catalog bucket only (e.g. Founder OS) and must never be used here. */
    lines.push(`- Create a sidebar section named exactly: ${grokTeamName(team.name)}. Move the group chat and Bots into it.`);
  }
  if (restricted.length > 0) {
    lines.push(
      `- In Settings → Plugins, disable the write tools for ${restricted.join(", ")}. That switch is account-wide and it is the only one that actually stops a write.`,
    );
  }
  lines.push('- Leave notifications on: Settings → "Get notified when this Bot finishes or needs input".');
  lines.push("");
  return lines;
}

export function buildPrompt(team: Team, state: CustomState, siteUrl: string, siteGithub: string): string {
  const r = resolve(team, state);
  const stock = new Set(team.botRoster.map((a) => a.name));
  const solo = isSolo(team);
  let section = 0;
  const heading = (title: string) => `## ${++section}. ${title}`;

  const botRoster = r.botRoster
    .map(({ source, name, note }) => {
      const reuse = source.reuse
        ? "If a Bot with this exact name already exists, reuse it. Do not create a duplicate."
        : "Create this Bot. Use the name exactly.";
      const connectors = source.connectors.length
        ? `Uses connectors (already on the account): ${source.connectors.join(", ")}`
        : "No team connectors assigned to this Bot.";
      const lines = [`### ${name}`, reuse, connectors, "", "Job:", source.persona, "", ...profileLines(name, source.persona)];
      if (note) {
        lines.push(
          "",
          `Extra instruction: ${note}`,
          "This is wording, not a wall. Every Bot on this account can still reach every connected tool.",
        );
      }
      return lines.join("\n");
    })
    .join("\n\n");

  const routines = r.routines
    .map(({ source, owner }) =>
      [`### ${source.name}`, `Owner Bot: ${owner}`, `Schedule: ${source.schedule}`, "",  "Prompt to save (I will confirm the card):", source.prompt].join("\n"),
    )
    .join("\n\n");

  const also = alsoSection(state);
  const skillLines = skillsSection(team, state);

  /* An already-installed team gets a diff, not a second copy of itself.
     Pasting the full recipe twice is how people end up with two Chiefs of
     Staff, which is exactly what the reuse flag exists to prevent. */
  const dropped = team.botRoster.filter((a) => !isOn(state, a.name)).map((a) => a.name);
  const renames = r.botRoster.filter((a) => a.name !== a.source.name && stock.has(a.source.name));
  const changeNote = state.installed
    ? [
        "## 0. You already installed this team",
        "",
        "Do not create anything that already exists. Add or rename only what changed, and leave the rest alone.",
        "",
        ...(renames.length > 0 ? renames.map((a) => `- Rename "${a.source.name}" to "${a.name}".`) : []),
        ...(dropped.length > 0 ? dropped.map((n) => `- "${n}" is no longer part of this team. Leave it alone. Do not delete anything without asking me.`) : []),
        ...(solo ? [] : [`- The group chat is now "${r.roomName}" with: ${r.members.join(", ")}.`]),
        "- Re-read the connector rules below. They may have changed.",
        "",
      ]
    : [];

  const exampleBanner = team.status === "example"
    ? ["NOTE: This is an EXAMPLE team from the public directory. Use it to learn the format.", "Do not treat it as a production company recipe.", ""]
    : [];

  return [
    "# Grok Bot Teams installer",
    "",
    ...exampleBanner,
    solo
      ? `Set up a new Bot for me called ${grokBotName(team.name)}. Walk me through anything you need, then save it.`
      : `Set up a team for me called ${grokTeamName(team.name)}. Create the named Bots, then the group chat, then save the routines.`,
    "Ask me only for things you cannot see. Do not start OAuth. If a connector is missing, tell me to connect it in Settings → Plugins.",
    "",
    `From ${siteUrl} (${team.slug}). Source: ${siteGithub}.`,
    "",
    ...changeNote,
    /* The heading has to agree with section 0. "Create these Bots" over a
       list the human already created is how you end up with two of each. */
    state.installed
      ? (solo ? heading("The Bot") : heading("The Bots on this team"))
      : (solo ? heading("Create this Bot") : heading("Create these Bots")),
    "",
    state.installed
      ? "Check each one against what is already in the sidebar. Create only the ones that are missing, and rename the ones listed above."
      : "Create each Bot below. Use the names exactly. After create, set Name, Title, and Description on the profile.",
    "A Bot is persistent and named. Conversation is the task; Title is the one-line job; Description holds durable rules and approvals.",
    "",
    botRoster,
    "",
    ...(solo
      ? [
          heading("No group chat, no sidebar section"),
          "",
          "This is one Bot. Do not create a group chat for it, and do not create a sidebar section: a section is for several chats that belong together.",
          "",
        ]
      : [
          heading("Create this group chat"),
          "",
          "Open a group chat with two to six of the Bots above. Do not add more than six.",
          "",
          `### ${r.roomName}`,
          `Members (${r.members.length}, two to six Bots): ${r.members.join(", ")}`,
          "",
        ]),
    heading("Routines (confirm card required)"),
    "",
    routines
      ? [
          solo
            ? "Ping the Bot with each routine so it can save them."
            : "Ping each owner Bot with the routine they own so they can save it.",
          /* xAI's documented cap, stated where the human is about to
             create them. There is no documented team-level cap, so the
             prompt does not invent one. */
          "A routine is owned by one Bot, and one Bot can own up to 50 of them. A confirm card will appear. I will confirm each one.",
          "Do not assume a routine is saved until I confirm.",
          "",
          routines,
        ].join("\n")
      : "No routines in this recipe.",
    "",
    heading("Connectors and how far they go"),
    "",
    "Connectors are account-wide. They must already be connected.",
    "If any are missing, tell me to connect them in Settings → Plugins first.",
    "Do not walk an OAuth flow from this prompt.",
    "Every Bot on this account can reach every connected tool. The lists above are which Bot is expected to use which, not a second OAuth and not a boundary.",
    "",
    ...connectorSection(team, state),
    "",
    heading("Skills"),
    "",
    ...skillLines,
    "",
    ...(also.length > 0
      ? [
          heading("Also"),
          "",
          solo ? "Standing instructions for this Bot:" : "Standing instructions for every Bot on this team:",
          "",
          ...also,
          "",
        ]
      : []),
    ...humanSteps(team, state),
    "## Done when",
    "",
    solo ? "- The named Bot exists" : "- Named Bots exist",
    ...(solo ? [] : [`- Named group chat exists ("${r.roomName}", two to six Bots)`]),
    ...(solo ? [] : [`- I have created section "${grokTeamName(team.name)}"`]),
    "- Each routine has a confirmed save (or I declined)",
    "- Connectors listed above are already connected",
    "",
    solo ? "Uninstall: delete the Bot in the Grok Bot sidebar." : "Uninstall: delete the Bots and group chats in the Grok Bot sidebar.",
    "There is no remote uninstall from this catalog.",
  ].join("\n");
}

/* ── Share link ─────────────────────────────────────────────────────── */

/* Only the difference from the recipe travels, so an untouched team has no
   payload at all and a small edit makes a short link. */
type Wire = {
  o?: string[];
  n?: [string, string][];
  r?: string;
  m?: string[];
  c?: [string, ConnectorMode][];
  b?: [string, string][];
  k?: string[];
  f?: string;
  p?: string;
  i?: 1;
  s?: SkillPick[];
};

function sameList(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(text: string): string {
  const padded = text.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((text.length + 3) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeState(team: Team, state: CustomState): string {
  const base = defaultState(team);
  const wire: Wire = {};
  if (state.off.length > 0) wire.o = state.off;
  const names = Object.entries(state.names).filter(([k, v]) => v !== k);
  if (names.length > 0) wire.n = names as [string, string][];
  if (state.roomName !== base.roomName) wire.r = state.roomName;
  if (!sameList(state.members, base.members)) wire.m = state.members;
  const modes = Object.entries(state.modes).filter(([k, v]) => base.modes[k] !== v);
  if (modes.length > 0) wire.c = modes as [string, ConnectorMode][];
  const notes = Object.entries(state.notes).filter(([, v]) => v.trim());
  if (notes.length > 0) wire.b = notes as [string, string][];
  if (!sameList(state.chips, base.chips)) wire.k = state.chips;
  if (state.free.trim()) wire.f = state.free;
  if (state.override !== null) wire.p = state.override;
  if (state.installed) wire.i = 1;
  if (JSON.stringify(state.skillPicks) !== JSON.stringify(base.skillPicks)) wire.s = state.skillPicks;
  if (Object.keys(wire).length === 0) return "";
  return toBase64Url(JSON.stringify(wire));
}

export function decodeState(team: Team, payload: string): CustomState {
  const state = defaultState(team);
  if (!payload) return state;
  let wire: Wire;
  try {
    wire = JSON.parse(fromBase64Url(payload)) as Wire;
  } catch {
    /* A truncated or hand-mangled link falls back to the recipe rather
       than an error page. The team is still readable either way. */
    return state;
  }
  const known = new Set(team.botRoster.map((a) => a.name));
  if (Array.isArray(wire.o)) state.off = wire.o.filter((n) => known.has(n));
  if (Array.isArray(wire.n)) {
    for (const pair of wire.n) {
      if (Array.isArray(pair) && known.has(pair[0]) && typeof pair[1] === "string") state.names[pair[0]] = pair[1];
    }
  }
  if (typeof wire.r === "string") state.roomName = wire.r;
  if (Array.isArray(wire.m)) state.members = wire.m.filter((n) => known.has(n));
  if (Array.isArray(wire.c)) {
    for (const pair of wire.c) {
      if (Array.isArray(pair) && state.modes[pair[0]] !== undefined && MODES.includes(pair[1])) {
        state.modes[pair[0]] = pair[1];
      }
    }
  }
  if (Array.isArray(wire.b)) {
    for (const pair of wire.b) {
      if (Array.isArray(pair) && known.has(pair[0]) && typeof pair[1] === "string") state.notes[pair[0]] = pair[1];
    }
  }
  if (Array.isArray(wire.k)) state.chips = wire.k.filter((c) => typeof c === "string");
  if (typeof wire.f === "string") state.free = wire.f;
  if (typeof wire.p === "string") state.override = wire.p;
  if (wire.i === 1) state.installed = true;
  if (Array.isArray(wire.s)) {
    const next = wire.s.map(normalizeSkillPick).filter((p): p is SkillPick => p !== null);
    if (next.length > 0) state.skillPicks = next;
  }
  return state;
}

/* ── Export ─────────────────────────────────────────────────────────── */

function yamlScalar(value: string): string {
  const risky =
    value.includes(": ") || value.endsWith(":") || value.includes(" #") ||
    /^[-?:,[\]{}#&*!|>'"%@`]/.test(value) || value.trim() !== value;
  return risky ? `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"` : value;
}

/** The customized team as a team file, so an edit can go back into a repo. */
export function toMarkdown(team: Team, state: CustomState): string {
  const r = resolve(team, state);
  const lines = [
    "---",
    `slug: ${team.slug}`,
    `name: ${yamlScalar(isSolo(team) ? grokBotName(team.name) : grokTeamName(team.name))}`,
    `tagline: ${yamlScalar(team.tagline)}`,
    `bots: ${r.botRoster.length}`,
    `section: ${yamlScalar(team.section)}`,
    `kind: ${team.kind}`,
    `status: ${team.status}`,
    "connectors:",
    ...team.connectors.map((c) => `  - ${yamlScalar(c)}`),
    "connector_modes:",
    ...team.connectors.map((c) => `  ${yamlScalar(c)}: ${state.modes[c] ?? teamMode(team, c)}`),
    "bot_roster:",
  ];
  for (const { source, name, note } of r.botRoster) {
    lines.push(`  - name: ${yamlScalar(name)}`);
    lines.push(`    persona: ${yamlScalar(note ? `${source.persona} ${note}` : source.persona)}`);
    if (source.reuse) lines.push("    reuse: true");
    if (source.icon) lines.push(`    icon: ${source.icon}`);
    if (source.connectors.length > 0) {
      lines.push("    connectors:");
      for (const c of source.connectors) lines.push(`      - ${yamlScalar(c)}`);
    } else {
      lines.push("    connectors: []");
    }
  }
  if (isSolo(team)) {
    lines.push("rooms: []");
  } else {
    lines.push("rooms:", `  - name: ${yamlScalar(r.roomName)}`, "    members:");
    for (const m of r.members) lines.push(`      - ${yamlScalar(m)}`);
  }
  lines.push("routines:");
  for (const { source, owner } of r.routines) {
    lines.push(`  - name: ${yamlScalar(source.name)}`);
    lines.push(`    owner: ${yamlScalar(owner)}`);
    lines.push(`    schedule: ${yamlScalar(source.schedule)}`);
    lines.push(`    prompt: ${yamlScalar(source.prompt)}`);
  }
  const also = [...state.chips, state.free.trim()].filter(Boolean);
  if (also.length > 0) {
    lines.push("suggest:");
    for (const chip of state.chips) lines.push(`  - text: ${yamlScalar(chip)}`, "    on: true");
  }
  lines.push("---", "");
  lines.push(team.body);
  if (state.free.trim()) {
    lines.push("", "## Also told to Grok Bot", "", state.free.trim());
  }
  lines.push("");
  return lines.join("\n");
}
