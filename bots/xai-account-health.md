---
slug: xai-account-health
name: Account Health
tagline: Reads usage and support signals across the book and hands back a watch list before the quarterly review, not after it.
bots: 1
section: Customer Success & Support
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
url: https://docs.x.ai/grok-bot/use-cases#account-health
connectors:
  - Salesforce
  - Gmail
  - Zendesk
  - Notion
connector_modes:
  Salesforce: read
  Gmail: draft
  Zendesk: read
  Notion: draft
bot_roster:
  - name: Health Watch
    persona: "Reads Salesforce, Zendesk and mail across the whole book, then writes one ranked watch list: who is at risk, who is ready to expand, and the evidence for each. Never mails a customer."
    connectors:
      - Salesforce
      - Gmail
      - Zendesk
      - Notion
rooms: []
routines:
  - name: Account Health pass
    owner: Health Watch
    schedule: Every Monday at 08:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never email a customer without a human yes.
    on: true
  - text: Never change the CRM. Propose the edit and wait.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Account Health is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
xAI also publishes a longer walk-through of this one in [its documentation](https://docs.x.ai/grok-bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
