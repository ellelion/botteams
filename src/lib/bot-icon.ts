import type { PackAgent } from "@/lib/types";

export function botIconKey(agent: PackAgent): string {
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
  "#0891b2", // cyan, the house accent
  "#ea4045", // red
  "#7856ff", // violet
  "#1f8a65", // green
  "#e0803a", // amber
  "#3b6fd4", // blue
];

export function botMarkStyle(index: number): Record<string, string> {
  return {
    "--fg": BOT_MARK_COLORS[index % BOT_MARK_COLORS.length],
    "--gb-delay": `-${((index * 1.9) % 12).toFixed(2)}s`,
  };
}
