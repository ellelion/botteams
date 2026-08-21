import { CORS_HEADERS } from "@/lib/api-teams";
import { buildOpenApiDocument } from "@/lib/openapi";

export const dynamic = "force-static";

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

/* Same open CORS as /api/teams: a client that can call the API can read
   the contract for it without a proxy. */
export function GET() {
  return new Response(JSON.stringify(buildOpenApiDocument(), null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      ...CORS_HEADERS,
    },
  });
}
