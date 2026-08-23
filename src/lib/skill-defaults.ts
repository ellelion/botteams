import type { Team, TeamAgent } from "@/lib/types";
import { hitFromId, type SkillPick, type SkillselionHit } from "@/lib/skillselion";

const C = {
  find: hitFromId("skill:vercel-labs/skills#find-skills", "find-skills"),
  grill: hitFromId("skill:mattpocock/skills#grill-me", "grill-me"),
  ui: hitFromId("skill:anthropics/skills#frontend-design", "frontend-design"),
  grillDocs: hitFromId("skill:mattpocock/skills#grill-with-docs", "grill-with-docs"),
  arch: hitFromId("skill:mattpocock/skills#improve-codebase-architecture", "improve-codebase-architecture"),
  tdd: hitFromId("skill:mattpocock/skills#tdd", "tdd"),
  browser: hitFromId("skill:vercel-labs/agent-browser#agent-browser", "agent-browser"),
  setup: hitFromId("skill:mattpocock/skills#setup-matt-pocock-skills", "setup-matt-pocock-skills"),
  react: hitFromId("skill:vercel-labs/agent-skills#vercel-react-best-practices", "vercel-react-best-practices"),
  handoff: hitFromId("skill:mattpocock/skills#handoff", "handoff"),
  triage: hitFromId("skill:mattpocock/skills#triage", "triage"),
  proto: hitFromId("skill:mattpocock/skills#prototype", "prototype"),
  seo: hitFromId("skill:aaaaqwq/claude-code-skills#seo-content-writing", "seo-content-writing"),
  seoLong: hitFromId("skill:guia-matthieu/clawfu-skills#seo-content-writer", "seo-content-writer"),
};

function pick(hit: SkillselionHit, scope: string): SkillPick {
  return { ...hit, use: "fetch", scope };
}

function blob(team: Team): string {
  return [team.section, team.name, team.tagline, team.body, ...team.connectors, ...team.agents.flatMap((a) => [a.name, a.persona])].join(" ").toLowerCase();
}

function has(text: string, words: string[]): boolean {
  return words.some((w) => {
    const word = w.trim();
    if (!word) return false;
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:[^a-z0-9]|$)`).test(text);
  });
}

function match(agents: TeamAgent[], words: string[]): TeamAgent | undefined {
  return agents.find((a) => has((a.name + " " + a.persona).toLowerCase(), words));
}

export function teamHasOwnSkills(team: Team): boolean {
  return team.skills.length > 0 || team.agents.some((a) => (a.skills?.length ?? 0) > 0);
}

export function seedSkillPicks(team: Team): SkillPick[] {
  /* Always at least one Skillselion skill. Own YAML skills still get find-skills. */
  const text = blob(team);
  const agents = team.agents;
  const solo = team.kind === "bot" || agents.length === 1;
  const out: SkillPick[] = [];
  const seen = new Set<string>();
  const add = (hit: SkillselionHit, scope: string) => {
    const key = hit.id + "::" + scope;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(pick(hit, scope));
  };

  const head = [team.section, team.name, team.tagline].join(" ").toLowerCase();
  const docs = has(head, ["notion", "docs", "confluence", "coda"]);
  const engineering = has(head, ["engineering", "engineer", "review", "release", "on-call", "debt", "coding", "infra", "sre"]);
  const frontend = has(head, ["frontend", "front-end", " ui", "ux", "react", "next.js"]);
  const planning = has(head, ["planning", "founder", "strategy", "chief of staff"]);
  const supportish = ["hiring", "support", "workplace"].includes(team.section.toLowerCase()) || has(head, ["hiring", "recruit", "helpdesk", "onboarding", "applicant"]);
  const browse = has(head, ["social", "competitive", "scout"]);
  const marketing = has(head, ["marketing", "content", "seo", "geo", "aeo", "copy", "growth", "creator"]);
  const product = has(head, ["product", "prototype", "mvp"]);
  const pages = frontend || marketing || has(text, ["landing", "website"]);

  add(C.find, "team");
  const one = agents[0]?.name ?? "team";
  if (solo) {
    if (supportish) add(C.triage, one);
    else if (has(head, ["marketing", "content", "seo", "copy", "growth", "creator", "brand"])) add(C.seo, one);
    else if (has(head, ["frontend", "front-end", "ui", "ux", "react"])) add(C.ui, one);
    else if (has(head, ["engineering", "engineer", "review", "release", "on-call", "debt", "coding", "infra", "sre"])) add(C.tdd, one);
    else if (has(head, ["founder", "strategy", "planning", "chief"])) add(docs ? C.grillDocs : C.grill, one);
    else if (has(head, ["browser", "social", "competitive", "watch", "scout"])) add(C.browser, one);
    else if (has(head, ["product", "prototype", "mvp"])) add(C.proto, one);
    return out;
  }

  if (agents.length >= 2) add(C.handoff, "team");

  const rev = match(agents, ["review", "reviewer", "critic", "architect", "qa", "release", "on-call", "sre"]) ?? match(agents, ["engineer", "senior", "lead"]);
  const bld = match(agents, ["build", "builder", "implement", "frontend", "designer", "maker", "dev", "engineer", "product"]);
  const plan = match(agents, ["founder", "strategy", "chief", "plan", "staff", "coach"]);
  const watch = match(agents, ["watch", "browser", "social", "competitive", "scout", "research"]);
  const desk = match(agents, ["hire", "hiring", "recruit", "support", "ticket", "desk", "triage", "success", "people"]);
  const mkt = match(agents, ["market", "content", "seo", "copy", "writer", "growth", "brand"]);
  const des = match(agents, ["design", "ui", "ux", "web", "frontend", "brand"]) ?? bld;

  if (engineering) {
    add(C.tdd, rev?.name ?? "team");
    add(C.arch, rev?.name ?? "team");
    if (bld && bld !== rev) add(C.proto, bld.name);
    else if (product) add(C.proto, bld?.name ?? "team");
    if (agents.length >= 3) add(C.setup, rev?.name ?? "team");
  } else if (product) {
    add(C.proto, bld?.name ?? "team");
  }
  if (frontend) {
    add(C.ui, des?.name ?? "team");
    add(C.react, des?.name ?? "team");
  }
  if (planning) add(docs ? C.grillDocs : C.grill, plan?.name ?? "team");
  if (supportish) add(C.triage, desk?.name ?? "team");
  if (browse) add(C.browser, watch?.name ?? "team");
  if (marketing) {
    add(C.seo, mkt?.name ?? "team");
    if (pages && !frontend) add(C.ui, mkt?.name ?? "team");
    if (has(text, ["seo"]) && mkt) add(C.seoLong, mkt.name);
  }
  if (out.length === 0) add(C.find, "team");
  return out;
}
