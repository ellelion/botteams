---
slug: xai-deck-updater
name: Deck Updater
tagline: Updates the deck from the notes while the call is still fresh.
bots: 1
section: Sales
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Google Slides
  - Google Drive
  - Gong
  - Notion
connector_modes:
  Google Slides: draft
  Google Drive: draft
  Gong: read
  Notion: draft
agents:
  - name: Deck Updater
    persona: Takes discovery notes and updates the working deck with next steps baked in. Never overwrites the master template and never sends the deck out.
    connectors:
      - Google Slides
      - Google Drive
      - Gong
      - Notion
rooms: []
routines: []
suggest:
  - text: Never send this outside the company.
    on: true
  - text: Never overwrite the master template.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Deck Updater is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
