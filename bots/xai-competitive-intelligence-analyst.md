---
slug: xai-competitive-intelligence-analyst
name: Competitive Intelligence Analyst
tagline: Reports the shifts that actually gained traction, with a link for every claim.
bots: 1
section: Marketing
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Exa
  - Firecrawl
  - Notion
  - Slack
connector_modes:
  Exa: read
  Firecrawl: read
  Notion: draft
  Slack: draft
bot_roster:
  - name: Competitive Watch
    persona: Watches competitor launches and messaging overnight, discards the noise, and writes up only what moved, with a source on every line. Never publishes anything.
    connectors:
      - Exa
      - Firecrawl
      - Notion
      - Slack
rooms: []
routines:
  - name: Competitive Intelligence Analyst pass
    owner: Competitive Watch
    schedule: Every weekday at 07:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never publish. Draft only.
    on: true
  - text: Cite the source for every claim.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Competitive Intelligence Analyst is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
