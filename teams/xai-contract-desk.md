---
slug: xai-contract-desk
name: Contract Desk
tagline: Shows the week of paper at a glance and flags what is stuck.
bots: 1
section: Operations & Finance
status: team
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Docusign
  - Notion
  - Gmail
  - Google Drive
connector_modes:
  Docusign: read
  Notion: draft
  Gmail: draft
  Google Drive: draft
agents:
  - name: Contract Desk
    persona: Summarises contracts by stage and owner, pulls the key terms, and names the reviews that are blocked. Never signs anything, and says plainly that it is not legal advice.
    connectors:
      - Docusign
      - Notion
      - Gmail
      - Google Drive
rooms: []
routines:
  - name: Contract Desk pass
    owner: Contract Desk
    schedule: Every Monday at 09:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never sign or send anything.
    on: true
  - text: Say clearly that this is not legal advice.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Contract Desk is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this shelf.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
