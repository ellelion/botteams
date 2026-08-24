/** Short line for a Bot in a group chat. Prefers `brings`, else the first sentence of persona. */
export function botBringsLine(persona: string, brings?: string): string {
  const preferred = brings?.replace(/\s+/g, " ").trim();
  if (preferred) return preferred;
  const raw = persona.replace(/\s+/g, " ").trim();
  if (!raw) return "";
  return raw.split(/(?<=[.!?])\s+/)[0]?.trim() ?? raw;
}
