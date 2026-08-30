import { DEFAULT_LIMIT, MAX_LIMIT, type ApiTeam, type Filters } from "@/lib/api-teams";
import { site } from "@/lib/site";

/*
 * The machine contract for GET /api/teams.
 *
 * It is built from the same types the route returns, not typed out beside
 * them. TEAM_PROPERTIES is a Record keyed by `keyof ApiTeam`, so adding a
 * field to the response without describing it here fails the type check
 * rather than shipping a spec that quietly lies. Same for the filter echo.
 *
 * The prose contract at /api reads its parameter table out of PARAMS
 * below, so the page a human reads and the document a client generates
 * from cannot drift apart either.
 */

type Schema = Record<string, unknown>;

const str = (description: string): Schema => ({ type: "string", description });
const nullableStr = (description: string): Schema => ({ type: ["string", "null"], description });

const TEAM_PROPERTIES: Record<keyof ApiTeam, Schema> = {
  slug: str("Stable identifier. Matches the filename under teams/ and the last path segment of detailUrl."),
  name: str("Display name of the team."),
  tagline: str("One line saying what the team does."),
  bullets: { type: "array", items: { type: "string" }, description: "Listing-card lede. Teams have one short line per Bot. A solo Bot without a list repeats the tagline as a single item." },
  category: str("Section the team files under, and the value the category filter matches."),
  kind: { type: "string", enum: ["bot", "team"], description: "bot is one Bot doing one job with no group chat. team is two to six Bots in one group chat. The two never appear in the same collection." },
  status: { type: "string", enum: ["installable", "example"], description: "installable is a recipe to use. example is a format demonstration." },
  fromXai: { type: "boolean", description: "True when the recipe is our write-up of a job published in xAI's own Grok Bot use-case gallery. Sourcing, not endorsement: xAI does not review or certify anything on this directory." },
  featured: { type: "boolean", description: "True when this team is pinned first on the public index." },
  bots: { type: "integer", minimum: 1, description: "Number of Bots. Always equal to botRoster.length, and always 1 on a bot." },
  addedAt: { type: ["string", "null"], format: "date-time", description: "Date stated in the team file. Never inferred. Null when the file does not state one, and those sort last." },
  connectors: { type: "array", items: { type: "string" }, description: "Connectors the account must already have. Connectors are account-wide in Grok Bot." },
  botRoster: {
    type: "array",
    description: "The Bots this team creates. One entry per Bot.",
    items: {
      type: "object",
      required: ["name", "persona", "connectors"],
      properties: {
        name: str("Bot name, used exactly."),
        persona: str("The Bot's job, in a sentence."),
        connectors: { type: "array", items: { type: "string" }, description: "Which connectors this Bot is expected to use. Not a permission: every Bot on an account can reach every connected tool." },
      },
    },
  },
  rooms: {
    type: "array",
    description: "Group chats. A group chat holds two to six Bots. A bot has none, so this is empty on every item from /api/bots.",
    items: {
      type: "object",
      required: ["name", "members"],
      properties: {
        name: str("Group chat name."),
        members: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 6, description: "Bot names in the group chat." },
      },
    },
  },
  routines: {
    type: "array",
    description: "Standing routines. Each is owned by one Bot and needs a human to confirm the save.",
    items: {
      type: "object",
      required: ["name", "owner", "schedule", "prompt"],
      properties: {
        name: str("Routine name."),
        owner: str("Bot that owns it."),
        schedule: str("When it runs, in words."),
        prompt: str("The prompt a human confirms."),
      },
    },
  },
  installer: str("The full installer prompt, ready to paste into Grok Bot. This is the product: a client never has to scrape the site for it."),
  contributor: nullableStr("Handle of whoever contributed the team."),
  contributorUrl: nullableStr("Profile URL for the contributor."),
  scoutedBy: nullableStr("Who found the team, when that is not the contributor."),
  sourceUrl: nullableStr("The post the team was based on."),
  url: nullableStr("Canonical homepage for the team, when it has one."),
  detailUrl: str("Page for this team on the directory."),
};

