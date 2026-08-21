---
slug: xai-account-research-specialist
name: Account Research Specialist
tagline: Tiers accounts before anyone touches them, with the evidence attached to each score.
bots: 1
section: Sales
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Salesforce
  - Exa
  - LinkedIn
  - Notion
connector_modes:
  Salesforce: read
  Exa: read
  LinkedIn: read
  Notion: draft
agents:
  - name: Account Research
    persona: Pulls the CRM record and live signals for each account, scores fit and warmth, and writes a research brief a human can argue with. Never mails a prospect.
    connectors:
      - Salesforce
      - Exa
      - LinkedIn
      - Notion
rooms: []
routines: []
suggest:
  - text: Never email a prospect. Draft only.
    on: true
  - text: Never change the CRM. Propose the edit and wait.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Account Research Specialist is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this shelf.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
