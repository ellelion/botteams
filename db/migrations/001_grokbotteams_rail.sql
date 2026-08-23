-- Grok Bot Teams side rail. Prefixed so this can live on the shared
-- Ellelion Neon without touching Agent Plugins Directory tables.

CREATE TABLE IF NOT EXISTS grokbotteams_rail_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id text NOT NULL UNIQUE,
  email text NOT NULL DEFAULT '',
  interval text NOT NULL CHECK (interval IN ('1m', '3m', '6m')),
  amount_cents integer NOT NULL CHECK (amount_cents > 0),
  paid_at timestamptz NOT NULL,
  status text NOT NULL CHECK (
    status IN ('paid', 'setup', 'live', 'rejected', 'needs_human', 'hidden')
  ),
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0 AND attempts <= 3),
  expires_at timestamptz NOT NULL,
  refunded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS grokbotteams_rail_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL UNIQUE REFERENCES grokbotteams_rail_payments (id),
  name text NOT NULL,
  line text NOT NULL,
  href text NOT NULL,
  mark_url text NOT NULL,
  live_at timestamptz NOT NULL,
  hidden_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS grokbotteams_rail_payments_status_expires_idx
  ON grokbotteams_rail_payments (status, expires_at);

CREATE INDEX IF NOT EXISTS grokbotteams_rail_slots_live_idx
  ON grokbotteams_rail_slots (live_at)
  WHERE hidden_at IS NULL;
