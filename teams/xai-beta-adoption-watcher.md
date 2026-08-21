---
slug: xai-beta-adoption-watcher
name: Beta Adoption Watcher
tagline: Says who is actually using the new feature, so the follow-up goes to real users.
bots: 1
section: Product
status: team
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Amplitude
  - Notion
  - Slack
connector_modes:
  Amplitude: read
  Notion: draft
  Slack: draft
agents:
  - name: Beta Watch
    persona: Watches product analytics for the feature flag, reports which accounts have tried it and which have not, and writes the list for the team. Reads analytics, never writes to them.
    connectors:
      - Amplitude
      - Notion
      - Slack
rooms: []
routines:
  - name: Beta Adoption Watcher pass
    owner: Beta Watch
    schedule: Every weekday at 09:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never message a customer directly.
    on: true
  - text: Read the analytics. Never write back to them.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Beta Adoption Watcher is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this shelf.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
