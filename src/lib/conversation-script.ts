import { grokDisplayBotName } from "@/lib/grok-names";
import type { Team, TeamBot, TeamRoutine, ConversationTurn } from "@/lib/types";

export type { ConversationTurn };

export function isFirstParty(team: Pick<Team, "contributor" | "scoutedBy" | "addedVia">): boolean {
  return !team.contributor && !team.scoutedBy && !team.addedVia;
}

function hash32(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

class Rng {
  private s: number;
  constructor(seed: number) {
    this.s = seed || 1;
  }
  next(): number {
    this.s = (Math.imul(this.s, 1664525) + 1013904223) >>> 0;
    return this.s;
  }
  pick<T>(arr: readonly T[]): T {
    return arr[this.next() % arr.length];
  }
  maybe<T>(arr: readonly T[], chance: number): T | undefined {
    if (arr.length === 0) return undefined;
    if ((this.next() % 100) >= chance) return undefined;
    return this.pick(arr);
  }
  int(min: number, max: number): number {
    return min + (this.next() % (max - min + 1));
  }
  shuffle<T>(arr: readonly T[]): T[] {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = this.next() % (i + 1);
      const t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }
}

function roleOf(name: string): string {
  return name.replace(/^.*?·\s*/, "").replace(/\s+Grok Bot$/i, "").replace(/\s+Bot$/i, "").trim() || name.trim();
}

function clip(s: string, n: number): string {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= n) return t.replace(/[.,;:]+$/, "");
  const cut = t.slice(0, n);
  const sp = cut.lastIndexOf(" ");
  return (sp > 24 ? cut.slice(0, sp) : cut).replace(/[.,;:]+$/, "");
}

function firstClause(s: string): string {
  const t = s.replace(/\s+/g, " ").trim();
  const m = t.match(/^[^.;!?]{8,110}/);
  return clip(m ? m[0] : t, 92);
}

function words(text: string): string[] {
  const stop = new Set(
    "the a an and or of to for in on with from that this is are was be it we you they never only not does do should must can will just also than then into over under about after before while when where who what how why its it's their our your any all each every own still already yet been being have has had than more most less few one two new old same other than via per".split(
      " ",
    ),
  );
  const out: string[] = [];
  for (const raw of text.toLowerCase().match(/[a-z][a-z0-9-]{2,}/g) ?? []) {
    if (stop.has(raw) || out.includes(raw)) continue;
    out.push(raw);
  }
  return out;
}

function seedKey(team: Team): string {
  return [
    team.slug,
    team.kind,
    team.name,
    team.tagline,
    team.section,
    team.body,
    team.botRoster.map((a) => [a.name, a.persona, a.connectors.join(",")].join("|")).join("~"),
    team.connectors.join(","),
    team.routines.map((r) => [r.name, r.owner, r.schedule, r.prompt].join("|")).join("~"),
  ].join("\n");
}

function coprimeStep(n: number, rng: Rng): number {
  if (n <= 1) return 1;
  for (let k = 0; k < 12; k++) {
    const step = 1 + (rng.next() % n);
    if (gcd(step, n) === 1) return step;
  }
  return 1;
}

function gcd(a: number, b: number): number {
  while (b) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a;
}

function ownedRoutines(bot: TeamBot, routines: TeamRoutine[]): TeamRoutine[] {
  const role = roleOf(bot.name).toLowerCase();
  return routines.filter((r) => {
    const o = r.owner.toLowerCase();
    return o === bot.name.toLowerCase() || o.includes(role) || role.includes(o.replace(/^.*?·\s*/, ""));
  });
}

function checkFrom(routine: TeamRoutine, connector: string | undefined, rng: Rng): string {
  const stems = [
    `Run ${routine.name}`,
    `Log ${routine.name}`,
    connector ? `Open ${connector} for ${routine.name}` : `Queue ${routine.name}`,
    clip(routine.prompt, 42),
    `${routine.name} · ${clip(routine.schedule, 28)}`,
  ];
  return rng.pick(stems);
}


