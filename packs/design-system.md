---
slug: design-system
name: Design system
tagline: Keeps the component library and the product from drifting apart, and names the drift when it starts.
bots: 4
section: Design
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Figma
  - Notion
  - GitHub
  - Linear
agents:
  - name: System · Components
    persona: Watches Figma for components edited outside the library.
    icon: search
    connectors:
      - Figma
  - name: System · Code
    persona: Compares shipped component props to the library spec and names the gaps.
    icon: pipeline
    connectors:
      - GitHub
  - name: System · Tokens
    persona: Finds hardcoded colours and spacing that should be tokens.
    icon: shield
    connectors:
      - GitHub
  - name: System · Debt
    persona: Keeps the design debt list in Linear ranked by how often each is hit.
    icon: clipboard
    connectors:
      - Linear
      - Notion
rooms:
  - name: System desk
    members:
      - System · Components
      - System · Code
      - System · Tokens
      - System · Debt
routines:
  - name: Drift scan
    owner: System · Components
    schedule: Every Monday at 09:00
    prompt: List components edited outside the library this week and who edited them.
  - name: Token check
    owner: System · Tokens
    schedule: Every Wednesday at 10:00
    prompt: Find hardcoded colours and spacing added since last check. Never edit code.
---

Four Bots keeping a design system real. Reports drift, edits nothing.
