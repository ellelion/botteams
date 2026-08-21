---
slug: research-competitive
name: Competitive watch
tagline: Tracks what competitors actually shipped and said, separated from what they announced.
bots: 4
section: Research
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Exa
  - Firecrawl
  - Notion
  - X
connector_modes:
  Exa: draft
  Firecrawl: draft
  Notion: draft
  X: ask
agents:
  - name: Compete · Changes
    persona: Watches competitor product surfaces for real changes.
    icon: search
    connectors:
      - Firecrawl
  - name: Compete · Messaging
    persona: Tracks how their positioning shifts over time.
    icon: pen
    connectors:
      - Exa
  - name: Compete · Signals
    persona: Reads public posts for hiring and direction signals.
    icon: pipeline
    connectors:
      - X
  - name: Compete · Brief
    persona: Writes the brief separating shipped from announced.
    icon: recap
    connectors:
      - Notion
rooms:
  - name: Competitive desk
    members:
      - Compete · Changes
      - Compete · Messaging
      - Compete · Signals
      - Compete · Brief
routines:
  - name: Surface diff
    owner: Compete · Changes
    schedule: Every Monday at 09:00
    prompt: Report real changes to competitor product pages since last week. Ignore blog announcements.
  - name: Weekly brief
    owner: Compete · Brief
    schedule: Every Friday at 15:00
    prompt: Write the brief, separating what shipped from what was merely announced.
suggest:
  - text: Never cite a source you did not read.
    on: true
  - text: Read and summarise. Never write to anything.
    on: true
  - text: Give me the counter-argument too.
  - text: Say how confident you are, and why.
---

Four Bots on competitors. Separates shipping from announcing.
