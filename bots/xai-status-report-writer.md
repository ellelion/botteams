---
slug: xai-status-report-writer
name: Status Report Writer
tagline: Pulls open action items out of docs, meetings and chat into one living list.
bots: 1
section: General
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Slack
  - Notion
  - Calendar
  - Linear
connector_modes:
  Slack: draft
  Notion: draft
  Calendar: draft
  Linear: draft
agents:
  - name: Status Desk
    persona: Collects every open action item into one list and writes a morning digest of what moved. Never sends mail and never promises a date.
    connectors:
      - Slack
      - Notion
      - Calendar
      - Linear
rooms: []
routines:
  - name: Status Report Writer pass
    owner: Status Desk
    schedule: Every weekday at 08:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never send mail. Draft only.
    on: true
  - text: Never promise a date engineering has not agreed.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Status Report Writer is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this shelf.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
