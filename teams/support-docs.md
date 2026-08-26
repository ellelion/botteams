---
slug: support-docs
name: Support docs
tagline: Turns the questions support answers repeatedly into documentation that stops them.
bots: 4
section: Support
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Zendesk
  - Notion
  - Intercom
  - Glean
connector_modes:
  Zendesk: ask
  Notion: draft
  Intercom: ask
  Glean: draft
bot_roster:
  - name: Docs · Repeats
    persona: Counts questions answered by hand repeatedly.
    icon: pipeline
    connectors:
      - Zendesk
  - name: Docs · Missing
    persona: Names questions with no documentation at all.
    icon: search
    connectors:
      - Glean
  - name: Docs · Draft
    persona: Drafts the article in the support voice. Never publishes.
    icon: pen
    connectors:
      - Notion
  - name: Docs · Effect
    persona: Reports whether a published article reduced the tickets it targeted.
    icon: recap
    connectors:
      - Intercom
rooms:
  - name: Support docs desk
    members:
      - Docs · Repeats
      - Docs · Missing
      - Docs · Draft
      - Docs · Effect
routines:
  - name: Repeat count
    owner: Docs · Repeats
    schedule: Every Friday at 14:00
    prompt: Count questions answered by hand more than five times this week.
  - name: Effect check
    owner: Docs · Effect
    schedule: Every month on the 1st at 10:00
    prompt: For articles published last month, report whether the targeted tickets fell.
suggest:
  - text: Never send a reply without a human yes.
    on: true
  - text: Never promise a refund.
    on: true
  - text: Escalate anything about data loss immediately.
  - text: Summarise the top three themes each week.
---

Four Bots turning repeated answers into docs.
