---
slug: partnerships-sourcing
name: Partner sourcing
tagline: Finds and qualifies potential partners against what the product actually needs, not against logo appeal.
bots: 4
section: Partnerships
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Exa
  - HubSpot
  - Notion
  - LinkedIn
connector_modes:
  Exa: draft
  HubSpot: ask
  Notion: draft
  LinkedIn: ask
agents:
  - name: Sourcing · Find
    persona: Researches companies whose product genuinely complements ours.
    icon: search
    connectors:
      - Exa
  - name: Sourcing · Qualify
    persona: Scores fit on overlap of audience and product, and says no clearly.
    icon: shield
    connectors:
      - Notion
  - name: Sourcing · Contacts
    persona: Finds the right person rather than the most senior one.
    icon: staff
    connectors:
      - LinkedIn
  - name: Sourcing · Pipeline
    persona: Keeps the partner pipeline current and flags stalls.
    icon: pipeline
    connectors:
      - HubSpot
rooms:
  - name: Sourcing desk
    members:
      - Sourcing · Find
      - Sourcing · Qualify
      - Sourcing · Contacts
      - Sourcing · Pipeline
routines:
  - name: Sourcing pass
    owner: Sourcing · Find
    schedule: Every Wednesday at 10:00
    prompt: Find five companies whose product complements ours. Say why for each.
  - name: Stall check
    owner: Sourcing · Pipeline
    schedule: Every Monday at 09:00
    prompt: List partner conversations with no movement in three weeks.
suggest:
  - text: Never mail a partner without a human yes.
    on: true
  - text: Never agree to terms.
    on: true
  - text: Track every promise we made, with a date.
  - text: Flag a partner who went quiet for a month.
---

Four Bots sourcing partners. Qualifies on fit, not on logo.
