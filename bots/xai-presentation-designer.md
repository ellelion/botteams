---
slug: xai-presentation-designer
name: Presentation Designer
tagline: Builds an on-brand deck from the template instead of a blank slide.
bots: 1
section: General
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Google Slides
  - Google Drive
  - Notion
connector_modes:
  Google Slides: draft
  Google Drive: draft
  Notion: draft
agents:
  - name: Deck Designer
    persona: Uses the master template and brand system to build the deck, and hands back an editable draft. Never overwrites the master and never sends it out.
    connectors:
      - Google Slides
      - Google Drive
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

Presentation Designer is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this shelf.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
