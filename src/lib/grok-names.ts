export function grokTeamName(name: string): string {
  const n = name.trim().replace(/\s+team$/i, "").trim();
  return n ? `${n} Team` : "";
}

/** Sidebar create name for a solo Bot. No "Grok". */
export function grokBotName(name: string): string {
  const n = name.trim().replace(/\s+Grok Bot$/i, "").replace(/\s+Bot$/i, "").trim();
  return n ? `${n} Bot` : "";
}

export function grokRoomName(name: string): string {
  const n = name.trim().replace(/\s+group chat$/i, "").replace(/\s+team$/i, "").trim();
  return n ? `${n} group chat` : "";
}

export function grokTeamBase(name: string): string {
  return grokTeamName(name).replace(/\s+Team$/i, "").trim();
}

function roleOnly(agentName: string): string {
  return (
    agentName
      .replace(/\s+Grok Bot$/i, "")
      .replace(/\s+Bot$/i, "")
      .replace(/^.*?·\s*/, "")
      .replace(/^.*?\s+Team\s+-\s+/i, "")
      .trim() || agentName.trim()
  );
}

/** Sidebar create name for a team member. No "Grok", no middle-dot prefix. */
export function grokMemberName(teamName: string, agentName: string): string {
  if (!agentName.trim()) return "";
  const role = roleOnly(agentName);
  if (!role) return "";
  return grokBotName(`${grokTeamName(teamName)} - ${role}`);
}

/** Short label on this site. SEO may still say Product Grok Bot. */
export function grokDisplayBotName(agentName: string): string {
  const role = roleOnly(agentName);
  return role ? `${role} Grok Bot` : "";
}

export function grokRecipeTitle(kind: "bot" | "team", name: string): string {
  return kind === "bot" ? grokDisplayBotName(name) : grokTeamName(name);
}

/** Name Grok Bot creates in the sidebar. */
export function createBotName(kind: "bot" | "team", teamName: string, agentName: string): string {
  if (!agentName.trim()) return "";
  return kind === "bot" ? grokBotName(agentName) : grokMemberName(teamName, agentName);
}
