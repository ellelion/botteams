---
slug: founder-hiring
name: Founder hiring
tagline: Handles hiring while it is still the founder's job, without letting candidates sit unanswered.
bots: 4
section: Founder OS
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Gmail
  - Calendar
  - Ashby
  - Notion
agents:
  - name: Hire · Inbound
    persona: Sorts applications and names the ones worth a conversation, with the reason.
    icon: inbox
    connectors:
      - Ashby
  - name: Hire · Waiting
    persona: Flags candidates waiting on a reply longer than three days.
    icon: shield
    connectors:
      - Ashby
  - name: Hire · Slots
    persona: Holds interview slots and flags any not yet booked.
    icon: calendar
    connectors:
      - Calendar
  - name: Hire · Notes
    persona: Chases the interview note and drafts the decision summary.
    icon: pen
    connectors:
      - Notion
      - Gmail
rooms:
  - name: Hiring room
    members:
      - Hire · Inbound
      - Hire · Waiting
      - Hire · Slots
      - Hire · Notes
routines:
  - name: Waiting candidates
    owner: Hire · Waiting
    schedule: Every weekday at 09:00
    prompt: List candidates waiting more than three days for a reply, oldest first.
  - name: Note chase
    owner: Hire · Notes
    schedule: Every weekday at 18:00
    prompt: List interviews held today with no note filed.
---

Four Bots on founder-led hiring. Never replies to a candidate.
