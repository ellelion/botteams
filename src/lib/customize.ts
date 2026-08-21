import type { ConnectorMode, Team, TeamAgent, TeamRoutine } from "@/lib/types";
import { resolveConnector } from "@/lib/connectors";

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

export function modeRule(connector: string, mode: ConnectorMode): string {
  if (mode === "read") {
    return `Use ${connector} read-only. Read and summarise it. Do not create, edit, send, move, or delete anything in ${connector}.`;
  }
  if (mode === "draft") {
    return `Use ${connector} for drafts only. Leave every draft unsent and every change unsaved so a human can review it.`;
  }
  return `Use ${connector} only after a human says yes in the chat. State exactly what you are about to do, wait for the reply, then act.`;
}

/* Connectors whose write side moves money or is otherwise not undoable.
   These start on Read. Matched on the resolved connector slug so an alias
   ("QuickBooks Online") lands on the same default as the canonical name. */
const MONEY = new Set([
  "stripe", "ramp", "brex", "mercury", "xero", "quickbooks", "bill-com", "plaid",
  "chargebee", "paddle", "recurly", "netsuite", "gusto", "rippling", "deel",
  "carta", "expensify", "navan", "tipalti", "wise", "payoneer", "square", "paypal",
  "modern-treasury", "coinbase", "adyen",
]);

/* Connectors that put words in front of other people the moment they write.
   These start on Ask before send. */
const BROADCAST = new Set([
  "slack", "discord", "x", "x-ads", "microsoft-teams", "telegram", "whatsapp",
  "twilio", "intercom", "zendesk", "front", "hubspot", "salesforce", "mailchimp",
  "customer-io", "klaviyo", "sendgrid", "linkedin", "reddit", "instagram",
  "facebook", "youtube", "tiktok", "buffer", "hootsuite",
]);

