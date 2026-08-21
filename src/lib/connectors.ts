/*
 * Grok Bot connector catalog.
 *
 * xAI publishes no machine-readable connector list, so this is a dated
 * snapshot and not a live feed. Treat it the way the rest of this shelf
 * treats a claim: sourced, dated, and re-checkable.
 *
 * Primary source: https://github.com/rdmgator12/awesome-grok-connectors
 *   community directory, read 2026-08-21, stating 31 connectors as of
 *   2026-08-12.
 * Cross-check: https://x.ai/news/grok-connectors (xAI, 2026-05-06), which
 *   names Google Workspace, Outlook, OneDrive, SharePoint, Notion, GitHub,
 *   Linear and Bring Your Own MCP.
 *
 * Slack is deliberately absent. It shipped early and was pulled from the
 * catalog before 2026-08-12. It stays in RETIRED so an old team file keeps
 * resolving, but nothing should present it as available.
 *
 * Re-check CATALOG_CHECKED_ON before repeating "every connector" anywhere.
 *
 * Brand marks under /public/connectors come from two places: hand-added
 * files, and simple-icons 16.28.0 (CC0 1.0), which is why some are a
 * single brand colour rather than the full multicolour logo. simple-icons
 * carries no Microsoft marks at all, so those came from gilbarbara/logos
 * (CC0), svgl (MIT) and botdirectory.ai (MIT). See ATTRIBUTION.md.
 * Outlook Calendar keeps a monogram on purpose: no set carries it, and
 * reusing the Outlook mail mark for it would be wrong, not just plain.
 */

export const CATALOG_SOURCE = "https://github.com/rdmgator12/awesome-grok-connectors";
export const CATALOG_CHECKED_ON = "2026-08-21";
export const CATALOG_AS_OF = "2026-08-12";

export type ConnectorCategory =
  | "Featured"
  | "Advertising"
  | "Analytics"
  | "Developer"
  | "Finance"
  | "Productivity"
  | "Sales"
  | "Business and enterprise";

export type CatalogEntry = {
  name: string;
  slug: string;
  category: ConnectorCategory;
  /* Filename under /public/connectors. Empty means we have no brand mark
     yet and the row falls back to a monogram chip. */
  file: string;
};

export const CONNECTOR_CATALOG: CatalogEntry[] = [
  { name: "Box", slug: "box", category: "Featured", file: "box.svg" },
  { name: "Canva", slug: "canva", category: "Featured", file: "canva.svg" },
  { name: "GitHub", slug: "github", category: "Featured", file: "github.svg" },
  { name: "Gmail", slug: "gmail", category: "Featured", file: "gmail.svg" },
  { name: "Google Calendar", slug: "google-calendar", category: "Featured", file: "google-calendar.svg" },
  { name: "Google Drive", slug: "google-drive", category: "Featured", file: "google-drive.svg" },
  { name: "Notion", slug: "notion", category: "Featured", file: "notion.svg" },
  { name: "Stripe", slug: "stripe", category: "Featured", file: "stripe.svg" },
  { name: "Vercel", slug: "vercel", category: "Featured", file: "vercel.svg" },
  { name: "Wix", slug: "wix", category: "Featured", file: "wix.svg" },

  { name: "X Ads", slug: "x-ads", category: "Advertising", file: "x.svg" },

  { name: "Google Cloud BigQuery", slug: "google-cloud-bigquery", category: "Analytics", file: "google-cloud-bigquery.svg" },

  { name: "Excalidraw", slug: "excalidraw", category: "Developer", file: "excalidraw.svg" },
  { name: "Mixpanel", slug: "mixpanel", category: "Developer", file: "mixpanel.svg" },

  { name: "eToro", slug: "etoro", category: "Finance", file: "" },
  { name: "Interactive Brokers", slug: "interactive-brokers", category: "Finance", file: "" },
  { name: "S&P Global", slug: "s-and-p-global", category: "Finance", file: "" },
  { name: "Webull", slug: "webull", category: "Finance", file: "" },

  { name: "Calendly", slug: "calendly", category: "Productivity", file: "calendly.svg" },
  { name: "Figma", slug: "figma", category: "Productivity", file: "figma.svg" },
  { name: "Gamma", slug: "gamma", category: "Productivity", file: "" },
  { name: "HyperFrames by HeyGen", slug: "hyperframes", category: "Productivity", file: "" },
  { name: "Linear", slug: "linear", category: "Productivity", file: "linear.svg" },
  { name: "Microsoft Teams", slug: "microsoft-teams", category: "Productivity", file: "microsoft-teams.svg" },
  { name: "Outlook", slug: "outlook", category: "Productivity", file: "outlook.svg" },
  { name: "Outlook Calendar", slug: "outlook-calendar", category: "Productivity", file: "" },

  { name: "HubSpot", slug: "hubspot", category: "Sales", file: "hubspot.svg" },
  { name: "Meltwater", slug: "meltwater", category: "Sales", file: "" },

  { name: "OneDrive", slug: "onedrive", category: "Business and enterprise", file: "onedrive.svg" },
  { name: "Salesforce", slug: "salesforce", category: "Business and enterprise", file: "salesforce.svg" },
  { name: "SharePoint", slug: "sharepoint", category: "Business and enterprise", file: "sharepoint.svg" },
];

