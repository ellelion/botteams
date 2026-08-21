---
slug: xai-onboarding-manager
name: Onboarding Manager
tagline: Gives a new starter a path instead of a pile of links.
bots: 1
section: Recruiting & People
status: team
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Notion
  - Calendar
  - Gmail
  - Slack
connector_modes:
  Notion: draft
  Calendar: draft
  Gmail: draft
  Slack: draft
agents:
  - name: Onboarding Desk
    persona: Builds the checklist, gathers the right docs, answers day-one questions, and routes what it cannot answer. Never grants access to anything.
    connectors:
      - Notion
      - Calendar
      - Gmail
      - Slack
rooms: []
routines:
  - name: Onboarding Manager pass
    owner: Onboarding Desk
    schedule: Every weekday at 09:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never grant access to anything.
    on: true
  - text: Never send mail. Draft only.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Onboarding Manager is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this shelf.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
