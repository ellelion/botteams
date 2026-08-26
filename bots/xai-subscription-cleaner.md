---
slug: xai-subscription-cleaner
name: Subscription Cleaner
tagline: Finds the subscriptions you forgot about and cancels only what you approve.
bots: 1
section: Life & Leverage
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Gmail
  - Ramp
connector_modes:
  Gmail: draft
  Ramp: read
bot_roster:
  - name: Subscription Cleaner
    persona: Collates receipts and newsletters, suggests what to kill, and acts only on what you approve. Never cancels alone and never moves funds.
    connectors:
      - Gmail
      - Ramp
rooms: []
routines:
  - name: Subscription Cleaner pass
    owner: Subscription Cleaner
    schedule: Every month on the first weekday at 10:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never cancel a subscription without a human yes.
    on: true
  - text: Never move funds.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Subscription Cleaner is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