/**
 * A real pass of this recipe, not a shuffled greeting pack.
 * Roster order is the story: first bot starts the week job,
 * each later bot reports from their own connectors and owned routine,
 * then hands the next named Bot a concrete next step.
 */
function connectorUse(tool: string, bot: TeamBot, team: Team): { doing: string; status: string; check: string; screen: string; detail: string } {
  const t = tool.toLowerCase();
  const hay = `${bot.name} ${bot.persona} ${team.section} ${team.tagline} ${team.slug} ${team.body}`.toLowerCase();
  if (/salesforce|hubspot/.test(t)) {
    return {
      doing: `reading the pipeline in ${tool}`,
      status: `pipeline note parked. Nothing moved.`,
      check: `${tool} → pipeline read`,
      screen: `${tool} pipeline · open deals · 0 moved`,
      detail: `${tool} pipeline read. Nothing moved.`,
    };
  }
  if (/ahrefs|semrush|search console|indexnow|yandex|bing webmaster/.test(t) || (/seo|aeo|geo|findab/.test(hay) && /ahrefs|semrush|search/.test(t))) {
    return {
      doing: `gathering keywords and pages in ${tool}`,
      status: `keywords parked in the draft. Not published.`,
      check: `${tool} → keywords pulled`,
      screen: `${tool} · keywords · 0 published`,
      detail: `${tool} keywords pulled. Not published.`,
    };
  }
  if (/github/.test(t)) {
    return {
      doing: `opening open work and drafting the next change`,
      status: `draft on GitHub. Not merged.`,
      check: `${tool} → draft ready · 0 merged`,
      screen: `GitHub draft · 1 PR · 0 merged`,
      detail: `GitHub draft ready. Not merged.`,
    };
  }
  if (/linear/.test(t)) {
    return {
      doing: `reading this week's issues and cutting the ship list`,
      status: `week list is cut. Nothing closed without you.`,
      check: `${tool} → week list`,
      screen: `Linear week list · open issues · 0 closed`,
      detail: `Linear week list. Nothing closed.`,
    };
  }
  if (/\bx\b|twitter/.test(t)) {
    return {
      doing: `drafting the public post in your voice`,
      status: `post queued as a draft. 0 sent.`,
      check: `${tool} → draft queued · 0 sent`,
      screen: `X draft queue · 1 post · 0 sent`,
      detail: `${tool} draft queued. 0 sent.`,
    };
  }
  if (/stripe|ramp/.test(t)) {
    return {
      doing: `reading charges and cash for the week`,
      status: `money note drafted. Funds not moved.`,
      check: `${tool} → week read`,
      screen: `${tool} week read · charges · 0 moved`,
      detail: `${tool} week read. Funds not moved.`,
    };
  }
  if (/gmail/.test(t)) {
    return {
      doing: `reading the inbox and parking replies`,
      status: `replies drafted. 0 sent.`,
      check: `${tool} → drafts parked · 0 sent`,
      screen: `Gmail drafts · parked · 0 sent`,
      detail: `Gmail drafts parked. 0 sent.`,
    };
  }
  if (/calendar/.test(t)) {
    return {
      doing: `listing the week and the next slot`,
      status: `week list is in Calendar. Not a ship yet.`,
      check: `${tool} → week list`,
      screen: `Calendar week list · slots · 0 booked out`,
      detail: `Calendar week list. Not a ship yet.`,
    };
  }
  if (/notion/.test(t)) {
    return {
      doing: `writing the week list in Notion`,
      status: `list is in Notion. Not a ship yet.`,
      check: `${tool} → week list`,
      screen: `Notion week list · parked · 0 published`,
      detail: `Notion week list. Not a ship yet.`,
    };
  }
  if (/firecrawl|exa/.test(t)) {
    return {
      doing: `reading the live site the way another bot would`,
      status: `scan noted. Next fix is a draft.`,
      check: `${tool} → scan done`,
      screen: `${tool} scan · live pages · 0 changed`,
      detail: `${tool} scan done. Next fix is a draft.`,
    };
  }
  return {
    doing: `reading ${tool} for this desk`,
    status: `note parked. Human if it goes out.`,
    check: `${tool} → read`,
    screen: `${tool} · read · 0 sent`,
    detail: `${tool} read. Human if it goes out.`,
  };
}

