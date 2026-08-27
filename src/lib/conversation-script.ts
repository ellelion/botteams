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
  return name.replace(/^.*?·\s*/, "").replace(/^.*?\s+Team\s+-\s+/i, "").replace(/\s+Grok Bot$/i, "").replace(/\s+Bot$/i, "").trim() || name.trim();
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

function ownedRoutines(bot: TeamBot, routines: TeamRoutine[]): TeamRoutine[] {
  const role = roleOf(bot.name).toLowerCase();
  return routines.filter((r) => {
    const o = r.owner.toLowerCase();
    return o === bot.name.toLowerCase() || o.includes(role) || role.includes(o.replace(/^.*?·\s*/, ""));
  });
}

/**
 * A real pass of this recipe, not a shuffled greeting pack.
 * Roster order is the story: first bot starts the week job,
 * each later bot reports from their own connectors and owned routine,
 * then hands the next named Bot a concrete next step.
 */
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
