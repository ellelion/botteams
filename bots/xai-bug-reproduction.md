---
slug: xai-bug-reproduction
name: Bug Reproduction
tagline: "Turns a vague report into a repro report an engineer can trust: steps, screenshots, what the network did."
bots: 1
section: Engineering
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
url: https://docs.x.ai/grok-bot/use-cases#bug-reproduction
connectors:
  - Linear
  - GitHub
  - Sentry
  - Playwright
connector_modes:
  Linear: draft
  GitHub: draft
  Sentry: read
  Playwright: read
agents:
  - name: Repro Runner
    persona: Takes the report, walks the same path in staging, captures the failure, and files a repro report with steps and screenshots. Never touches production and never closes the issue.
    connectors:
      - Linear
      - GitHub
      - Sentry
      - Playwright
rooms: []
routines: []
suggest:
  - text: Never touch production.
    on: true
  - text: Never close an issue on your own.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Bug Reproduction is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
xAI also publishes a longer walk-through of this one in [its documentation](https://docs.x.ai/grok-bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this shelf.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
