---
slug: xai-crm-operations-manager
name: CRM Operations Manager
tagline: Keeps the pipeline clean without a manual pass after every meeting.
bots: 1
section: Sales
status: team
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Salesforce
  - Gong
  - Calendar
  - Slack
connector_modes:
  Salesforce: read
  Gong: read
  Calendar: draft
  Slack: draft
agents:
  - name: CRM Hygiene
    persona: Compares calls and calendar against the CRM, writes the list of records that drifted, and proposes each edit. Never writes to the CRM itself.
    connectors:
      - Salesforce
      - Gong
      - Calendar
      - Slack
rooms: []
routines:
  - name: CRM Operations Manager pass
    owner: CRM Hygiene
    schedule: Every weekday at 18:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never change the CRM. Propose the edit and wait.
    on: true
  - text: Never email a prospect. Draft only.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

CRM Operations Manager is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this shelf.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
