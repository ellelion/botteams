---
slug: xai-product-feedback-analyst
name: Product Feedback Analyst
tagline: Clusters scattered feedback into a prioritised view with the evidence attached.
bots: 1
section: Product
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Slack
  - Gong
  - Linear
  - Notion
  - Zendesk
connector_modes:
  Slack: draft
  Gong: read
  Linear: draft
  Notion: draft
  Zendesk: read
bot_roster:
  - name: Feedback Analyst
    persona: Collects feedback from chat, calls and tickets, clusters it, weighs urgency against evidence, and drafts routing. Never promises a date.
    connectors:
      - Slack
      - Gong
      - Linear
      - Notion
      - Zendesk
rooms: []
routines:
  - name: Product Feedback Analyst pass
    owner: Feedback Analyst
    schedule: Every Friday at 15:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never promise a date engineering has not agreed.
    on: true
  - text: Never message a customer directly.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Product Feedback Analyst is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
