/* Ledger design system — shared tokens for every ellelion.com page */
export const ledger = {
  paper: "var(--page)",
  /* Slightly deeper paper — used for inset panels (e.g. the agent command block). */
  paperDeep: "var(--surface)",
  ink: "var(--ink)",
  inkSoft: "var(--ink-soft)",
  /* Secondary/meta tones darkened to clear WCAG AA (≥4.5:1) on paper AND paperDeep. */
  inkFaint: "var(--muted)",
  inkMuted: "var(--ink-soft)",
  label: "var(--muted)",
  numeral: "var(--muted)",
  oxblood: "var(--accent)",
  accentText: "var(--accent-text)",
  green: "var(--status-live)",
  hairline: "var(--line)",
  leader: "var(--leader)",
  /* Display face. Named "serif" for history; it is Geist Sans now.
     x.ai sets its display in Universal Sans, which is a paid licence we
     do not hold, so this is the closest thing we may legally ship. */
  serif: "var(--font-geist-sans), system-ui, sans-serif",
  /* Geist Mono carries the labels, eyebrows and nav accents, the way
     x.ai uses a mono for everything that is not display. */
  mono: "var(--font-geist-mono), ui-monospace, monospace",
} as const;

export const ledgerOg = {
  paper: "#0a0a0a",
  paperDeep: "#1a1a1a",
  ink: "#ffffff",
  inkSoft: "#d6d9de",
  inkFaint: "#7d8187",
  inkMuted: "#d6d9de",
  label: "#7d8187",
  numeral: "#7d8187",
  oxblood: "#ff6308",
  green: "#4ade80",
  hairline: "#1f2229",
  leader: "#2a2e35",
} as const;
