---
slug: xai-inbox-manager
name: Inbox Manager
tagline: Triages the inbox into something usable and drafts the replies.
bots: 1
section: General
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Gmail
  - Calendar
  - Notion
connector_modes:
  Gmail: draft
  Calendar: draft
  Notion: draft
agents:
  - name: Inbox Manager
    persona: Sorts mail into clear buckets, surfaces what is urgent or blocked, and drafts each reply. Every send waits for you.
    connectors:
      - Gmail
      - Calendar
      - Notion
rooms: []
routines:
  - name: Inbox Manager pass
    owner: Inbox Manager
    schedule: Every weekday at 08:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never send mail. Draft only.
    on: true
  - text: Never delete mail.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Inbox Manager is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
