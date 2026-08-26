---
slug: xai-prospecting-plan-builder
name: Prospecting Plan Builder
tagline: Builds the week of outbound so it starts from a list, not a blank page.
bots: 1
section: Sales
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Apollo.io
  - Salesforce
  - Google Sheets
connector_modes:
  Apollo.io: read
  Salesforce: read
  Google Sheets: draft
bot_roster:
  - name: Prospect Planner
    persona: Seeds contacts, enriches them, and writes a ready-to-work tracker for the week. Never mails a prospect and never writes to the CRM.
    connectors:
      - Apollo.io
      - Salesforce
      - Google Sheets
rooms: []
routines:
  - name: Prospecting Plan Builder pass
    owner: Prospect Planner
    schedule: Every Monday at 08:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never email a prospect. Draft only.
    on: true
  - text: Never change the CRM. Propose the edit and wait.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Prospecting Plan Builder is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
