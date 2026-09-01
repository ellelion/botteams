import { Pool } from "pg";

/*
 * Postgres on the Ellelion VPS (Docker service `postgres-main-xlrgse`, database
 * `neondb` — both names are historical, kept so DATABASE_URL did not have to
 * change during the move). Table names are prefixed grokbotteams_ (also
 * historical), so we never write into Agent Plugins Directory tables.
 * Public name of the product is botteams.io.
 *
 * Driver, 2026-09-01: this used `@neondatabase/serverless`, whose `neon()`
 * speaks HTTP to a Neon endpoint. When the app moved off Vercel, DATABASE_URL
 * became a plain Postgres TCP address, so every query failed with
 * "NeonDbError: Error connecting to database: fetch failed" — invisible from
 * outside, because the public pages are static and only checkout, the Stripe
 * webhook, the rail inventory and the x-mentions cron touch the database.
 * `pg` is the same driver avivit and growsocialelion already use.
 *
 * The tagged-template signature is deliberately unchanged: all 44 call sites
 * keep writing db()`SELECT ... ${value}`, and interpolated values still become
 * bound parameters ($1, $2, ...) rather than string-concatenated SQL.
 *
 * Lazy: next build must succeed without DATABASE_URL. A missing URL is
 * a 503 at request time, not a crash at import.
 */

export type SqlQuery = <T = Record<string, unknown>>(
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<T[]>;

let pool: Pool | null = null;

export function databaseUrl(): string | undefined {
  const value = process.env.DATABASE_URL;
  return value && value.length > 0 ? value : undefined;
}

function getPool(url: string): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: url,
      // One Postgres serves skillselion, avivit and growsocialelion too
      // (max_connections = 100), so this app stays a well-behaved neighbour.
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });
    // A pool that emits 'error' with no listener takes the process down when a
    // backend closes an idle connection. Log and let pg reconnect instead.
    pool.on("error", (error) => {
      console.error("[db] idle client error", error);
    });
  }
  return pool;
}

export function db(): SqlQuery {
  const url = databaseUrl();
  if (!url) throw new Error("DATABASE_URL is not set");
  const active = getPool(url);
  return async <T = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T[]> => {
    const text = strings.reduce(
      (acc, part, index) => acc + part + (index < values.length ? `$${index + 1}` : ""),
      "",
    );
    const result = await active.query(text, values);
    return result.rows as T[];
  };
}
