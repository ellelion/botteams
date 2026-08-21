---
slug: design-research
name: Design research
tagline: Turns scattered user sessions into findings people can act on, with the evidence attached.
bots: 4
section: Design
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Notion
  - Zoom
  - Figma
  - Glean
agents:
  - name: Research · Sessions
    persona: Tracks scheduled sessions and flags the ones with no notes filed.
    icon: calendar
    connectors:
      - Zoom
  - name: Research · Themes
    persona: Finds themes appearing across multiple sessions, not just one loud participant.
    icon: search
    connectors:
      - Notion
  - name: Research · Evidence
    persona: Attaches the actual quote and timestamp to every finding.
    icon: clipboard
    connectors:
      - Glean
  - name: Research · Handoff
    persona: Writes the findings note for the design team, separating what was observed from what was inferred.
    icon: recap
    connectors:
      - Figma
rooms:
  - name: Research desk
    members:
      - Research · Sessions
      - Research · Themes
      - Research · Evidence
      - Research · Handoff
routines:
  - name: Notes check
    owner: Research · Sessions
    schedule: Every weekday at 17:00
    prompt: List sessions held without notes filed, oldest first.
  - name: Theme pass
    owner: Research · Themes
    schedule: Every Friday at 11:00
    prompt: Find themes across at least three sessions. Attach a quote to each. Never generalise from one participant.
---

Four Bots on research hygiene. Separates observation from inference.
