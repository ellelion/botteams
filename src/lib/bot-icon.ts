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
 * Faces follow the site accent (--accent), so they stay in theme when
 * the visitor picks a colour or switches light/dark. Connector brand
 * marks stay in their own colours.
 *
 * Blink/tilt is still offset per Bot. Six faces on the same frame read
 * as a strobe; offsetting them reads as a room of colleagues. The delay
 * is negative so every Bot starts mid-cycle rather than waiting.
 */
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

export function botMarkStyle(index: number, _name = "", _persona = ""): Record<string, string> {
  return {
    "--fg": "var(--accent)",
    "--bot-accent": "var(--accent)",
    "--gb-delay": `-${((index * 1.9) % 12).toFixed(2)}s`,
  };
}
