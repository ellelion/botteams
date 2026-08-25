---
$schema: https://botteams.ai/schema/team.schema.json
slug: sample-bot
name: Sample bot
tagline: One Bot, one job. This file is the contribution template, not a live listing.
bots: 1
section: General
kind: bot
status: example
connectors:
  - Gmail
agents:
  - name: Sample bot
    persona: Drafts the reply. Never sends mail.
    connectors:
      - Gmail
rooms: []
routines:
  - name: Inbox pass
    owner: Sample bot
    schedule: Every weekday at 08:00
    prompt: Draft the replies. Send nothing.
suggest:
  - text: Never send mail. Draft only.
    on: true
---

Copy this file to `bots/<slug>.md`, rename the slug, run it in Grok Bot, then open a pull request. See [CONTRIBUTING.md](../../CONTRIBUTING.md).
