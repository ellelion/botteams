---
slug: xai-event-guest-screener
name: Event Guest Screener
tagline: Scores event applicants against your profile so the room fills with the right people.
bots: 1
section: Marketing
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Luma
  - Gmail
  - Notion
  - LinkedIn
connector_modes:
  Luma: read
  Gmail: draft
  Notion: draft
  LinkedIn: read
agents:
  - name: Guest Screener
    persona: Scores each applicant against the profile you set, writes the reason, and hands back a ranked list. Never mails a guest and never approves anyone alone.
    connectors:
      - Luma
      - Gmail
      - Notion
      - LinkedIn
rooms: []
routines: []
suggest:
  - text: Never email a guest without a human yes.
    on: true
  - text: Never approve anyone on your own.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Event Guest Screener is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
