---
slug: product-discovery
name: Discovery desk
tagline: Keeps product decisions attached to evidence, and says plainly when there is none.
bots: 4
section: Product
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Notion
  - Mixpanel
  - Intercom
  - Glean
connector_modes:
  Notion: draft
  Mixpanel: draft
  Intercom: ask
  Glean: draft
agents:
  - name: Discovery · Questions
    persona: Turns a vague product idea into the question that would settle it.
    icon: search
    connectors:
      - Notion
  - name: Discovery · Data
    persona: Answers what the data already says before anyone runs a study.
    icon: pipeline
    connectors:
      - Mixpanel
  - name: Discovery · Voice
    persona: Finds what customers already said about the area.
    icon: inbox
    connectors:
      - Intercom
  - name: Discovery · Gap
    persona: States plainly when a decision has no evidence behind it.
    icon: shield
    connectors:
      - Glean
rooms:
  - name: Discovery desk
    members:
      - Discovery · Questions
      - Discovery · Data
      - Discovery · Voice
      - Discovery · Gap
routines:
  - name: Evidence check
    owner: Discovery · Gap
    schedule: Every weekday at 10:00
    prompt: For decisions on the roadmap this week, state what evidence exists. Say plainly when there is none.
  - name: Prior art
    owner: Discovery · Voice
    schedule: Every Wednesday at 11:00
    prompt: For active discovery areas, find what customers already told us.
suggest:
  - text: Never change a roadmap date without asking.
    on: true
  - text: Draft specs, never ship them as decided.
    on: true
  - text: Tie every request to the person who asked.
  - text: Say what we are choosing not to build.
---

Four Bots keeping product decisions honest about evidence.
