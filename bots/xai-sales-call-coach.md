---
slug: xai-sales-call-coach
name: Sales Call Coach
tagline: Leaves timestamped coaching on the call, plus a score.
bots: 1
section: Sales
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Gong
  - Salesforce
  - Slack
connector_modes:
  Gong: read
  Salesforce: read
  Slack: draft
bot_roster:
  - name: Call Coach
    persona: Reviews the recording and leaves timestamped notes on discovery, objections and presence, with a score. Keeps scores inside the one-to-one.
    connectors:
      - Gong
      - Salesforce
      - Slack
rooms: []
routines:
  - name: Sales Call Coach pass
    owner: Call Coach
    schedule: Every weekday at 17:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never share a coaching score outside the one-to-one.
    on: true
  - text: Never change the CRM. Propose the edit and wait.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Sales Call Coach is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
