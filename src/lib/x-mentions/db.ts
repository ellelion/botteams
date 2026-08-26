import { db } from "@/lib/db";
import type { MentionRow, StoredRecipe, XPost } from "@/lib/x-mentions/types";

type RawMentionRow = {
  mention_id: string;
  author_id: string;
  author_username: string;
  text: string;
  status: string;
  attempts: number;
  pr_number: number | null;
  pr_url: string | null;
  recipes: unknown;
};

function storedRecipes(value: unknown): StoredRecipe[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is StoredRecipe => {
    if (!item || typeof item !== "object") return false;
    const row = item as Partial<StoredRecipe>;
    return (
      typeof row.slug === "string" &&
      typeof row.name === "string" &&
      (row.kind === "bot" || row.kind === "team") &&
      (row.tagline === undefined || typeof row.tagline === "string") &&
      typeof row.url === "string" &&
      (row.outcome === "added" || row.outcome === "existing")
    );
  });
}

function asMention(row: RawMentionRow): MentionRow {
  return {
    mentionId: row.mention_id,
    authorId: row.author_id,
    authorUsername: row.author_username,
    text: row.text,
    status: row.status,
    attempts: row.attempts,
    prNumber: row.pr_number,
    prUrl: row.pr_url,
    recipes: storedRecipes(row.recipes),
  };
}

