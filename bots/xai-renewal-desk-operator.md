---
slug: xai-renewal-desk-operator
name: Renewal Desk Operator
tagline: Briefs every renewal 90 days out and only escalates when terms are stuck.
bots: 1
section: Sales
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Salesforce
  - Gong
  - Zendesk
  - Gmail
connector_modes:
  Salesforce: read
  Gong: read
  Zendesk: read
  Gmail: draft
agents:
  - name: Renewal Desk
    persona: Builds a 90-day brief per account from usage, tickets, calls and CRM, and drafts the commercial note. Never mails the customer and never offers a discount.
    connectors:
      - Salesforce
      - Gong
      - Zendesk
      - Gmail
rooms: []
routines:
  - name: Renewal Desk Operator pass
    owner: Renewal Desk
    schedule: Every Monday at 09:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never email a customer without a human yes.
    on: true
  - text: Never offer a discount or a term change.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Renewal Desk Operator is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
