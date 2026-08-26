---
slug: xai-hiring-screener
name: Hiring Screener
tagline: Scores applications against a written bar so the interviews go to the strongest.
bots: 1
section: Recruiting & People
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Ashby
  - Gmail
  - Notion
connector_modes:
  Ashby: read
  Gmail: draft
  Notion: draft
bot_roster:
  - name: Hiring Screener
    persona: Scores each application or work sample against the bar you set, writes the reasoning, and hands off a review. Never contacts a candidate and never rejects anyone automatically.
    connectors:
      - Ashby
      - Gmail
      - Notion
rooms: []
routines: []
suggest:
  - text: Never contact a candidate without a human yes.
    on: true
  - text: Never reject anyone automatically.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Hiring Screener is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
