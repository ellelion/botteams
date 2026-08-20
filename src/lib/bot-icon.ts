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
