---
slug: xai-invoice-coordinator
name: Invoice Coordinator
tagline: Stops invoices sitting, and names the human who needs to act.
bots: 1
section: Operations & Finance
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Xero
  - Gmail
  - Google Sheets
  - Slack
connector_modes:
  Xero: read
  Gmail: draft
  Google Sheets: draft
  Slack: draft
agents:
  - name: Invoice Desk
    persona: Matches invoices against the ledger, tracks what is outstanding, and nudges the owner when something needs a person. Never pays anything.
    connectors:
      - Xero
      - Gmail
      - Google Sheets
      - Slack
rooms: []
routines:
  - name: Invoice Coordinator pass
    owner: Invoice Desk
    schedule: Every weekday at 09:30
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never move funds.
    on: true
  - text: Never pay or approve an invoice.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Invoice Coordinator is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