export function generateConversation(team: Team): ConversationTurn[] {
  const bots = team.botRoster;
  const rng = new Rng(hash32(seedKey(team)));
  const room = team.rooms[0]?.name ?? team.name;
  const teamTools = team.connectors;
  const routines = team.routines;
  const turns: ConversationTurn[] = [];

  const toolsOf = (bot: TeamBot): string[] => {
    const own = bot.connectors.filter(Boolean);
    if (own.length) return own;
    return teamTools.slice(0, 1);
  };

  const you = (text: string): ConversationTurn => ({
    speaker: "You",
    role: "user",
    text,
  });

  const speak = (bot: TeamBot, text: string, extra?: Partial<ConversationTurn>): ConversationTurn => ({
    speaker: grokDisplayBotName(bot.name),
    speakerKey: bot.name,
    text,
    ...extra,
  });

  const toolName = (i: number) => teamTools[i] ?? teamTools[0] ?? "the board";
  const openAsk = (() => {
    const a = toolName(0);
    if (/sales|outbound|talent|recruit|hire/.test(`${team.section} ${team.slug} ${team.tagline}`.toLowerCase())) {
      return `Pull ${a} for this req. Short list only. I pick who we talk to.`;
    }
    if (/seo|findab|market/.test(`${team.section} ${team.slug}`.toLowerCase())) {
      return `Read ${a} for this week. Draft the next fix. Do not publish.`;
    }
    return `One ship this week. Start in ${a}. Draft only.`;
  })();
  const followAsk = (() => {
    const b = toolName(1) ?? "the next tool";
    return `Next, draft in ${b}. I review before anything goes out.`;
  })();
  const closeAsk = `Good. Nothing sent, merged, published, or moved until I say.`;

  if (bots.length === 1) {
    const bot = bots[0];
    const tool = toolsOf(bot)[0] ?? "the board";
    const r0 = ownedRoutines(bot, routines)[0];
    turns.push(you(openAsk));
    turns.push(speak(bot, `Opened ${tool}. ${firstClause(bot.persona)} Draft only.`));
    turns.push(you(followAsk));
    turns.push(
      speak(
        bot,
        r0
          ? `Draft is ready. ${r0.name} stays ${r0.schedule}. I will not send, merge, or publish without you.`
          : `Draft is ready. I will not send, merge, or publish without you.`,
      ),
    );
    turns.push(you(closeAsk));
    void rng;
    void room;
    return turns;
  }

  const lead = bots[0];
  const second = bots[1];
  const leadTool = toolsOf(lead)[0] ?? "the board";

  turns.push(you(openAsk));
  turns.push(speak(lead, `Pulled ${leadTool}. ${firstClause(lead.persona)}`));

  const aName = grokDisplayBotName(lead.name);
  const bName = grokDisplayBotName(second.name);
  const aJob = firstClause(lead.persona);
  const bJob = firstClause(second.persona);
  turns.push({
    speaker: aName,
    speakerKey: lead.name,
    text: `${roleOf(lead.name)} ${aJob} ${roleOf(second.name)} ${bJob}`,
    fromBots: {
      keys: [lead.name, second.name],
      text: `${roleOf(lead.name)} ${aJob} ${roleOf(second.name)} ${bJob}`,
    },
  });
  turns.push(you(followAsk));
  turns.push(speak(second, `${firstClause(second.persona)} Draft is ready. Nothing goes out until you look.`));
  turns.push(you(closeAsk));
  void rng;
  void room;
  return turns;
}

export function conversationFor(team: Team): ConversationTurn[] | undefined {
  if (team.conversation && team.conversation.length > 0) return team.conversation;
  if (!isFirstParty(team)) return undefined;
  if (team.botRoster.length === 0) return undefined;
  return generateConversation(team);
}
