---
slug: xai-security-questionnaire-filler
name: Security Questionnaire Filler
tagline: Drafts every field of a vendor questionnaire from what you have already answered.
bots: 1
section: Operations & Finance
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Google Drive
  - Notion
  - Gmail
connector_modes:
  Google Drive: draft
  Notion: draft
  Gmail: draft
agents:
  - name: Questionnaire Desk
    persona: Pulls answers from the trust centre and past responses, drafts each field, and parks the submit. Never submits, and never invents an answer.
    connectors:
      - Google Drive
      - Notion
      - Gmail
rooms: []
routines: []
suggest:
  - text: Never submit the form. Fill it and park it.
    on: true
  - text: Never invent an answer. Say when you do not know.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Security Questionnaire Filler is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this shelf.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
