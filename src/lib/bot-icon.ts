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
 * Blink, gaze, and breathing timing vary deterministically per Bot. Six
 * faces on the same frame read as a strobe; stable per-index variation
 * reads as a room of colleagues without a server/client random mismatch.
 * Negative delays start every Bot mid-cycle rather than making it wait.
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

function botMotionSeed(index: number, name: string, persona: string): number {
  let hash = 2166136261;
  for (const char of `${index}:${name}:${persona}`) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

const BOT_POSES = [
  { tilt: -4.2, gazeX: -0.48, gazeY: -0.12, gazeRotate: -2.5, scaleX: 0.96, scaleY: 1.05 },
  { tilt: 2.8, gazeX: 0.42, gazeY: 0.12, gazeRotate: 1.8, scaleX: 1.06, scaleY: 0.96 },
  { tilt: -1.4, gazeX: 0.12, gazeY: -0.42, gazeRotate: -0.8, scaleX: 0.93, scaleY: 1.1 },
  { tilt: 4.5, gazeX: -0.2, gazeY: 0.32, gazeRotate: 2.8, scaleX: 1.08, scaleY: 0.94 },
  { tilt: -3, gazeX: 0.52, gazeY: -0.18, gazeRotate: 1.2, scaleX: 1, scaleY: 1.08 },
  { tilt: 1.2, gazeX: -0.4, gazeY: 0.08, gazeRotate: -2, scaleX: 1.05, scaleY: 1 },
] as const;

export function botMarkStyle(index: number, name = "", persona = ""): Record<string, string> {
  const seed = botMotionSeed(index, name, persona);
  const pose = BOT_POSES[index % BOT_POSES.length];
  const faceDuration = 6.8 + (seed % 6) * 0.41;
  const eyeDuration = 5.9 + ((seed >>> 5) % 7) * 0.37;
  const facePhase = ((seed >>> 12) % 1000) / 1000;
  const eyePhase = ((seed >>> 20) % 1000) / 1000;
  const restY = ((seed >>> 8) % 3 - 1) * 0.08;
  return {
    "--fg": "var(--accent)",
    "--bot-accent": "var(--accent)",
    "--gb-delay": `-${((index * 1.9) % 12).toFixed(2)}s`,
    "--gb-face-duration": `${faceDuration.toFixed(2)}s`,
    "--gb-eye-duration": `${eyeDuration.toFixed(2)}s`,
    "--gb-face-delay": `-${(facePhase * faceDuration).toFixed(2)}s`,
    "--gb-eye-delay": `-${(eyePhase * eyeDuration).toFixed(2)}s`,
    "--gb-face-rest": `translateY(${restY.toFixed(2)}px) rotate(${pose.tilt}deg) scaleY(1)`,
    "--gb-face-rise": `translateY(${(restY - 0.42).toFixed(2)}px) rotate(${pose.tilt + 2.4}deg) scaleY(1.015)`,
    "--gb-face-dip": `translateY(${(restY + 0.14).toFixed(2)}px) rotate(${pose.tilt - 1.8}deg) scaleY(0.99)`,
    "--gb-face-look": `translateY(${(restY - 0.22).toFixed(2)}px) rotate(${pose.tilt + 3.2}deg) scaleY(1.01)`,
    "--gb-gaze-x": `${pose.gazeX}px`,
    "--gb-gaze-y": `${pose.gazeY}px`,
    "--gb-gaze-rotate": `${pose.gazeRotate}deg`,
    "--gb-gaze-scale-x": String(pose.scaleX),
    "--gb-gaze-scale-y": String(pose.scaleY),
    "--gb-hover-tilt": `${pose.tilt * 0.8}deg`,
    "--gb-hover-lift": `${1 + (index % 3) * 0.35}px`,
  };
}
