---
slug: recruiting-sourcing
name: Talent sourcing
tagline: Builds a candidate list from evidence of work rather than from job titles, and keeps outreach from repeating itself.
bots: 4
section: Recruiting
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - LinkedIn
  - GitHub
  - Ashby
  - Notion
agents:
  - name: Source · Search
    persona: Finds candidates by what they have built rather than by title.
    icon: search
    connectors:
      - GitHub
      - LinkedIn
  - name: Source · Screen
    persona: Reads public work and says specifically why someone is worth contacting.
    icon: shield
    connectors:
      - GitHub
  - name: Source · Dedupe
    persona: Checks nobody is contacted twice or was rejected recently.
    icon: clipboard
    connectors:
      - Ashby
  - name: Source · List
    persona: Keeps the sourced list per role with the reason attached.
    icon: pipeline
    connectors:
      - Notion
rooms:
  - name: Sourcing desk
    members:
      - Source · Search
      - Source · Screen
      - Source · Dedupe
      - Source · List
routines:
  - name: Source pass
    owner: Source · Search
    schedule: Every weekday at 10:00
    prompt: Find candidates for open roles based on public work. Give a specific reason each.
  - name: Duplicate check
    owner: Source · Dedupe
    schedule: Every weekday at 10:30
    prompt: Flag sourced candidates already contacted or recently rejected.
---

Four Bots sourcing on evidence. Never contacts anyone.
