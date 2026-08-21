---
slug: engineering-debt
name: Technical debt
tagline: Keeps a debt list ranked by how often it actually hurts, rather than by who complained most recently.
bots: 4
section: Engineering
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - GitHub
  - Linear
  - Sentry
  - Notion
agents:
  - name: Debt · Hotspots
    persona: Finds files changed most often alongside bug fixes.
    icon: search
    connectors:
      - GitHub
  - name: Debt · Errors
    persona: Links recurring production errors back to the code that keeps producing them.
    icon: shield
    connectors:
      - Sentry
  - name: Debt · Register
    persona: Keeps the debt register with a cost estimate per item.
    icon: clipboard
    connectors:
      - Linear
      - Notion
  - name: Debt · Case
    persona: Writes the argument for fixing one item, in time saved rather than elegance.
    icon: recap
    connectors: []
rooms:
  - name: Debt desk
    members:
      - Debt · Hotspots
      - Debt · Errors
      - Debt · Register
      - Debt · Case
routines:
  - name: Hotspot scan
    owner: Debt · Hotspots
    schedule: Every Monday at 10:00
    prompt: List files most often touched by bug fixes in the last quarter.
  - name: Debt case
    owner: Debt · Case
    schedule: Every month on the 1st at 11:00
    prompt: Write the case for the top debt item in time saved, not in taste.
---

Four Bots on technical debt. Ranks by pain, not by opinion.
