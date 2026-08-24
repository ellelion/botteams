---
$schema: https://botteams.ai/schema/team.schema.json
slug: sample-team
name: Sample team
tagline: Two Bots share a room. This file is the contribution template, not a live listing.
bots: 2
section: Founder OS
kind: team
status: example
connectors:
  - Gmail
  - Notion
agents:
  - name: Sample · Inbox
    persona: Drafts replies. Never sends mail.
    connectors:
      - Gmail
  - name: Sample · Notes
    persona: Writes the recap in Notion. Never publishes.
    connectors:
      - Notion
rooms:
  - name: Sample HQ
    members:
      - Sample · Inbox
      - Sample · Notes
routines:
  - name: Morning recap
    owner: Sample · Notes
    schedule: Every weekday at 09:00
    prompt: Draft the recap. Change nothing without a human yes.
suggest:
  - text: Never send mail. Draft only.
    on: true
---

Copy this file to `teams/<slug>.md`, rename the slug, run it in Grok Bot, then open a pull request. See [CONTRIBUTING.md](../../CONTRIBUTING.md).
