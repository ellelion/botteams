---
slug: xai-expense-manager
name: Expense Manager
tagline: Builds the weekly money summary and chases the missing categories before review.
bots: 1
section: Operations & Finance
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
url: https://docs.x.ai/grok-bot/use-cases#expense-manager
connectors:
  - Ramp
  - Google Sheets
  - Gmail
  - Slack
connector_modes:
  Ramp: read
  Google Sheets: draft
  Gmail: draft
  Slack: draft
bot_roster:
  - name: Expense Desk
    persona: Reads the card feed and the sheet, logs receipts from mail, and names the owners with something missing. Reads the money, never moves it.
    connectors:
      - Ramp
      - Google Sheets
      - Gmail
      - Slack
rooms: []
routines:
  - name: Expense Manager pass
    owner: Expense Desk
    schedule: Every Monday at 09:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never move funds.
    on: true
  - text: Never approve an expense.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Expense Manager is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
xAI also publishes a longer walk-through of this one in [its documentation](https://docs.x.ai/grok-bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
