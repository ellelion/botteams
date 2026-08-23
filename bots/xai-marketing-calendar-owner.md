---
slug: xai-marketing-calendar-owner
name: Marketing Calendar Owner
tagline: Keeps the content, launch and events calendars in sync without a weekly chase.
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
  - Slack
connector_modes:
  Notion: draft
  Calendar: draft
  Slack: draft
agents:
  - name: Calendar Owner
    persona: Pulls from the docs and the calendar, reconciles what moved, and reports the conflicts. Never publishes and never moves a launch date.
    connectors:
      - Notion
      - Calendar
      - Slack
rooms: []
routines:
  - name: Marketing Calendar Owner pass
    owner: Calendar Owner
    schedule: Every Monday at 08:30
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never publish. Draft only.
    on: true
  - text: Never move a launch date without asking.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Marketing Calendar Owner is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
