import { generateObject } from "ai";
import { z } from "zod";

/*
 * Closed checklist. The model may only return these keys. Anything else
 * is dropped before the buyer sees it.
 */

export const REJECT_KEYS = [
  "not_a_tool",
  "competing_directory",
  "crypto_or_signals",
  "lead_gen",
  "bad_url",
  "title_too_long",
  "line_too_long",
  "image_not_a_mark",
  "copy_not_plain",
  "missing_field",
] as const;

export type RejectKey = (typeof REJECT_KEYS)[number];

export const REJECT_COPY: Record<RejectKey, string> = {
  not_a_tool: "This has to be a real tool a Grok Bot could use, not a general ad.",
  competing_directory: "We do not take competing Grok Bot team or Bot directories.",
  crypto_or_signals: "No crypto, and no trading signals.",
  lead_gen: "No lead-generation.",
  bad_url: "Use a public URL, not a shortener.",
  title_too_long: "Title must be 28 characters or fewer.",
  line_too_long: "The short description must be 52 characters or fewer.",
  image_not_a_mark: "Upload a simple mark, not a screenshot, a photo, or a stock ad.",
  copy_not_plain: "Keep the wording as plain as the rest of the directory.",
  missing_field: "Title, short description, destination URL, and a mark are all required.",
};

export const reviewSchema = z.object({
  ok: z.boolean(),
  reasons: z.array(z.enum(REJECT_KEYS)),
});

export type ReviewResult = { ok: boolean; reasons: RejectKey[] };

export const RAIL_REVIEW_MODEL = "openai/gpt-5.6-sol";

const SHORTENERS = new Set([
  "bit.ly",
  "t.co",
  "tinyurl.com",
  "ow.ly",
  "is.gd",
  "buff.ly",
  "cutt.ly",
  "rebrand.ly",
  "lnkd.in",
  "rb.gy",
  "shorturl.at",
  "tiny.cc",
]);

export function buyerReasons(reasons: RejectKey[]): string[] {
  return reasons.map((key) => REJECT_COPY[key]);
}

export type SetupField = "title" | "line" | "href" | "image";

const COPY_TO_KEY = new Map<string, RejectKey>(
  (Object.entries(REJECT_COPY) as [RejectKey, string][]).map(([key, copy]) => [copy, key]),
);

const FIELD_FOR_REASON: Record<RejectKey, SetupField[]> = {
  title_too_long: ["title"],
  line_too_long: ["line"],
  bad_url: ["href"],
  image_not_a_mark: ["image"],
  missing_field: ["title", "line", "href", "image"],
  copy_not_plain: ["title", "line"],
  not_a_tool: [],
  competing_directory: [],
  crypto_or_signals: [],
  lead_gen: [],
};

export function fieldsForBuyerReasons(reasons: string[]): Set<SetupField> {
  const fields = new Set<SetupField>();
  for (const text of reasons) {
    const key = COPY_TO_KEY.get(text);
    if (!key) continue;
    for (const field of FIELD_FOR_REASON[key]) fields.add(field);
  }
  return fields;
}

export function buyerReasonForField(reasons: string[], field: SetupField): string | undefined {
  for (const text of reasons) {
    const key = COPY_TO_KEY.get(text);
    if (!key) continue;
    const mapped = FIELD_FOR_REASON[key];
    if (mapped.length === 1 && mapped[0] === field) return text;
  }
  return undefined;
}

export function filterRejectKeys(values: unknown): RejectKey[] {
  if (!Array.isArray(values)) return [];
  const allowed = new Set<string>(REJECT_KEYS);
  const out: RejectKey[] = [];
  for (const value of values) {
    if (typeof value === "string" && allowed.has(value) && !out.includes(value as RejectKey)) {
      out.push(value as RejectKey);
    }
  }
  return out;
}

