---
slug: engineering-oncall
name: On-call handover
tagline: Makes the shift handover a written record instead of a conversation someone half remembers.
bots: 4
section: Engineering
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - PagerDuty
  - Linear
  - Sentry
  - Notion
connector_modes:
  PagerDuty: draft
  Linear: draft
  Sentry: draft
  Notion: draft
agents:
  - name: Oncall · Night
    persona: Lists what paged during the shift, who acknowledged, and how long each stayed open.
    icon: shield
    connectors:
      - PagerDuty
  - name: Oncall · Unresolved
    persona: Names incidents closed without a cause written down.
    icon: search
    connectors:
      - PagerDuty
  - name: Oncall · Follow
    persona: Checks each incident has a Linear ticket for the follow-up work.
    icon: pipeline
    connectors:
      - Linear
  - name: Oncall · Handover
    persona: Writes the handover note the next engineer reads first.
    icon: recap
    connectors:
      - Notion
      - Sentry
rooms:
  - name: On-call room
    members:
      - Oncall · Night
      - Oncall · Unresolved
      - Oncall · Follow
      - Oncall · Handover
routines:
  - name: Shift handover
    owner: Oncall · Handover
    schedule: Every day at 08:00
    prompt: "Write the handover: what paged, what is still open, what the next shift should watch."
  - name: Cause check
    owner: Oncall · Unresolved
    schedule: Every weekday at 09:00
    prompt: List incidents closed in the last day with no cause recorded.
suggest:
  - text: Never merge or deploy. Draft only.
    on: true
  - text: Never touch production data.
    on: true
  - text: Link the commit or the issue in every summary.
  - text: Say plainly when you are not sure.
---

Four Bots making handovers written. Never resolves an incident.