export async function ensureMentionTables(): Promise<void> {
  await db()`
    CREATE TABLE IF NOT EXISTS grokbotteams_x_state (
      key text PRIMARY KEY,
      value text NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await db()`
    CREATE TABLE IF NOT EXISTS grokbotteams_x_mentions (
      mention_id text PRIMARY KEY,
      author_id text NOT NULL,
      author_username text NOT NULL,
      text text NOT NULL,
      status text NOT NULL DEFAULT 'queued' CONSTRAINT grokbotteams_x_mentions_status_check CHECK (status IN (
        'queued', 'processing', 'pr_open', 'waiting_for_deploy', 'reply_error',
        'replied', 'duplicate', 'reply_suppressed', 'ignored', 'error',
        'needs_human', 'closed'
      )),
      attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
      pr_number integer,
      pr_url text,
      recipes jsonb NOT NULL DEFAULT '[]'::jsonb,
      reply_post_id text,
      error text,
      post_created_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await db()`
    DO $migration$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'grokbotteams_x_mentions_status_check'
          AND conrelid = 'grokbotteams_x_mentions'::regclass
          AND position('reply_suppressed' IN pg_get_constraintdef(oid)) = 0
      ) THEN
        ALTER TABLE grokbotteams_x_mentions
          DROP CONSTRAINT grokbotteams_x_mentions_status_check;
        ALTER TABLE grokbotteams_x_mentions
          ADD CONSTRAINT grokbotteams_x_mentions_status_check CHECK (status IN (
            'queued', 'processing', 'pr_open', 'waiting_for_deploy', 'reply_error',
            'replied', 'duplicate', 'reply_suppressed', 'ignored', 'error',
            'needs_human', 'closed'
          ));
      END IF;
    END
    $migration$
  `;
  await db()`
    CREATE INDEX IF NOT EXISTS grokbotteams_x_mentions_work_idx
    ON grokbotteams_x_mentions (post_created_at, created_at)
    WHERE status IN ('queued', 'error') AND attempts < 3
  `;
  await db()`
    CREATE INDEX IF NOT EXISTS grokbotteams_x_mentions_pending_idx
    ON grokbotteams_x_mentions (updated_at)
    WHERE status IN ('pr_open', 'waiting_for_deploy', 'reply_error') AND pr_number IS NOT NULL
  `;
  await db()`
    CREATE INDEX IF NOT EXISTS grokbotteams_x_mentions_recipes_idx
    ON grokbotteams_x_mentions USING gin (recipes jsonb_path_ops)
  `;
  await db()`
    ALTER TABLE grokbotteams_x_mentions
    ADD COLUMN IF NOT EXISTS url_reply_budget_day date
  `;
  await db()`
    ALTER TABLE grokbotteams_x_mentions
    ADD COLUMN IF NOT EXISTS reply_budget_day date
  `;
  await db()`
    ALTER TABLE grokbotteams_x_mentions
    ADD COLUMN IF NOT EXISTS reply_attempted_at timestamptz
  `;
  await db()`
    ALTER TABLE grokbotteams_x_mentions
    ADD COLUMN IF NOT EXISTS reply_failures integer NOT NULL DEFAULT 0
      CHECK (reply_failures >= 0)
  `;
  await db()`
    CREATE TABLE IF NOT EXISTS grokbotteams_x_url_reply_budget (
      budget_day date PRIMARY KEY,
      reserved_count integer NOT NULL DEFAULT 0 CHECK (reserved_count >= 0),
      total_reserved_count integer NOT NULL DEFAULT 0 CHECK (total_reserved_count >= 0),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await db()`
    ALTER TABLE grokbotteams_x_url_reply_budget
    ADD COLUMN IF NOT EXISTS total_reserved_count integer NOT NULL DEFAULT 0
      CHECK (total_reserved_count >= 0)
  `;
}

export async function getMentionCursor(): Promise<string | null> {
  const rows = (await db()`
    SELECT value FROM grokbotteams_x_state WHERE key = 'mentions_since_id' LIMIT 1
  `) as { value: string }[];
  return rows[0]?.value ?? null;
}

export async function setMentionCursor(value: string): Promise<void> {
  await db()`
    INSERT INTO grokbotteams_x_state (key, value)
    VALUES ('mentions_since_id', ${value})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
  `;
}

export async function ingestMentions(posts: XPost[]): Promise<number> {
  let inserted = 0;
  for (const post of posts) {
    const rows = (await db()`
      INSERT INTO grokbotteams_x_mentions (
        mention_id, author_id, author_username, text, post_created_at
      )
      VALUES (
        ${post.id}, ${post.authorId}, ${post.authorUsername}, ${post.text},
        ${post.createdAt ?? null}
      )
      ON CONFLICT (mention_id) DO NOTHING
      RETURNING mention_id
    `) as { mention_id: string }[];
    inserted += rows.length;
  }
  return inserted;
}

export async function releaseStaleClaims(): Promise<void> {
  await db()`
    UPDATE grokbotteams_x_mentions
    SET status = CASE WHEN attempts >= 3 THEN 'needs_human' ELSE 'error' END,
        error = COALESCE(error, 'worker stopped before completing'),
        updated_at = now()
    WHERE status = 'processing'
      AND updated_at < now() - interval '15 minutes'
  `;
}

export async function claimNextMention(): Promise<MentionRow | null> {
  const rows = (await db()`
    UPDATE grokbotteams_x_mentions
    SET status = 'processing', attempts = attempts + 1, error = NULL, updated_at = now()
    WHERE mention_id = (
      SELECT mention_id
      FROM grokbotteams_x_mentions
      WHERE status IN ('queued', 'error') AND attempts < 3
      ORDER BY post_created_at ASC NULLS LAST, created_at ASC
      LIMIT 1
      FOR UPDATE SKIP LOCKED
    )
    RETURNING mention_id, author_id, author_username, text, status, attempts,
              pr_number, pr_url, recipes
  `) as RawMentionRow[];
  return rows[0] ? asMention(rows[0]) : null;
}

export async function markMentionIgnored(mentionId: string, reason: string): Promise<void> {
  await db()`
    UPDATE grokbotteams_x_mentions
    SET status = 'ignored', error = ${reason}, updated_at = now()
    WHERE mention_id = ${mentionId}
  `;
}

export async function markMentionError(mentionId: string, message: string): Promise<void> {
  await db()`
    UPDATE grokbotteams_x_mentions
    SET status = CASE WHEN attempts >= 3 THEN 'needs_human' ELSE 'error' END,
        error = ${message.slice(0, 1000)}, updated_at = now()
    WHERE mention_id = ${mentionId}
  `;
}

export async function markMentionPrOpen(
  mentionId: string,
  prNumber: number,
  prUrl: string,
  recipes: StoredRecipe[],
): Promise<void> {
  await db()`
    UPDATE grokbotteams_x_mentions
    SET status = 'pr_open', pr_number = ${prNumber}, pr_url = ${prUrl},
        reply_failures = 0,
        recipes = ${JSON.stringify(recipes)}::jsonb, error = NULL, updated_at = now()
    WHERE mention_id = ${mentionId}
  `;
}

export async function markMentionWaitingForDeploy(mentionId: string): Promise<void> {
  await db()`
    UPDATE grokbotteams_x_mentions
    SET status = 'waiting_for_deploy', reply_failures = 0, updated_at = now()
    WHERE mention_id = ${mentionId}
  `;
}

export async function markMentionClosed(mentionId: string): Promise<void> {
  await db()`
    UPDATE grokbotteams_x_mentions
    SET status = 'closed', updated_at = now()
    WHERE mention_id = ${mentionId}
  `;
}

export async function markMentionReplied(
  mentionId: string,
  replyPostId: string,
  recipes: StoredRecipe[],
  duplicate = false,
): Promise<void> {
  await db()`
    UPDATE grokbotteams_x_mentions
    SET status = ${duplicate ? "duplicate" : "replied"}, reply_post_id = ${replyPostId},
        recipes = ${JSON.stringify(recipes)}::jsonb, error = NULL, updated_at = now()
    WHERE mention_id = ${mentionId}
  `;
}

export async function markReplyError(mentionId: string, message: string): Promise<void> {
  await db()`
    UPDATE grokbotteams_x_mentions
    SET reply_failures = reply_failures + 1,
        status = CASE WHEN reply_failures + 1 >= 3 THEN 'needs_human' ELSE 'reply_error' END,
        error = ${message.slice(0, 1000)}, updated_at = now()
    WHERE mention_id = ${mentionId}
      AND status NOT IN ('replied', 'duplicate')
  `;
}

export async function replaceMentionRecipes(
  mentionId: string,
  recipes: StoredRecipe[],
): Promise<void> {
  await db()`
    UPDATE grokbotteams_x_mentions
    SET recipes = ${JSON.stringify(recipes)}::jsonb, updated_at = now()
    WHERE mention_id = ${mentionId}
  `;
}

export async function markMentionReplySuppressed(
  mentionId: string,
  recipes: StoredRecipe[],
  reason = "daily reply cap reached",
): Promise<void> {
  await db()`
    UPDATE grokbotteams_x_mentions
    SET status = 'reply_suppressed', recipes = ${JSON.stringify(recipes)}::jsonb,
        error = ${reason}, updated_at = now()
    WHERE mention_id = ${mentionId}
      AND status NOT IN ('replied', 'duplicate')
  `;
}

export async function listPendingPullRequests(): Promise<MentionRow[]> {
  const rows = (await db()`
    SELECT mention_id, author_id, author_username, text, status, attempts,
           pr_number, pr_url, recipes
    FROM grokbotteams_x_mentions
    WHERE status IN ('pr_open', 'waiting_for_deploy', 'reply_error')
      AND pr_number IS NOT NULL
    ORDER BY updated_at ASC
    LIMIT 20
  `) as RawMentionRow[];
  return rows.map(asMention);
}

export async function findSubmissionBySlug(slug: string, excludeMentionId: string): Promise<MentionRow | null> {
  const rows = (await db()`
    SELECT mention_id, author_id, author_username, text, status, attempts,
           pr_number, pr_url, recipes
    FROM grokbotteams_x_mentions
    WHERE mention_id <> ${excludeMentionId}
      AND recipes @> ${JSON.stringify([{ slug }])}::jsonb
      AND status IN ('pr_open', 'waiting_for_deploy', 'reply_error', 'replied', 'duplicate')
    ORDER BY updated_at DESC
    LIMIT 1
  `) as RawMentionRow[];
  return rows[0] ? asMention(rows[0]) : null;
}

export async function reserveDailyUrlReply(mentionId: string, cap: number): Promise<boolean> {
  if (cap === 0) return false;
  const rows = (await db()`
    WITH clock AS (
      SELECT (now() AT TIME ZONE 'UTC')::date AS budget_day
    ),
    locked_mention AS MATERIALIZED (
      SELECT mention_id, url_reply_budget_day
      FROM grokbotteams_x_mentions
      WHERE mention_id = ${mentionId}
      FOR UPDATE
    ),
    existing AS (
      SELECT 1
      FROM locked_mention, clock
      WHERE locked_mention.mention_id = ${mentionId}
        AND url_reply_budget_day = clock.budget_day
    ),
    budget AS (
      INSERT INTO grokbotteams_x_url_reply_budget (budget_day, reserved_count)
      SELECT clock.budget_day, 1
      FROM clock
      WHERE NOT EXISTS (SELECT 1 FROM existing)
        AND EXISTS (SELECT 1 FROM locked_mention)
      ON CONFLICT (budget_day) DO UPDATE
      SET reserved_count = grokbotteams_x_url_reply_budget.reserved_count + 1,
          updated_at = now()
      WHERE grokbotteams_x_url_reply_budget.reserved_count < ${cap}
      RETURNING budget_day
    ),
    reservation AS (
      UPDATE grokbotteams_x_mentions
      SET url_reply_budget_day = clock.budget_day, updated_at = now()
      FROM clock, locked_mention
      WHERE grokbotteams_x_mentions.mention_id = locked_mention.mention_id
        AND (
          EXISTS (SELECT 1 FROM existing)
          OR EXISTS (SELECT 1 FROM budget)
        )
      RETURNING grokbotteams_x_mentions.mention_id
    )
    SELECT EXISTS (SELECT 1 FROM reservation) AS allowed
  `) as { allowed: boolean }[];
  return rows[0]?.allowed === true;
}

export async function reserveDailyReply(mentionId: string, cap: number): Promise<boolean> {
  if (cap === 0) return false;
  const rows = (await db()`
    WITH clock AS (
      SELECT (now() AT TIME ZONE 'UTC')::date AS budget_day
    ),
    locked_mention AS MATERIALIZED (
      SELECT mention_id, reply_budget_day
      FROM grokbotteams_x_mentions
      WHERE mention_id = ${mentionId}
      FOR UPDATE
    ),
    existing AS (
      SELECT 1
      FROM locked_mention, clock
      WHERE locked_mention.mention_id = ${mentionId}
        AND reply_budget_day = clock.budget_day
    ),
    budget AS (
      INSERT INTO grokbotteams_x_url_reply_budget (
        budget_day, reserved_count, total_reserved_count
      )
      SELECT clock.budget_day, 0, 1
      FROM clock
      WHERE NOT EXISTS (SELECT 1 FROM existing)
        AND EXISTS (SELECT 1 FROM locked_mention)
      ON CONFLICT (budget_day) DO UPDATE
      SET total_reserved_count = grokbotteams_x_url_reply_budget.total_reserved_count + 1,
          updated_at = now()
      WHERE grokbotteams_x_url_reply_budget.total_reserved_count < ${cap}
      RETURNING budget_day
    ),
    reservation AS (
      UPDATE grokbotteams_x_mentions
      SET reply_budget_day = clock.budget_day, updated_at = now()
      FROM clock, locked_mention
      WHERE grokbotteams_x_mentions.mention_id = locked_mention.mention_id
        AND (
          EXISTS (SELECT 1 FROM existing)
          OR EXISTS (SELECT 1 FROM budget)
        )
      RETURNING grokbotteams_x_mentions.mention_id
    )
    SELECT EXISTS (SELECT 1 FROM reservation) AS allowed
  `) as { allowed: boolean }[];
  return rows[0]?.allowed === true;
}

export async function claimReplyAttempt(mentionId: string): Promise<boolean> {
  const rows = (await db()`
    UPDATE grokbotteams_x_mentions
    SET reply_attempted_at = now(), updated_at = now()
    WHERE mention_id = ${mentionId}
      AND reply_attempted_at IS NULL
    RETURNING mention_id
  `) as { mention_id: string }[];
  return rows.length === 1;
}
