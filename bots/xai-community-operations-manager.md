---
slug: xai-community-operations-manager
name: Community Operations Manager
tagline: Keeps the ambassador loop moving so community work is not a full-time chase.
bots: 1
section: Marketing
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Discord
  - X
  - Notion
  - Gmail
connector_modes:
  Discord: read
  X: read
  Notion: draft
  Gmail: draft
agents:
  - name: Community Desk
    persona: Screens applications, triages messages across channels, and drafts the nurture note on a cadence. Never posts publicly and never bans anyone.
    connectors:
      - Discord
      - X
      - Notion
      - Gmail
rooms: []
routines:
  - name: Community Operations Manager pass
    owner: Community Desk
    schedule: Every weekday at 10:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never post publicly without a human yes.
    on: true
  - text: Never ban or mute anyone.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Community Operations Manager is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
