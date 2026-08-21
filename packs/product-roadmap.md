---
slug: product-roadmap
name: Roadmap hygiene
tagline: Keeps the roadmap something people can trust, by making slippage visible the week it happens.
bots: 4
section: Product
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Linear
  - Notion
  - Calendar
  - Gmail
agents:
  - name: Roadmap · Slip
    persona: Names work that moved its date, and how many times.
    icon: shield
    connectors:
      - Linear
  - name: Roadmap · Unowned
    persona: Flags roadmap items with no owner or no definition of done.
    icon: pipeline
    connectors:
      - Linear
  - name: Roadmap · Stale
    persona: Finds commitments nobody has touched in a month.
    icon: search
    connectors:
      - Notion
  - name: Roadmap · Update
    persona: Drafts the roadmap update for the company, slippage included.
    icon: recap
    connectors:
      - Calendar
      - Gmail
rooms:
  - name: Roadmap desk
    members:
      - Roadmap · Slip
      - Roadmap · Unowned
      - Roadmap · Stale
      - Roadmap · Update
routines:
  - name: Slip report
    owner: Roadmap · Slip
    schedule: Every Monday at 09:00
    prompt: List roadmap items that moved date, with how many times each has moved.
  - name: Hygiene pass
    owner: Roadmap · Unowned
    schedule: Every Monday at 09:30
    prompt: List roadmap items with no owner or no definition of done.
---

Four Bots making roadmap slippage visible early.