/* Pulled from the catalog upstream. Still resolves so old team files and
   forks keep rendering, but it is not an available connector. */
const RETIRED: CatalogEntry[] = [
  { name: "Slack", slug: "slack", category: "Productivity", file: "slack.svg" },
];

/* Names a team file may reasonably write, mapped to a catalog slug.
   "Calendar" is the one that matters: every existing team uses it. */
const ALIASES: Record<string, string> = {
  calendar: "google-calendar",
  googlecalendar: "google-calendar",
  gcal: "google-calendar",
  drive: "google-drive",
  googledrive: "google-drive",
  docs: "google-drive",
  sheets: "google-drive",
  slides: "google-drive",
  x: "x-ads",
  twitter: "x-ads",
  xads: "x-ads",
  bigquery: "google-cloud-bigquery",
  googlebigquery: "google-cloud-bigquery",
  teams: "microsoft-teams",
  msteams: "microsoft-teams",
  microsoftteams: "microsoft-teams",
  outlookmail: "outlook",
  onedrive: "onedrive",
  sharepoint: "sharepoint",
  ibkr: "interactive-brokers",
  interactivebrokers: "interactive-brokers",
  spglobal: "s-and-p-global",
  "s&p global": "s-and-p-global",
  heygen: "hyperframes",
  hyperframesbyheygen: "hyperframes",
};

export type ConnectorMark = {
  name: string;
  slug: string;
  src: string;
};

const BY_SLUG = new Map<string, CatalogEntry>();
for (const entry of [...CONNECTOR_CATALOG, ...RETIRED]) BY_SLUG.set(entry.slug, entry);

const BY_NAME = new Map<string, CatalogEntry>();
for (const entry of [...CONNECTOR_CATALOG, ...RETIRED]) {
  BY_NAME.set(connectorKey(entry.name), entry);
  BY_NAME.set(connectorKey(entry.name).replace(/\s+/g, ""), entry);
  BY_NAME.set(entry.slug, entry);
}

export function connectorKey(name: string): string {
  return name.trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
}

function lookup(name: string): CatalogEntry | undefined {
  const key = connectorKey(name);
  const tight = key.replace(/\s+/g, "");
  const aliased = ALIASES[key] ?? ALIASES[tight];
  if (aliased) return BY_SLUG.get(aliased);
  return BY_NAME.get(key) ?? BY_NAME.get(tight);
}

export function resolveConnector(name: string): ConnectorMark {
  const entry = lookup(name);
  if (entry) {
    return {
      // Catalog spelling wins, so "calendar" renders as "Google Calendar".
      name: entry.name,
      slug: entry.slug,
      src: entry.file ? `/connectors/${entry.file}` : "",
    };
  }
  // Unknown name: almost always a Bring Your Own MCP server. Keep it
  // visible with a monogram rather than dropping it silently.
  return { name, slug: connectorKey(name).replace(/\s+/g, "-"), src: "" };
}

export function resolveConnectors(names: string[]): ConnectorMark[] {
  const seen = new Set<string>();
  const out: ConnectorMark[] = [];
  for (const name of names) {
    const mark = resolveConnector(name);
    const id = mark.slug || mark.name.toLowerCase();
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(mark);
  }
  return out;
}

/** True when the name matches a currently available connector. */
export function isKnownConnector(name: string): boolean {
  const entry = lookup(name);
  return Boolean(entry) && CONNECTOR_CATALOG.includes(entry as CatalogEntry);
}

/** Catalog grouped for display, in the category order declared above. */
export function catalogByCategory(): { category: ConnectorCategory; entries: CatalogEntry[] }[] {
  const order: ConnectorCategory[] = [
    "Featured",
    "Advertising",
    "Analytics",
    "Developer",
    "Finance",
    "Productivity",
    "Sales",
    "Business and enterprise",
  ];
  return order
    .map((category) => ({ category, entries: CONNECTOR_CATALOG.filter((e) => e.category === category) }))
    .filter((group) => group.entries.length > 0);
}
