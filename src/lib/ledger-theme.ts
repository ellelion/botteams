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
  serif: "var(--font-fraunces), Georgia, serif",
  /* Monospace — the "software" voice. System stack, no web-font dependency. */
  mono: 'ui-monospace, "SF Mono", "SFMono-Regular", Menlo, "Cascadia Code", monospace',
} as const;

export const ledgerOg = {
  paper: "#fcfcfb",
  paperDeep: "#f3f3f1",
  ink: "#111111",
  inkSoft: "#4b4b4b",
  inkFaint: "#686868",
  inkMuted: "#4b4b4b",
  label: "#686868",
  numeral: "#686868",
  oxblood: "#0891b2",
  green: "#2e7d43",
  hairline: "#d8d8d5",
  leader: "#c7c7c2",
} as const;
