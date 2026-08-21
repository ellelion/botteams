---
slug: founder-board
name: Board desk
tagline: Prepares board meetings from the real numbers, and tracks what was decided afterwards.
bots: 4
section: Founder OS
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Notion
  - Stripe
  - Calendar
  - Gmail
agents:
  - name: Board · Numbers
    persona: Pulls the operating numbers and shows the trend rather than a snapshot.
    icon: card
    connectors:
      - Stripe
  - name: Board · Pack
    persona: Drafts the board pack, leading with what went badly.
    icon: pen
    connectors:
      - Notion
  - name: Board · Actions
    persona: Tracks decisions and actions from the last meeting and whether they happened.
    icon: clipboard
    connectors:
      - Notion
  - name: Board · Schedule
    persona: Holds meeting dates and the deadline for circulating the pack.
    icon: calendar
    connectors:
      - Calendar
      - Gmail
rooms:
  - name: Board room
    members:
      - Board · Numbers
      - Board · Pack
      - Board · Actions
      - Board · Schedule
routines:
  - name: Action check
    owner: Board · Actions
    schedule: Every Monday at 09:00
    prompt: List board actions from last meeting and their status. Name anything not started.
  - name: Pack deadline
    owner: Board · Schedule
    schedule: Every weekday at 08:00
    prompt: Name the next board date and whether the pack is on track to circulate on time.
---

Four Bots around a board meeting. Leads with bad news by design.
