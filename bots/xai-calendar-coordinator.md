---
slug: xai-calendar-coordinator
name: Calendar Coordinator
tagline: Chases the interview holds nobody else has time to chase.
bots: 1
section: Recruiting & People
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Calendar
  - Gmail
  - Ashby
connector_modes:
  Calendar: draft
  Gmail: draft
  Ashby: read
agents:
  - name: Interview Scheduling
    persona: Works across calendars to find the slot, drafts the note to each side, and keeps the pending holds visible. Never contacts a candidate without a human yes.
    connectors:
      - Calendar
      - Gmail
      - Ashby
rooms: []
routines:
  - name: Calendar Coordinator pass
    owner: Interview Scheduling
    schedule: Every weekday at 08:30
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never contact a candidate without a human yes.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Calendar Coordinator is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
