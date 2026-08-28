import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

/*
 * Shared Ellelion Neon. Table names are prefixed grokbotteams_ (historical).
 * Public name of the product is botteams.io.
 * so we never write into Agent Plugins Directory application tables.
 *
 * Lazy: next build must succeed without DATABASE_URL. A missing URL is
 * a 503 at request time, not a crash at import.
 */

let sql: NeonQueryFunction<false, false> | null = null;

export function databaseUrl(): string | undefined {
  const value = process.env.DATABASE_URL;
  return value && value.length > 0 ? value : undefined;
}

export function db(): NeonQueryFunction<false, false> {
  const url = databaseUrl();
  if (!url) throw new Error("DATABASE_URL is not set");
  if (!sql) sql = neon(url);
  return sql;
}
