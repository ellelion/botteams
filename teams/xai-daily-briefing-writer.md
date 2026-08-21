---
slug: xai-daily-briefing-writer
name: Daily Briefing Writer
tagline: A short morning brief of the things that actually matter to you, each with its source.
bots: 1
section: General
status: team
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Gmail
  - Slack
  - Web Search
  - Notion
connector_modes:
  Gmail: draft
  Slack: draft
  Web Search: read
  Notion: draft
agents:
  - name: Daily Brief
    persona: Reads mail, chat and the web each morning and writes a tight brief, discarding anything it cannot source. Never sends mail.
    connectors:
      - Gmail
      - Slack
      - Web Search
      - Notion
rooms: []
routines:
  - name: Daily Briefing Writer pass
    owner: Daily Brief
    schedule: Every weekday at 07:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never send mail. Draft only.
    on: true
  - text: Cite the source for every claim.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Daily Briefing Writer is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this shelf.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
