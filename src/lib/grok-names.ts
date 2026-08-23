export function grokTeamName(name: string): string {
  const n = name.trim();
  if (/\bteam$/i.test(n)) return n;
  return `${n} team`;
}
export function grokBotName(name: string): string {
  const n = name.trim().replace(/\s+Grok Bot$/i, "").replace(/\s+Bot$/i, "").trim();
  return n + " Grok Bot";
}

export function grokRoomName(name: string): string {
  const n = name.trim().replace(/\s+group chat$/i, "").replace(/\s+team$/i, "").trim();
  return n + " group chat";
}

export function grokRecipeTitle(kind: "bot" | "team", name: string): string {
  return kind === "bot" ? grokBotName(name) : grokTeamName(name);
}

export function grokTeamBase(name: string): string {
  return grokTeamName(name).replace(/\s+team$/i, "").trim();
}

function roleOnly(agentName: string): string {
  return agentName.replace(/\s+Grok Bot$/i, "").replace(/\s+Bot$/i, "").replace(/^.*?·\s*/, "").trim() || agentName.trim();
}

export function grokMemberName(teamName: string, agentName: string): string {
  const role = roleOnly(agentName);
  const base = grokTeamBase(teamName);
  const raw = agentName.replace(/\s+Grok Bot$/i, "").replace(/\s+Bot$/i, "").trim();
  if (raw.toLowerCase().startsWith(base.toLowerCase())) return grokBotName(agentName);
  return grokBotName(base + " · " + role);
}

/** Short label on this site. Grok Bot still gets grokMemberName. */
export function grokDisplayBotName(agentName: string): string {
  return grokBotName(roleOnly(agentName));
}
