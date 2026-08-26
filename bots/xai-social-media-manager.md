---
slug: xai-social-media-manager
name: Social Media Manager
tagline: Drafts in your voice when something worth posting ships, and parks it.
bots: 1
section: Marketing
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - X
  - LinkedIn
  - Notion
  - Slack
connector_modes:
  X: read
  LinkedIn: read
  Notion: draft
  Slack: draft
bot_roster:
  - name: Social Desk
    persona: Studies the real posting history, drafts when something noteworthy ships, and keeps the queue moving. Never posts and never replies as you.
    connectors:
      - X
      - LinkedIn
      - Notion
      - Slack
rooms: []
routines:
  - name: Social Media Manager pass
    owner: Social Desk
    schedule: Every weekday at 09:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never post publicly without a human yes.
    on: true
  - text: Never reply as me in public.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Social Media Manager is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
