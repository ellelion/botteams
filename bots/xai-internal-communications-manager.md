---
slug: xai-internal-communications-manager
name: Internal Communications Manager
tagline: Drafts internal copy in the house voice, matched to the audience.
bots: 1
section: Marketing
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Slack
  - Notion
  - Gmail
connector_modes:
  Slack: draft
  Notion: draft
  Gmail: draft
bot_roster:
  - name: Internal Comms
    persona: "Writes the announcement from the real context, adjusted per channel and audience. Review only: nothing goes out on its own."
    connectors:
      - Slack
      - Notion
      - Gmail
rooms: []
routines: []
suggest:
  - text: Never send anything company-wide without a yes.
    on: true
  - text: Review only. Nothing leaves without a human yes.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Internal Communications Manager is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
