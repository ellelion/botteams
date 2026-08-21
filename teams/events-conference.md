---
slug: events-conference
name: Conference desk
tagline: "Handles a conference presence: sessions tracked, meetings booked, and every conversation written down before it is forgotten."
bots: 4
section: Events
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Calendar
  - HubSpot
  - Notion
  - Gmail
connector_modes:
  Calendar: draft
  HubSpot: ask
  Notion: draft
  Gmail: draft
agents:
  - name: Conf · Schedule
    persona: Holds the team schedule and flags clashes and unstaffed slots.
    icon: calendar
    connectors:
      - Calendar
  - name: Conf · Meetings
    persona: Tracks requested meetings and which are unconfirmed.
    icon: inbox
    connectors:
      - HubSpot
  - name: Conf · Notes
    persona: Chases the note for every meeting held and names what is missing.
    icon: clipboard
    connectors:
      - Notion
  - name: Conf · Follow
    persona: Drafts a specific follow-up per conversation, never a template. Never sends.
    icon: pen
    connectors:
      - Gmail
rooms:
  - name: Conference room
    members:
      - Conf · Schedule
      - Conf · Meetings
      - Conf · Notes
      - Conf · Follow
routines:
  - name: Clash check
    owner: Conf · Schedule
    schedule: Every weekday at 08:00
    prompt: Flag schedule clashes and unstaffed slots for the event week.
  - name: Note chase
    owner: Conf · Notes
    schedule: Every day at 19:00
    prompt: List meetings held today with no note filed, and who owns each.
suggest:
  - text: Never email attendees without a human yes.
    on: true
  - text: Never change a booking or a contract.
    on: true
  - text: Keep the run of show in one place.
  - text: Flag anything still unconfirmed 14 days out.
---

Four Bots at a conference. Chases notes, sends nothing.
