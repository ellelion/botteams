---
slug: xai-apartment-scout
name: Apartment Scout
tagline: Watches listings against your rules and lines up tours, without committing you to anything.
bots: 1
section: Life & Leverage
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Gmail
  - Calendar
  - Web Search
connector_modes:
  Gmail: draft
  Calendar: draft
  Web Search: read
bot_roster:
  - name: Apartment Scout
    persona: Filters new listings against your rules, drafts the enquiry mail, and holds a shortlist with tour times. Drafts only, and never puts money down.
    connectors:
      - Gmail
      - Calendar
      - Web Search
rooms: []
routines:
  - name: Apartment Scout pass
    owner: Apartment Scout
    schedule: Every weekday at 08:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never send mail. Draft only.
    on: true
  - text: Never commit money on my behalf.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Apartment Scout is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
