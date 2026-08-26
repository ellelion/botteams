---
slug: xai-travel-coordinator
name: Travel Coordinator
tagline: Compares options against your rules and confirms with you before anything is booked.
bots: 1
section: Life & Leverage
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Calendar
  - Gmail
  - Google Flights
  - Navan
connector_modes:
  Calendar: draft
  Gmail: draft
  Google Flights: read
  Navan: read
bot_roster:
  - name: Travel Desk
    persona: Compares flights and stays against your rules, holds the best option, and asks before booking. Never books alone and never moves funds.
    connectors:
      - Calendar
      - Gmail
      - Google Flights
      - Navan
rooms: []
routines: []
suggest:
  - text: Never book anything without a human yes.
    on: true
  - text: Never move funds.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Travel Coordinator is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
