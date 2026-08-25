/*
 * Shareable catalog URLs. The home index and the connector finder both
 * keep their filters in the query string so a paste, a back button, and a
 * first paint all show the same shelf. Parsing lives here so the server
 * page and the client controls cannot drift.
 */

export type IndexKind = "team" | "bot" | "all";
export type IndexSort = "newest" | "name";

export type IndexQuery = {
  q: string;
  kind: IndexKind;
  category: string;
  integration: string;
  sort: IndexSort;
};

export type ConnectorFinderQuery = {
  q: string;
  category: string | null;
  builtin: boolean;
  all: boolean;
};

export function firstSearchParam(
  sp: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const value = sp[key];
  return Array.isArray(value) ? value[0] : value;
}

export function parseIndexQuery(sp: Record<string, string | string[] | undefined>): IndexQuery {
  const kindRaw = firstSearchParam(sp, "kind");
  return {
    q: firstSearchParam(sp, "q") ?? "",
    kind: kindRaw === "bot" ? "bot" : kindRaw === "all" ? "all" : "team",
    category: firstSearchParam(sp, "category") ?? firstSearchParam(sp, "section") ?? "all",
    integration: firstSearchParam(sp, "integration") ?? "all",
    sort: firstSearchParam(sp, "sort") === "name" ? "name" : "newest",
  };
}

export function indexQuerySearch(query: IndexQuery): string {
  const usp = new URLSearchParams();
  const q = query.q.trim();
  if (q) usp.set("q", q);
  if (query.kind !== "team") usp.set("kind", query.kind);
  if (query.category && query.category !== "all") usp.set("category", query.category);
  if (query.integration && query.integration !== "all") usp.set("integration", query.integration);
  if (query.sort === "name") usp.set("sort", "name");
  return usp.toString();
}

export function parseConnectorQuery(
  sp: Record<string, string | string[] | undefined>,
  categories: string[],
): ConnectorFinderQuery {
  const categoryRaw = firstSearchParam(sp, "category") ?? "";
  return {
    q: firstSearchParam(sp, "q") ?? "",
    category: categoryRaw && categories.includes(categoryRaw) ? categoryRaw : null,
    builtin: firstSearchParam(sp, "builtin") === "1",
    all: firstSearchParam(sp, "all") === "1",
  };
}

export function connectorQuerySearch(query: ConnectorFinderQuery): string {
  const usp = new URLSearchParams();
  const q = query.q.trim();
  if (q) {
    usp.set("q", q);
    return usp.toString();
  }
  if (query.category) usp.set("category", query.category);
  else if (query.builtin) usp.set("builtin", "1");
  else if (query.all) usp.set("all", "1");
  return usp.toString();
}
