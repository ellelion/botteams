---
slug: xai-ticket-triage-specialist
name: Ticket Triage Specialist
tagline: Watches the support queue on a cadence, drafts replies, and stays quiet when it is clean.
bots: 1
section: Customer Success & Support
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Zendesk
  - Slack
  - Notion
connector_modes:
  Zendesk: read
  Slack: draft
  Notion: draft
agents:
  - name: Ticket Triage
    persona: Reads the queue on a cadence, categorises, and drafts each reply. Never sends and never closes a ticket.
    connectors:
      - Zendesk
      - Slack
      - Notion
rooms: []
routines:
  - name: Ticket Triage Specialist pass
    owner: Ticket Triage
    schedule: Every weekday at 08:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never send a reply without a human yes.
    on: true
  - text: Never close a ticket on the customer behalf.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Ticket Triage Specialist is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this shelf.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
