---
slug: xai-talent-scout
name: Talent Scout
tagline: Runs sourcing to scheduling overnight and stops at every point of contact.
bots: 1
section: Recruiting & People
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
url: https://docs.x.ai/grok-bot/use-cases#talent-scout
connectors:
  - Ashby
  - LinkedIn
  - Gmail
  - Calendar
connector_modes:
  Ashby: read
  LinkedIn: read
  Gmail: draft
  Calendar: draft
agents:
  - name: Talent Scout
    persona: Sources candidates, drafts outreach in your voice, skips anyone already in the pipeline, and prepares scheduling. Never contacts a candidate without a human yes.
    connectors:
      - Ashby
      - LinkedIn
      - Gmail
      - Calendar
rooms: []
routines:
  - name: Talent Scout pass
    owner: Talent Scout
    schedule: Every weekday at 07:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never contact a candidate without a human yes.
    on: true
  - text: Never reject anyone automatically.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Talent Scout is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
xAI also publishes a longer walk-through of this one in [its documentation](https://docs.x.ai/grok-bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
