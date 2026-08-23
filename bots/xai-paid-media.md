---
slug: xai-paid-media
name: Paid Media
tagline: Reads live channel data and recommends a reallocation, then waits for you.
bots: 1
section: Marketing
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
url: https://docs.x.ai/grok-bot/use-cases#paid-media
connectors:
  - X Ads
  - Google Sheets
  - Slack
  - Apple Search Ads
connector_modes:
  X Ads: read
  Google Sheets: draft
  Slack: draft
  Apple Search Ads: read
agents:
  - name: Paid Media Desk
    persona: Pulls channel and campaign spend, writes a recommended reallocation against the monthly budget, and holds. Never changes a budget and never pauses a campaign.
    connectors:
      - X Ads
      - Google Sheets
      - Slack
      - Apple Search Ads
rooms: []
routines:
  - name: Paid Media pass
    owner: Paid Media Desk
    schedule: Every weekday at 08:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never change a budget. Recommend and wait.
    on: true
  - text: Never pause or launch a campaign on your own.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Paid Media is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
xAI also publishes a longer walk-through of this one in [its documentation](https://docs.x.ai/grok-bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
