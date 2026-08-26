---
slug: workplace-meetings
name: Meeting hygiene
tagline: Makes the real cost of the calendar visible, and kills the meetings nobody would defend.
bots: 4
section: Workplace
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Calendar
  - Microsoft Teams
  - Notion
  - Gmail
connector_modes:
  Calendar: draft
  Microsoft Teams: ask
  Notion: draft
  Gmail: draft
bot_roster:
  - name: Meetings · Cost
    persona: Reports hours spent in recurring meetings per team.
    icon: card
    connectors:
      - Calendar
  - name: Meetings · Agenda
    persona: Names recurring meetings with no agenda and no notes.
    icon: shield
    connectors:
      - Notion
  - name: Meetings · Attendance
    persona: Finds meetings where most invitees never speak.
    icon: staff
    connectors:
      - Microsoft Teams
  - name: Meetings · Recap
    persona: Drafts the case for cancelling specific meetings.
    icon: recap
    connectors:
      - Gmail
rooms:
  - name: Meeting desk
    members:
      - Meetings · Cost
      - Meetings · Agenda
      - Meetings · Attendance
      - Meetings · Recap
routines:
  - name: Cost read
    owner: Meetings · Cost
    schedule: Every Monday at 09:00
    prompt: Report hours in recurring meetings per team. Name the five most expensive.
  - name: Agenda check
    owner: Meetings · Agenda
    schedule: Every Friday at 14:00
    prompt: List recurring meetings held this week with no agenda and no notes.
suggest:
  - text: Never mail the whole company without a yes.
    on: true
  - text: Never book or cancel anything for anyone.
    on: true
  - text: Keep the office calendar in one place.
  - text: Flag anything that looks like a safety issue.
---

Four Bots on the calendar. Reports cost, cancels nothing.
