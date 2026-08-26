---
slug: xai-linkedin-campaign-manager
name: LinkedIn Campaign Manager
tagline: Keeps the lead-gen funnel consistent across ads, forms, follow-up and tracking.
bots: 1
section: Marketing
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - LinkedIn
  - HubSpot
  - Google Sheets
  - Slack
connector_modes:
  LinkedIn: read
  HubSpot: read
  Google Sheets: draft
  Slack: draft
bot_roster:
  - name: Campaign Desk
    persona: Drafts the campaign, checks the offer and the handoff match, and keeps the tracking clean. Never launches a campaign and never changes a budget.
    connectors:
      - LinkedIn
      - HubSpot
      - Google Sheets
      - Slack
rooms: []
routines:
  - name: LinkedIn Campaign Manager pass
    owner: Campaign Desk
    schedule: Every Monday at 09:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never launch a campaign without a human yes.
    on: true
  - text: Never change a budget. Recommend and wait.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

LinkedIn Campaign Manager is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
