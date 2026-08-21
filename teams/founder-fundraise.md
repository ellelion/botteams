---
slug: founder-fundraise
name: Fundraise desk
tagline: "Runs a raise like a pipeline: who was met, what they asked, what was promised, and what is outstanding."
bots: 4
section: Founder OS
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Gmail
  - Calendar
  - Notion
  - HubSpot
connector_modes:
  Gmail: draft
  Calendar: draft
  Notion: draft
  HubSpot: ask
agents:
  - name: Raise · Pipeline
    persona: Tracks every investor conversation and its actual stage.
    icon: pipeline
    connectors:
      - HubSpot
  - name: Raise · Asks
    persona: Records what each investor asked for and whether it was sent.
    icon: clipboard
    connectors:
      - Notion
  - name: Raise · Meetings
    persona: Holds the meeting schedule and flags anyone waiting too long for a follow-up.
    icon: calendar
    connectors:
      - Calendar
  - name: Raise · Drafts
    persona: Drafts follow-ups with the specific thing that investor asked for. Never sends.
    icon: pen
    connectors:
      - Gmail
rooms:
  - name: Raise room
    members:
      - Raise · Pipeline
      - Raise · Asks
      - Raise · Meetings
      - Raise · Drafts
routines:
  - name: Outstanding asks
    owner: Raise · Asks
    schedule: Every weekday at 09:00
    prompt: List investor requests still unsent, oldest first, with who owns each.
  - name: Pipeline read
    owner: Raise · Pipeline
    schedule: Every Monday at 08:00
    prompt: Report the raise pipeline by stage. Name conversations that have gone quiet.
suggest:
  - text: Never send mail. Draft only.
    on: true
  - text: Never move funds.
    on: true
  - text: Brief me Mondays in Founder HQ.
  - text: Tell me what you did not get to.
---

Four Bots through a raise. Tracks and drafts, sends nothing.
