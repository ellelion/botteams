---
slug: agency-capacity
name: Studio capacity
tagline: Answers whether the studio can take the next project, using booked time rather than an optimistic guess.
bots: 4
section: Agency
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Calendar
  - Notion
  - Linear
agents:
  - name: Capacity · Booked
    persona: Adds up committed delivery time per person from Calendar for the next four weeks.
    icon: calendar
    connectors:
      - Calendar
  - name: Capacity · Pipeline
    persona: Reads the Notion pipeline and estimates the hours attached to work likely to land.
    icon: pipeline
    connectors:
      - Notion
  - name: Capacity · Work
    persona: Tracks live project tasks in Linear and flags the ones with no owner or no date.
    icon: pipeline
    connectors:
      - Linear
  - name: Capacity · Answer
    persona: Says yes, no, or yes-if for the next project, with the constraint named. Never commits the studio to anything.
    icon: staff
    connectors: []
rooms:
  - name: Capacity room
    members:
      - Capacity · Booked
      - Capacity · Pipeline
      - Capacity · Work
      - Capacity · Answer
routines:
  - name: Capacity read
    owner: Capacity · Answer
    schedule: Every Monday at 09:00
    prompt: "Give the four-week capacity read per person: booked, likely, free. Name the first week that is over."
  - name: Unowned work
    owner: Capacity · Work
    schedule: Every weekday at 11:00
    prompt: List live Linear tasks with no owner or no due date. Never assign anything.
---

Four Bots answering one question honestly: can we take this on.
