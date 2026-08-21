import { CORS_HEADERS, allApiBots } from "@/lib/api-teams";
import { collectionRoute } from "@/lib/api-collection";

export const dynamic = "force-dynamic";

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

/* Bots only. Same filters, same cursor contract, different shelf. */
export const GET = collectionRoute("bots", allApiBots);
