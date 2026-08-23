import type { TeamAgent } from "@/lib/types";

export function botIconKey(agent: TeamAgent): string {
  if (agent.icon) return agent.icon;
  const n = agent.name.toLowerCase();
  if (n.includes("inbox") || n.includes("mail") || n.includes("follow") || n.includes("welcome") || n.includes("outreach") || n.includes("guest")) return "inbox";
  if (n.includes("calendar") || n.includes("schedule") || n.includes("run of show")) return "calendar";
  if (n.includes("money") || n.includes("billing") || n.includes("stripe") || n.includes("numbers")) return "card";
  if (n.includes("recap")) return "recap";
  if (n.includes("pipeline") || n.includes("roadmap") || n.includes("map")) return "pipeline";
  if (n.includes("health")) return "health";
  if (n.includes("screen") || n.includes("review") || n.includes("source") || n.includes("sourcer") || n.includes("research")) return "search";
  if (n.includes("moderation") || n.includes("exceptions") || n.includes("blocker") || n.includes("legal")) return "shield";
  if (n.includes("draft") || n.includes("script") || n.includes("letter") || n.includes("spec") || n.includes("offer") || n.includes("intro")) return "pen";
  if (n.includes("staff") || n.includes("lead") || n.includes("kickoff") || n.includes("brief") || n.includes("chief")) return "staff";
  return "staff";
}

export function sectionSlug(section: string): string {
  return section.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/*
 * Per-Bot mark styling.
 *
 * x.ai tints the same face per context (their Engineering chips run
 * --fg:#EA4045), so a roster reads as distinct Bots rather than one Bot
 * printed six times. We do the same by position in the roster.
 *
 * The cycle is offset per Bot too. Six faces tilting and blinking on the
 * same frame reads as a strobe; offsetting them reads as a room full of
 * colleagues. The delay is negative so every Bot starts mid-cycle rather
 * than sitting still waiting for its turn.
 */
const BOT_MARK_COLORS = [
  "#54B9A6",
  "#F19D38",
  "#6464EF",
  "#885CF5",
  "#3C82F6",
  "#ED712E",
];

export function botUiKind(name: string, persona = ""): "product" | "code" | "find" | "market" | "trust" | "money" | "desk" {
  const n = `${name} ${persona}`.toLowerCase();
  if (/money|stripe|ramp|billing|cfo/.test(n)) return "money";
  if (/trust|legal|secur|compliance/.test(n)) return "trust";
  if (/market|growth|social|x.com|gmail/.test(n)) return "market";
  if (/findab|seo|aeo|geo|citation|ahrefs|semrush/.test(n)) return "find";
  if (/cod|engineer|github|ship/.test(n)) return "code";
  if (/product|pm|linear|week list/.test(n)) return "product";
  return "desk";
}

const KIND_COLORS: Record<ReturnType<typeof botUiKind>, string> = {
  product: "#54B9A6",
  code: "#3C82F6",
  find: "#6464EF",
  market: "#F19D38",
  trust: "#885CF5",
  money: "#ED712E",
  desk: "#54B9A6",
};

export function botMarkStyle(index: number, name = "", persona = ""): Record<string, string> {
  const kind = name ? botUiKind(name, persona) : "desk";
  const fg = name ? KIND_COLORS[kind] : BOT_MARK_COLORS[index % BOT_MARK_COLORS.length];
  return {
    "--fg": fg,
    "--bot-accent": fg,
    "--gb-delay": `-${((index * 1.9) % 12).toFixed(2)}s`,
  };
}