export function normalizeReview(raw: { ok: boolean; reasons: RejectKey[] }): ReviewResult {
  const reasons = filterRejectKeys(raw.reasons);
  if (raw.ok && reasons.length === 0) return { ok: true, reasons: [] };
  if (raw.ok && reasons.length > 0) return { ok: false, reasons };
  if (!raw.ok && reasons.length === 0) return { ok: false, reasons: ["copy_not_plain"] };
  return { ok: false, reasons };
}

export const TITLE_MAX = 28;
export const LINE_MAX = 52;
export const HREF_MAX = 2048;

export type SetupFields = {
  title: string;
  line: string;
  href: string;
};

/** Cheap closed-list checks. These do not count as an AI review. */
export function deterministicRejects(fields: SetupFields, hasImage: boolean): RejectKey[] {
  const reasons: RejectKey[] = [];
  const title = fields.title.trim();
  const line = fields.line.trim();
  const href = fields.href.trim();
  if (!title || !line || !href || !hasImage) reasons.push("missing_field");
  if (title.length > TITLE_MAX) reasons.push("title_too_long");
  if (line.length > LINE_MAX) reasons.push("line_too_long");
  if (href.length > HREF_MAX) reasons.push("bad_url");
  const urlReason = urlReject(href);
  if (href && urlReason) reasons.push(urlReason);
  return unique(reasons);
}

function unique(keys: RejectKey[]): RejectKey[] {
  return [...new Set(keys)];
}

export function normalizeHref(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function urlReject(raw: string): RejectKey | null {
  if (raw.length > HREF_MAX) return "bad_url";
  let url: URL;
  try {
    url = new URL(normalizeHref(raw));
  } catch {
    return "bad_url";
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return "bad_url";
  if (url.username || url.password) return "bad_url";
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host === "127.0.0.1") return "bad_url";
  if (SHORTENERS.has(host) || [...SHORTENERS].some((s) => host.endsWith(`.${s}`))) return "bad_url";
  return null;
}

export type ReviewInput = SetupFields & {
  markBytes: Uint8Array;
  markMediaType: "image/png" | "image/jpeg" | "image/webp";
};

function buildPrompt(input: ReviewInput): string {
  return [
    "You review one paid side-rail listing for botteams.ai.",
    "Return only the structured object. No prose.",
    "ok is true only when every check passes. reasons is empty if and only if ok is true.",
    "Use only these reject keys: " + REJECT_KEYS.join(", ") + ".",
    "Do not invent keys.",
    "",
    "A catalog of skills, MCP, APIs, or agent products counts as a tool. Only reject not_a_tool for unrelated consumer ads (shoes, food, generic SaaS with no agent use). Skillselion, Agent Plugins Directory, and similar operator tools pass.",
    "Reject competing Grok Bot team or Bot directories (competing_directory).",
    "Reject crypto, trading signals (crypto_or_signals), and lead-generation (lead_gen).",
    "Destination must be a public http or https URL, not a shortener (bad_url). A host without a scheme is fine.",
    "Title max 28. Line max 52. Use copy_not_plain only for spam, all-caps shouting, or emoji stuffing. Normal product names and one-liners pass.",
    "The image must be a simple mark. Reject landing screenshots, person photos, and watermarked stock ads (image_not_a_mark).",
    "",
    `Title (${input.title.length} chars): ${input.title}`,
    `Line (${input.line.length} chars): ${input.line}`,
    `URL: ${input.href}`,
    "Mark: attached image.",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function reviewListing(input: ReviewInput): Promise<ReviewResult> {
  const content: Array<
    | { type: "text"; text: string }
    | { type: "image"; image: Uint8Array; mediaType: string }
  > = [{ type: "text", text: buildPrompt(input) }];

  content.push({ type: "image", image: input.markBytes, mediaType: input.markMediaType });

  const { object } = await generateObject({
    model: RAIL_REVIEW_MODEL,
    schema: reviewSchema,
    messages: [{ role: "user", content }],
  });

  return normalizeReview(object);
}
