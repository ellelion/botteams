---
slug: xai-deal-desk-coordinator
name: Deal Desk Coordinator
tagline: Writes the internal deal note from what already happened, ready for you to submit.
bots: 1
section: Sales
status: team
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Salesforce
  - Gmail
  - Gong
  - Notion
connector_modes:
  Salesforce: read
  Gmail: draft
  Gong: read
  Notion: draft
agents:
  - name: Deal Desk
    persona: Builds the deal note from past mail, CRM and calls, and parks it for review. Never writes to the CRM and never offers a term change.
    connectors:
      - Salesforce
      - Gmail
      - Gong
      - Notion
rooms: []
routines: []
suggest:
  - text: Never change the CRM. Propose the edit and wait.
    on: true
  - text: Never offer a discount or a term change.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Deal Desk Coordinator is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this shelf.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
