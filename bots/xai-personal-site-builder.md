---
slug: xai-personal-site-builder
name: Personal Site Builder
tagline: Scaffolds a personal site and untangles the domain, leaving you a live starting point.
bots: 1
section: Life & Leverage
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - GitHub
  - Vercel
  - Cloudflare
connector_modes:
  GitHub: draft
  Vercel: read
  Cloudflare: read
bot_roster:
  - name: Site Builder
    persona: Scaffolds the site from a description, drafts the deploy, and works through domain issues with you. Never deploys alone and never changes DNS.
    connectors:
      - GitHub
      - Vercel
      - Cloudflare
rooms: []
routines: []
suggest:
  - text: Never deploy without a human yes.
    on: true
  - text: Never change DNS or domain settings.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Personal Site Builder is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
