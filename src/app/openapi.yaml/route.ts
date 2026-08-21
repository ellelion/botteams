import { CORS_HEADERS } from "@/lib/api-teams";
import { buildOpenApiDocument } from "@/lib/openapi";

export const dynamic = "force-static";

/* A small emitter rather than a dependency. The document is plain JSON
   values, so the cases are: map, list, string, number, boolean, null. */
function yaml(value: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);
  if (value === null) return "null";
  if (typeof value === "boolean" || typeof value === "number") return String(value);
  if (typeof value === "string") {
    if (value.includes("\n")) {
      /* Block scalar keeps multi-line descriptions readable instead of
         collapsing them into one escaped line. */
      return `|-\n${value.split("\n").map((line) => `${pad}  ${line}`).join("\n")}`;
    }
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    return value
      .map((item) => {
        const rendered = yaml(item, indent + 1);
        const inline = typeof item !== "object" || item === null;
        return inline ? `\n${pad}- ${rendered}` : `\n${pad}- ${rendered.replace(/^\s+/, "")}`;
      })
      .join("");
  }
  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length === 0) return "{}";
  return entries
    .map(([key, item]) => {
      const rendered = yaml(item, indent + 1);
      const scalar = item === null || typeof item !== "object";
      const k = /^[A-Za-z_][A-Za-z0-9_.-]*$/.test(key) ? key : JSON.stringify(key);
      if (scalar) return `\n${pad}${k}: ${rendered}`;
      if (Array.isArray(item) && item.length === 0) return `\n${pad}${k}: []`;
      return `\n${pad}${k}:${rendered}`;
    })
    .join("");
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export function GET() {
  const body = `${yaml(buildOpenApiDocument()).replace(/^\n/, "")}\n`;
  return new Response(body, {
    headers: {
      "Content-Type": "application/yaml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      ...CORS_HEADERS,
    },
  });
}