export function defaultMode(connector: string): ConnectorMode {
  const slug = resolveConnector(connector).slug;
  if (MONEY.has(slug)) return "read";
  if (BROADCAST.has(slug)) return "ask";
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
    roomName: room?.name ?? "",
    members: room ? [...room.members] : [],
    modes,
    notes: {},
    chips: team.suggest.filter((s) => s.on).map((s) => s.text),
    free: "",
    override: null,
    installed: false,
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

export function activeAgents(team: Team, state: CustomState): TeamAgent[] {
  return team.agents.filter((agent) => isOn(state, agent.name));
}

/* ── The recipe after edits ─────────────────────────────────────────── */

export type Resolved = {
  agents: { source: TeamAgent; name: string; note: string }[];
  roomName: string;
  members: string[];
  routines: { source: TeamRoutine; owner: string }[];
  connectors: string[];
};

export function resolve(team: Team, state: CustomState): Resolved {
  const agents = activeAgents(team, state).map((source) => ({
    source,
    name: finalName(state, source.name),
    note: (state.notes[source.name] ?? "").trim(),
  }));
  const live = new Set(agents.map((a) => a.source.name));
  return {
    agents,
    roomName: state.roomName.trim(),
    /* A Bot that is off cannot sit in the room, so membership is filtered
       here rather than trusted from state. */
    members: state.members.filter((m) => live.has(m)).map((m) => finalName(state, m)),
    /* Same for a routine: its owner Bot has to exist to own it. */
    routines: team.routines
      .filter((r) => live.has(r.owner))
      .map((r) => ({ source: r, owner: finalName(state, r.owner) })),
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

  if (r.agents.length === 0) {
    errors.push("A team needs at least one Bot. Turn one back on, or reset to the recipe.");
  }
  const blank = r.agents.filter((a) => !a.name);
  if (blank.length > 0) {
    errors.push("Every Bot needs a name. Give the blank one a name, or turn it off.");
  }
  /* Compared case-insensitively, reported in the casing they typed. Two
     Bots called "Money" and "money" are still two Bots to read and one to
     confuse. */
  const seen = new Map<string, string[]>();
  for (const a of r.agents) {
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

function connectorSection(team: Team, state: CustomState): string[] {
  const lines: string[] = [];
  const needsPlugins: string[] = [];
  for (const connector of team.connectors) {
    const mode = state.modes[connector] ?? teamMode(team, connector);
    lines.push(`- ${connector}: ${MODE_LABEL[mode]}. ${modeRule(connector, mode)}`);
    if (mode !== "ask") needsPlugins.push(connector);
  }
  if (needsPlugins.length > 0) {
    lines.push("");
    lines.push(
      `Human: the lines above are instructions, not permissions. In Grok Bot open Settings, then Plugins, and disable the write tools for ${needsPlugins.join(", ")}. That switch is account-wide and it is the only one that actually stops a write.`,
    );
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

export function buildPrompt(team: Team, state: CustomState, siteUrl: string, siteGithub: string): string {
  const r = resolve(team, state);
  const stock = new Set(team.agents.map((a) => a.name));

  const agents = r.agents
    .map(({ source, name, note }) => {
      const renamed = name !== source.name;
      const reuse = source.reuse
        ? "If a Bot with this exact name already exists, reuse it. Do not create a duplicate."
        : "Create this Bot. Use the name exactly.";
      const connectors = source.connectors.length
        ? `Uses connectors (already on the account): ${source.connectors.join(", ")}`
        : "No team connectors assigned to this Bot.";
      const lines = [`### ${name}`];
      if (renamed && stock.has(source.name)) lines.push(`(Named "${source.name}" in the published recipe.)`);
      lines.push(reuse, connectors, "", "Job:", source.persona);
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
      [`### ${source.name}`, `Owner Bot: ${owner}`, `Schedule: ${source.schedule}`, "", "Prompt to save (human must confirm):", source.prompt].join("\n"),
    )
    .join("\n\n");

  const skills = team.skills.length > 0
    ? team.skills.map((name) => `- ${name}`).join("\n")
    : "(none listed. Skills cannot be attached at create time anyway.)";

  const also = alsoSection(state);

  /* An already-installed team gets a diff, not a second copy of itself.
     Pasting the full recipe twice is how people end up with two Chiefs of
     Staff, which is exactly what the reuse flag exists to prevent. */
  const dropped = team.agents.filter((a) => !isOn(state, a.name)).map((a) => a.name);
  const renames = r.agents.filter((a) => a.name !== a.source.name && stock.has(a.source.name));
  const changeNote = state.installed
    ? [
        "## 0. You already installed this team",
        "",
        "Do not create anything that already exists. Add or rename only what changed, and leave the rest alone.",
        "",
        ...(renames.length > 0 ? renames.map((a) => `- Rename "${a.source.name}" to "${a.name}".`) : []),
        ...(dropped.length > 0 ? dropped.map((n) => `- "${n}" is no longer part of this team. Leave it alone or delete it yourself. Do not delete anything without asking.`) : []),
        ...(isSolo(team) ? [] : [`- The group chat is now "${r.roomName}" with: ${r.members.join(", ")}.`]),
        "- Re-read the connector rules below. They may have changed.",
        "",
      ]
    : [];

  const exampleBanner = team.status === "example"
    ? ["NOTE: This is an EXAMPLE team from the public shelf. Use it to learn the format.", "Do not treat it as a production company recipe.", ""]
    : [];

  return [
    "# Grok Bot Teams installer",
    "",
    ...exampleBanner,
    "Paste this into Grok Bot. It is a prompt, not an OAuth app and not a plugin.",
    "Do not claim one-click connect. Do not start OAuth.",
    "",
    `Catalog: ${siteUrl}`,
    `Source: ${siteGithub}`,
    isSolo(team) ? `Bot: ${team.name} (${team.slug})` : `Team: ${team.name} (${team.slug})`,
    `Bots: ${r.agents.length}`,
    ...(isSolo(team) ? [`Category: ${team.section}`] : [`Sidebar section name: ${team.section}`]),
    "",
    ...changeNote,
    /* The heading has to agree with section 0. "Create these Bots" over a
       list the human already created is how you end up with two of each. */
    state.installed
      ? (isSolo(team) ? "## 1. The Bot" : "## 1. The Bots on this team")
      : (isSolo(team) ? "## 1. Create this Bot" : "## 1. Create these Bots"),
    "",
    state.installed
      ? "Check each one against what is already in the sidebar. Create only the ones that are missing, and rename the ones listed above."
      : "In Grok Bot: New chat, then Create new agent. Then Edit Profile (name, title, description, avatar).",
    "Use the names exactly, including any prefix.",
    "A Bot is a single persistent, named agent. Give each Bot a job.",
    "",
    agents,
    "",
    ...(isSolo(team)
      ? [
          "## 2. No group chat, no sidebar section",
          "",
          "This is one Bot. Do not create a group chat for it, and do not create a sidebar section: a section is for several chats that belong together.",
          "",
        ]
      : [
          "## 2. Create this group chat",
          "",
          "In New chat, select two to six of the Bots above. Do not add more than six.",
          "",
          `### ${r.roomName}`,
          `Members (${r.members.length}, two to six Bots): ${r.members.join(", ")}`,
          "",
          "## 3. Sidebar section (human does this)",
          "",
          "The installer cannot create sidebar sections.",
          "Human: in the Grok Bot sidebar, use Move to, then New section.",
          `Name that section exactly: ${team.section}`,
          "Move the group chat and Bots into that section.",
          "",
        ]),
    isSolo(team) ? "## 3. Routines (confirm card required)" : "## 4. Routines (confirm card required)",
    "",
    routines
      ? [
          isSolo(team)
            ? "Ping the Bot with each routine so it can save them."
            : "Ping each owner Bot with the routine they own so they can save it.",
          /* xAI's documented cap, stated where the human is about to
             create them. There is no documented team-level cap, so the
             prompt does not invent one. */
          "A routine is owned by one Bot, and one Bot can own up to 50 of them. A confirm card will appear. The human must confirm each one.",
          "Do not assume a routine is saved until the human confirms.",
          "",
          routines,
        ].join("\n")
      : "No routines in this recipe.",
    "",
    isSolo(team) ? "## 4. Connectors and how far they go" : "## 5. Connectors and how far they go",
    "",
    "Connectors are account-wide. They must already be connected.",
    "If any are missing, tell the human to connect them in Grok Bot settings first.",
    "Do not walk an OAuth flow from this prompt.",
    "Every Bot on this account can reach every connected tool. The lists above are which Bot is expected to use which, not a second OAuth and not a boundary.",
    "",
    ...connectorSection(team, state),
    "",
    isSolo(team) ? "## 5. Skills" : "## 6. Skills",
    "",
    "Skills cannot be attached at Bot create time.",
    "If the human wants skills later, they add them after the Bots exist.",
    "",
    skills,
    "",
    ...(also.length > 0
      ? [
          isSolo(team) ? "## 6. Also" : "## 7. Also",
          "",
          isSolo(team) ? "Standing instructions for this Bot:" : "Standing instructions for every Bot on this team:",
          "",
          ...also,
          "",
        ]
      : []),
    "## Done when",
    "",
    isSolo(team) ? "- The named Bot exists" : "- Named Bots exist",
    ...(isSolo(team) ? [] : [`- Named group chat exists ("${r.roomName}", two to six Bots)`]),
    ...(isSolo(team) ? [] : [`- Human has created section "${team.section}"`]),
    "- Each routine has a confirmed save (or the human declined)",
    "- Connectors listed above are already connected",
    "",
    isSolo(team) ? "Uninstall: delete the Bot in the Grok Bot sidebar." : "Uninstall: delete the Bots and group chats in the Grok Bot sidebar.",
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
  const known = new Set(team.agents.map((a) => a.name));
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
    `name: ${yamlScalar(team.name)}`,
    `tagline: ${yamlScalar(team.tagline)}`,
    `bots: ${r.agents.length}`,
    `section: ${yamlScalar(team.section)}`,
    "status: team",
    "connectors:",
    ...team.connectors.map((c) => `  - ${yamlScalar(c)}`),
    "connector_modes:",
    ...team.connectors.map((c) => `  ${yamlScalar(c)}: ${state.modes[c] ?? teamMode(team, c)}`),
    "agents:",
  ];
  for (const { source, name, note } of r.agents) {
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
