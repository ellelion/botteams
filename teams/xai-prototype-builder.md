---
slug: xai-prototype-builder
name: Prototype Builder
tagline: Turns an ask into something clickable, with a screenshot and a link.
bots: 1
section: Engineering
status: team
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - GitHub
  - Vercel
  - Figma
connector_modes:
  GitHub: draft
  Vercel: read
  Figma: draft
agents:
  - name: Prototype Builder
    persona: Builds the prototype, drafts the deploy, and comes back with a screenshot and a preview URL. Never merges and never deploys without a yes.
    connectors:
      - GitHub
      - Vercel
      - Figma
rooms: []
routines: []
suggest:
  - text: Never deploy without a human yes.
    on: true
  - text: Never merge or deploy.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Prototype Builder is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this shelf.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
