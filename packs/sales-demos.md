---
slug: sales-demos
name: Demo desk
tagline: Prepares demos against the prospect's actual problem, and records what was promised in the room.
bots: 4
section: Sales
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - HubSpot
  - Calendar
  - Gong
  - Notion
agents:
  - name: Demo · Prep
    persona: Assembles what is known about the account before the call.
    icon: clipboard
    connectors:
      - HubSpot
  - name: Demo · Plan
    persona: Drafts the demo plan around their stated problem, not the standard tour.
    icon: pen
    connectors:
      - Notion
  - name: Demo · Promises
    persona: Pulls commitments made during the call from the recording.
    icon: shield
    connectors:
      - Gong
  - name: Demo · Follow
    persona: Drafts the follow-up covering exactly what was promised. Never sends.
    icon: inbox
    connectors:
      - Calendar
rooms:
  - name: Demo desk
    members:
      - Demo · Prep
      - Demo · Plan
      - Demo · Promises
      - Demo · Follow
routines:
  - name: Prep pack
    owner: Demo · Prep
    schedule: Every weekday at 08:00
    prompt: For today's demos, assemble what is known and what to ask.
  - name: Promise pull
    owner: Demo · Promises
    schedule: Every weekday at 17:00
    prompt: From today's calls, list every commitment made to a prospect and who owns it.
---

Four Bots around demos. Records promises, makes none.
