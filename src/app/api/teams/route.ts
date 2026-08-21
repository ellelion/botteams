import { CORS_HEADERS, allApiTeams } from "@/lib/api-teams";
import { collectionRoute } from "@/lib/api-collection";

export const dynamic = "force-dynamic";

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

/* Teams only. A one-Bot recipe is a bot and lives at /api/bots. */
export const GET = collectionRoute("teams", allApiTeams);