/* Every filter the route echoes back, keyed so a new filter cannot be
   added to the route without being described. */
const FILTER_PROPERTIES: Record<keyof Filters, Schema> = {
  q: nullableStr("The free text that was applied, or null."),
  category: nullableStr("The category that was applied, or null."),
  integration: nullableStr("The connector that was applied, or null."),
  sort: str("The sort actually used. Cursor mode always reports oldest."),
};

export type ApiParam = { name: string; description: string; schema: Schema };

/* One list, read by the spec and by the human page at /api. */
export const PARAMS: ApiParam[] = [
  { name: "q", description: "Free text. Matches name, tagline, bullets, category, slug, connector, Bot name, contributor, and the installer prompt.", schema: { type: "string" } },
  { name: "category", description: "Exact category, case-insensitive. One of the sections listed on the directory.", schema: { type: "string" } },
  { name: "integration", description: "Exact connector, case-insensitive and alias-aware. Calendar and Google Calendar match the same teams.", schema: { type: "string" } },
  { name: "page", description: "Page number, 1-based. Ignored in cursor mode.", schema: { type: "integer", minimum: 1, default: 1 } },
  { name: "limit", description: `Teams per page. Values outside the range clamp rather than error.`, schema: { type: "integer", minimum: 1, maximum: MAX_LIMIT, default: DEFAULT_LIMIT } },
  { name: "sort", description: "Ordering. Ignored in cursor mode, which is always oldest first.", schema: { type: "string", enum: ["newest", "name"], default: "newest" } },
  { name: "cursor", description: "Pass start to begin an append-safe sync, then follow sync.nextCursor. Switches the response envelope from pagination to sync.", schema: { type: "string" } },
];

const LINKS: Schema = {
  type: "object",
  required: ["self", "next", "previous"],
  properties: {
    self: str("This request."),
    next: nullableStr("Next page, or null at the end."),
    previous: nullableStr("Previous page, or null at the start. Always null in cursor mode."),
  },
};

/* The two collections are the same operation over different shelves, so
   the path object is generated rather than typed out twice. */
function collectionPath(kind: "teams" | "bots") {
  const one = kind === "teams" ? "team" : "bot";
  const Envelope = kind === "teams" ? "Team" : "Bot";
  return {
    get: {
      operationId: kind === "teams" ? "listTeams" : "listBots",
      summary: kind === "teams" ? "List teams" : "List bots",
      description:
        (kind === "teams"
          ? "Teams only: two to six Bots in one group chat. A one-Bot recipe is a bot and is never returned here. "
          : "Bots only: one Bot doing one job, with no group chat. A team is never returned here. ") +
        `Filtered and paginated. Passing cursor switches to append-safe sync mode, which walks oldest first so a ${one} added after your last sync always lands after your cursor.`,
      parameters: PARAMS.map((p) => ({
        name: p.name,
        in: "query",
        required: false,
        description: p.description,
        schema: p.schema,
      })),
      responses: {
        "200": {
          description: `A page of ${kind}. The envelope carries pagination, or sync when cursor was passed.`,
          content: {
            "application/json": {
              schema: {
                oneOf: [
                  { $ref: `#/components/schemas/${Envelope}Page` },
                  { $ref: `#/components/schemas/${Envelope}Sync` },
                ],
              },
            },
          },
        },
        "400": {
          description: `The cursor did not match any ${one}, so the sync position cannot be trusted. Start again from cursor=start.`,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
        },
      },
    },
  };
}

/* Page and sync envelopes, per collection. The item key is the plural
   noun, so a client can tell at a glance which shelf it asked for. */
