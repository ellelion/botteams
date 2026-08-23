---
slug: xai-newsletter-writer
name: Newsletter Writer
tagline: Writes the monthly issue from what actually shipped, parked for one edit.
bots: 1
section: Marketing
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Notion
  - Calendar
  - Gmail
  - Slack
connector_modes:
  Notion: draft
  Calendar: draft
  Gmail: draft
  Slack: draft
agents:
  - name: Newsletter Desk
    persona: Pulls launches, wins and calendar into an issue written in your voice, and parks it for review. Never sends, and cites what it claims.
    connectors:
      - Notion
      - Calendar
      - Gmail
      - Slack
rooms: []
routines:
  - name: Newsletter Writer pass
    owner: Newsletter Desk
    schedule: Every month on the first weekday at 09:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never send mail. Draft only.
    on: true
  - text: Cite the source for every claim.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Newsletter Writer is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
