import {
  API_VERSION,
  applyFilters,
  clampLimit,
  jsonResponse,
  normalizeSort,
  type ApiTeam,
} from "@/lib/api-teams";
import { site } from "@/lib/site";

/*
 * One handler, two collections.
 *
 * /api/teams and /api/bots differ only in what they list and what the
 * links say. Writing the cursor logic twice is how the two would end up
 * disagreeing about what append-safe means.
 *
 * They never mix. A team is two to six Bots in one group chat; a bot is
 * one Bot with none. Returning a bot from /api/teams would be the same
 * lie the site just stopped telling on its own homepage.
 */
export function collectionRoute(path: "teams" | "bots", load: () => ApiTeam[]) {
  function selfUrl(params: URLSearchParams): string {
    const qs = params.toString();
    return `${site.url}/api/${path}${qs ? `?${qs}` : ""}`;
  }

  return function GET(request: Request) {
    const url = new URL(request.url);
    const p = url.searchParams;

    const cursorParam = p.get("cursor");
    const cursorMode = cursorParam !== null;
    const filters = {
      q: p.get("q"),
      category: p.get("category"),
      integration: p.get("integration"),
      sort: normalizeSort(p.get("sort"), cursorMode),
    };
    const limit = clampLimit(p.get("limit"));
    const matched = applyFilters(load(), filters);
    const key = path === "bots" ? "bots" : "teams";

    /*
     * Cursor sync is append-safe: it walks oldest first, so an item added
     * after a client's last sync always lands after their cursor and never
     * shifts a page underneath them. The cursor is the last slug seen.
     */
    if (cursorMode) {
      const start =
        cursorParam === "start" || cursorParam === ""
          ? 0
          : matched.findIndex((t) => t.slug === cursorParam) + 1;
      if (cursorParam !== "start" && cursorParam !== "" && start === 0) {
        /* A cursor we cannot place means the client's sync position is not
           trustworthy, which is their problem to handle, not a 200 with an
           error hidden in the body. */
        return jsonResponse({ version: API_VERSION, error: "Unknown cursor", cursor: cursorParam }, 0, 400);
      }
      const slice = matched.slice(start, start + limit);
      const hasMore = start + slice.length < matched.length;
      const nextCursor = hasMore && slice.length ? slice[slice.length - 1].slug : null;
      const nextParams = new URLSearchParams(p);
      if (nextCursor) nextParams.set("cursor", nextCursor);
      return jsonResponse({
        version: API_VERSION,
        [key]: slice,
        sync: { returned: slice.length, hasMore, nextCursor },
        filters,
        links: { self: selfUrl(p), next: hasMore ? selfUrl(nextParams) : null, previous: null },
      });
    }

    const page = Math.max(1, Number.parseInt(p.get("page") ?? "1", 10) || 1);
    const total = matched.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const slice = matched.slice((page - 1) * limit, page * limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    const nextParams = new URLSearchParams(p);
    nextParams.set("page", String(page + 1));
    const prevParams = new URLSearchParams(p);
    prevParams.set("page", String(page - 1));

    return jsonResponse({
      version: API_VERSION,
      [key]: slice,
      pagination: { page, limit, total, totalPages, hasNext, hasPrevious },
      filters,
      links: {
        self: selfUrl(p),
        next: hasNext ? selfUrl(nextParams) : null,
        previous: hasPrevious ? selfUrl(prevParams) : null,
      },
    });
  };
}
