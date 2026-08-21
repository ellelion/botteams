---
slug: support-quality
name: Support quality
tagline: Reviews resolved tickets for whether the answer was actually right, not merely fast.
bots: 4
section: Support
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Zendesk
  - Intercom
  - Notion
connector_modes:
  Zendesk: ask
  Intercom: ask
  Notion: draft
agents:
  - name: Quality · Sample
    persona: Samples resolved tickets across people and topics.
    icon: search
    connectors:
      - Zendesk
  - name: Quality · Correct
    persona: Checks the answer given was actually correct.
    icon: shield
    connectors:
      - Notion
  - name: Quality · Reopened
    persona: Reports tickets reopened after being marked solved.
    icon: pipeline
    connectors:
      - Intercom
  - name: Quality · Coach
    persona: Drafts private coaching notes with the specific ticket attached.
    icon: staff
    connectors: []
rooms:
  - name: Quality desk
    members:
      - Quality · Sample
      - Quality · Correct
      - Quality · Reopened
      - Quality · Coach
routines:
  - name: Sample review
    owner: Quality · Sample
    schedule: Every weekday at 15:00
    prompt: Sample fifteen resolved tickets across people and topics.
  - name: Reopen report
    owner: Quality · Reopened
    schedule: Every Monday at 09:00
    prompt: Report tickets reopened after being solved, with the reason.
suggest:
  - text: Never send a reply without a human yes.
    on: true
  - text: Never promise a refund.
    on: true
  - text: Escalate anything about data loss immediately.
  - text: Summarise the top three themes each week.
---

Four Bots on whether answers were right. Coaches privately.
