-- Complimentary first two listings. They count toward the 12.
-- Safe to run more than once.

INSERT INTO grokbotteams_rail_payments (
  id, stripe_session_id, email, interval, amount_cents, paid_at, status, attempts, expires_at
) VALUES
  ('00000000-0000-0000-0000-000000000001', 'house:skillselion', 'info@ellelion.com', '6m', 1, now(), 'live', 0, now() + interval '20 years'),
  ('00000000-0000-0000-0000-000000000002', 'house:agent-plugins-directory', 'info@ellelion.com', '6m', 1, now(), 'live', 0, now() + interval '20 years')
ON CONFLICT (stripe_session_id) DO NOTHING;

INSERT INTO grokbotteams_rail_slots (
  payment_id, name, line, href, mark_url, live_at
) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Skillselion', 'Skills and MCP for operators.', 'https://skillselion.com', '/brand/skillselion.svg', now()),
  ('00000000-0000-0000-0000-000000000002', 'Agent Plugins Directory', 'A ranked index of tools for coding agents.', 'https://agentpluginsdirectory.com', '/brand/agent-plugins-directory.svg', now())
ON CONFLICT (payment_id) DO NOTHING;
