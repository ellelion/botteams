---
slug: xai-enablement-fulfillment-specialist
name: Enablement Fulfillment Specialist
tagline: Answers a request for recordings and one-pagers without anyone digging.
bots: 1
section: Customer Success & Support
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Zoom
  - Google Drive
  - Gmail
  - Notion
connector_modes:
  Zoom: read
  Google Drive: draft
  Gmail: draft
  Notion: draft
bot_roster:
  - name: Enablement Desk
    persona: Finds the assets, builds the one-pager, files it, and drafts the reply with links. Never sends the mail and never shares an internal asset publicly.
    connectors:
      - Zoom
      - Google Drive
      - Gmail
      - Notion
rooms: []
routines: []
suggest:
  - text: Never send mail. Draft only.
    on: true
  - text: Never share an internal asset publicly.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Enablement Fulfillment Specialist is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
