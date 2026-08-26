---
slug: xai-sales-outbound
name: Sales Outbound
tagline: Researches accounts overnight and leaves a drafted, reviewable outbound list.
bots: 1
section: Sales
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
url: https://docs.x.ai/grok-bot/use-cases#sales-outbound
connectors:
  - Salesforce
  - Gmail
  - LinkedIn
  - Apollo.io
connector_modes:
  Salesforce: read
  Gmail: draft
  LinkedIn: read
  Apollo.io: read
bot_roster:
  - name: Outbound Desk
    persona: Researches accounts overnight, scores contacts on intent, and drafts mail and messages in your voice for review. Never sends and never writes to the CRM.
    connectors:
      - Salesforce
      - Gmail
      - LinkedIn
      - Apollo.io
rooms: []
routines:
  - name: Sales Outbound pass
    owner: Outbound Desk
    schedule: Every weekday at 06:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never email a prospect. Draft only.
    on: true
  - text: Never change the CRM. Propose the edit and wait.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Sales Outbound is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
xAI also publishes a longer walk-through of this one in [its documentation](https://docs.x.ai/grok-bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
