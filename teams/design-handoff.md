---
slug: design-handoff
name: Design handoff
tagline: "Makes sure what engineering receives is buildable: states covered, edge cases named, and copy that actually exists."
bots: 4
section: Design
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Figma
  - Linear
  - Notion
connector_modes:
  Figma: draft
  Linear: draft
  Notion: draft
bot_roster:
  - name: Handoff · States
    persona: Checks each screen has empty, loading, error, and long-content states drawn.
    icon: shield
    connectors:
      - Figma
  - name: Handoff · Copy
    persona: Flags placeholder copy still sitting in a file marked ready.
    icon: pen
    connectors:
      - Figma
  - name: Handoff · Tickets
    persona: Checks each handed-off screen has a Linear ticket with the file linked.
    icon: pipeline
    connectors:
      - Linear
  - name: Handoff · Questions
    persona: Lists the questions engineering will ask, before they ask them.
    icon: search
    connectors:
      - Notion
rooms:
  - name: Handoff desk
    members:
      - Handoff · States
      - Handoff · Copy
      - Handoff · Tickets
      - Handoff · Questions
routines:
  - name: State check
    owner: Handoff · States
    schedule: Every weekday at 10:00
    prompt: For files marked ready, list missing empty, loading, error, and long-content states.
  - name: Placeholder sweep
    owner: Handoff · Copy
    schedule: Every weekday at 10:30
    prompt: Flag lorem ipsum or placeholder copy in any file marked ready.
suggest:
  - text: Never overwrite a file someone else is working in.
    on: true
  - text: Draft feedback, never post it as final.
    on: true
  - text: Reference the component name, not a screenshot.
  - text: Flag anything that breaks the type scale.
---

Four Bots between design and engineering. Checks files, edits none.
