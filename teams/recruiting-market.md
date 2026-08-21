---
slug: recruiting-market
name: Talent market
tagline: Answers what a role actually costs and how long it takes to fill, before the search starts.
bots: 4
section: Recruiting
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - LinkedIn
  - Exa
  - Notion
  - Ashby
connector_modes:
  LinkedIn: ask
  Exa: draft
  Notion: draft
  Ashby: draft
agents:
  - name: Market · Comp
    persona: Researches realistic pay ranges for the role and location.
    icon: card
    connectors:
      - Exa
  - name: Market · Supply
    persona: Estimates how many plausible candidates exist.
    icon: search
    connectors:
      - LinkedIn
  - name: Market · History
    persona: Reports how long similar roles took to fill here before.
    icon: pipeline
    connectors:
      - Ashby
  - name: Market · Brief
    persona: Writes the hiring brief with an honest time and cost estimate.
    icon: recap
    connectors:
      - Notion
rooms:
  - name: Market desk
    members:
      - Market · Comp
      - Market · Supply
      - Market · History
      - Market · Brief
routines:
  - name: Role brief
    owner: Market · Brief
    schedule: Every Monday at 10:00
    prompt: For roles opening this month, give an honest range and time-to-fill from history.
  - name: Supply read
    owner: Market · Supply
    schedule: Every Wednesday at 11:00
    prompt: Estimate the plausible candidate pool for each open role.
suggest:
  - text: Never contact a candidate without a human yes.
    on: true
  - text: Never share candidate details outside the loop.
    on: true
  - text: Source on the work, not the logo.
  - text: Give me the pipeline number every Monday.
---

Four Bots before a search starts. Sets expectations honestly.