function envelopes(kind: "teams" | "bots") {
  const Name = kind === "teams" ? "Team" : "Bot";
  return {
    [`${Name}Page`]: {
      type: "object",
      description: `Page envelope for /api/${kind}. Returned when cursor was not passed.`,
      required: ["version", kind, "pagination", "filters", "links"],
      properties: {
        version: { type: "integer", description: "Envelope version. Bumped only for a breaking change." },
        [kind]: { type: "array", items: { $ref: `#/components/schemas/${Name}` } },
        pagination: {
          type: "object",
          required: ["page", "limit", "total", "totalPages", "hasNext", "hasPrevious"],
          properties: {
            page: { type: "integer" },
            limit: { type: "integer" },
            total: { type: "integer", description: "Items matching the filters, across all pages." },
            totalPages: { type: "integer" },
            hasNext: { type: "boolean" },
            hasPrevious: { type: "boolean" },
          },
        },
        filters: { $ref: "#/components/schemas/Filters" },
        links: { $ref: "#/components/schemas/Links" },
      },
    },
    [`${Name}Sync`]: {
      type: "object",
      description: `Sync envelope for /api/${kind}. Returned when cursor was passed.`,
      required: ["version", kind, "sync", "filters", "links"],
      properties: {
        version: { type: "integer" },
        [kind]: { type: "array", items: { $ref: `#/components/schemas/${Name}` } },
        sync: {
          type: "object",
          required: ["returned", "hasMore", "nextCursor"],
          properties: {
            returned: { type: "integer", description: "Items in this response." },
            hasMore: { type: "boolean" },
            nextCursor: { type: ["string", "null"], description: "Pass as cursor on the next call. Null at the end." },
          },
        },
        filters: { $ref: "#/components/schemas/Filters" },
        links: { $ref: "#/components/schemas/Links" },
      },
    },
  };
}

export function buildOpenApiDocument(): Record<string, unknown> {
  return {
    openapi: "3.1.0",
    info: {
      title: `${site.name} API`,
      version: "2.0.0",
      summary: "Read the public directory of Grok Bot teams as JSON.",
      description: [
        "A team is a recipe, not a bot: named Bots, one group chat where the recipe has one, standing routines, and the connectors the account needs first.",
        "",
        "No key, no account, no auth. CORS is open, so any HTTP client can call this directly.",
        "",
        "There is no per-team endpoint by design. /api/teams/<slug> returns 404. Filter the collection instead.",
        "",
        "Connectors in Grok Bot are account-wide. Nothing in this payload is a permission boundary.",
      ].join("\n"),
      contact: { name: site.company, email: site.email, url: site.url },
      license: { name: "MIT", identifier: "MIT" },
    },
    servers: [{ url: site.url, description: "Production" }],
    /* An empty list is the spec's way of saying no authentication, which
       is the truth here. Omitting it entirely reads as an oversight. */
    security: [],
    paths: {
      "/api/teams": collectionPath("teams"),
      "/api/bots": collectionPath("bots"),
    },
    components: {
      schemas: {
        Team: {
          type: "object",
          description: "A team: two to six Bots in one group chat.",
          required: Object.keys(TEAM_PROPERTIES),
          properties: { ...TEAM_PROPERTIES, kind: { const: "team", description: "Always team on this collection." } },
        },
        Bot: {
          type: "object",
          description: "A bot: one Bot doing one job, with no group chat. Never Verified, because Verified is a claim about a group chat.",
          required: Object.keys(TEAM_PROPERTIES),
          properties: {
            ...TEAM_PROPERTIES,
            kind: { const: "bot", description: "Always bot on this collection." },
            bots: { const: 1, description: "A bot is one Bot." },
            rooms: { type: "array", maxItems: 0, description: "Always empty. A bot has no group chat." },
          },
        },
        Filters: {
          type: "object",
          description: "The filters the server actually applied, echoed back.",
          required: Object.keys(FILTER_PROPERTIES),
          properties: FILTER_PROPERTIES,
        },
        Links: LINKS,
        ...envelopes("teams"),
        ...envelopes("bots"),
        Error: {
          type: "object",
          required: ["version", "error", "cursor"],
          properties: {
            version: { type: "integer" },
            error: str("What went wrong, in words."),
            cursor: nullableStr("The cursor that was rejected."),
          },
        },
      },
    },
  };
}
