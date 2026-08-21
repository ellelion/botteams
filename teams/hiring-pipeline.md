---
slug: hiring-pipeline
name: Candidate pipeline
tagline: Keeps candidates moving and makes silence visible, because slow rejection costs more than fast rejection.
bots: 4
section: Hiring
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Ashby
  - Gmail
  - Calendar
  - Notion
connector_modes:
  Ashby: draft
  Gmail: draft
  Calendar: draft
  Notion: draft
agents:
  - name: Pipeline · Stuck
    persona: Names candidates who have not moved stage in a week.
    icon: shield
    connectors:
      - Ashby
  - name: Pipeline · Silent
    persona: Flags anyone waiting on us rather than on themselves.
    icon: inbox
    connectors:
      - Gmail
  - name: Pipeline · Slots
    persona: Finds interviews unbooked more than three days after the request.
    icon: calendar
    connectors:
      - Calendar
  - name: Pipeline · Report
    persona: Reports pipeline health per role, including time-to-first-reply.
    icon: pipeline
    connectors:
      - Notion
rooms:
  - name: Pipeline room
    members:
      - Pipeline · Stuck
      - Pipeline · Silent
      - Pipeline · Slots
      - Pipeline · Report
routines:
  - name: Stuck pass
    owner: Pipeline · Stuck
    schedule: Every weekday at 09:00
    prompt: List candidates not moved in seven days, per role, oldest first.
  - name: Waiting on us
    owner: Pipeline · Silent
    schedule: Every weekday at 09:30
    prompt: List candidates waiting on us. Never contact them.
suggest:
  - text: Never mail a candidate without a human yes.
    on: true
  - text: Never reject anyone automatically.
    on: true
  - text: Judge on the work, not on the school.
  - text: Flag a role that has been open over 30 days.
---

Four Bots keeping hiring moving. Makes silence visible.
