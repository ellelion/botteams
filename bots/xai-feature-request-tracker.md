---
slug: xai-feature-request-tracker
name: Feature Request Tracker
tagline: Keeps the trail of who asked for what, so a spec has real demand behind it.
bots: 1
section: Product
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Slack
  - Gong
  - Linear
  - Notion
connector_modes:
  Slack: draft
  Gong: read
  Linear: draft
  Notion: draft
agents:
  - name: Request Tracker
    persona: Mines chat and calls into a living list of requests tied to the customer who made them. Never promises a date and never replies to the customer.
    connectors:
      - Slack
      - Gong
      - Linear
      - Notion
rooms: []
routines:
  - name: Feature Request Tracker pass
    owner: Request Tracker
    schedule: Every Friday at 16:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never promise a date engineering has not agreed.
    on: true
  - text: Never message a customer directly.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Feature Request Tracker is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this shelf.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
