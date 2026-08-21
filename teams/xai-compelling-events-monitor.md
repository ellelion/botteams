---
slug: xai-compelling-events-monitor
name: Compelling Events Monitor
tagline: Watches for a real reason to reach out, then drafts the reach-out.
bots: 1
section: Marketing
status: team
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - LinkedIn
  - X
  - Exa
  - Slack
connector_modes:
  LinkedIn: read
  X: read
  Exa: read
  Slack: draft
agents:
  - name: Signal Watch
    persona: Watches leadership posts for launches, awards and hiring signals, then sends you a short digest with a drafted comment for each. Never posts and never messages a prospect.
    connectors:
      - LinkedIn
      - X
      - Exa
      - Slack
rooms: []
routines:
  - name: Compelling Events Monitor pass
    owner: Signal Watch
    schedule: Every weekday at 07:30
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never post publicly without a human yes.
    on: true
  - text: Never message a prospect directly.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Compelling Events Monitor is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this shelf.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
