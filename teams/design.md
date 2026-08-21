---
slug: design
name: Design studio
tagline: "Runs a design studio: Figma comments chased, assets tracked, specs drafted for engineering, and board hygiene kept after sessions."
bots: 5
section: Design
status: installable
kind: team
added_at: "2026-08-21T03:57:51.000Z"
connectors:
  - Figma
  - Canva
  - Notion
  - Miro
connector_modes:
  Figma: draft
  Canva: draft
  Notion: draft
  Miro: draft
agents:
  - name: Design · Files
    persona: Watches Figma for new pages and comments left unanswered. Summarises what changed. Never edits a file.
    icon: search
    connectors:
      - Figma
  - name: Design · Assets
    persona: Keeps the Canva asset list tidy and reports what is missing for upcoming work. Drafts only, never publishes.
    icon: pen
    connectors:
      - Canva
  - name: Design · Specs
    persona: Turns design decisions into a Notion spec draft. Writes for engineers. Never marks a spec approved.
    icon: pen
    connectors:
      - Notion
  - name: Design · Board
    persona: Watches the Miro board for orphaned stickies and unclosed threads after a session.
    icon: pipeline
    connectors:
      - Miro
  - name: Design · Recap
    persona: Writes the studio recap. What moved, what needs review, what is blocked on a decision.
    icon: recap
    connectors: []
rooms:
  - name: Design studio
    members:
      - Design · Files
      - Design · Assets
      - Design · Specs
      - Design · Board
      - Design · Recap
routines:
  - name: Comment sweep
    owner: Design · Files
    schedule: Every weekday at 10:00
    prompt: List Figma comments with no reply for more than a day. Name the file and the person waiting. Never reply for them.
  - name: Spec draft
    owner: Design · Specs
    schedule: Every Wednesday at 14:00
    prompt: Draft or update the Notion spec for work that reached visual sign-off. Mark open questions clearly.
  - name: Studio recap
    owner: Design · Recap
    schedule: Every weekday at 17:00
    prompt: Recap file changes, asset gaps, spec drafts, and anything waiting on a human decision.
suggest:
  - text: Never overwrite a file someone else is working in.
    on: true
  - text: Draft feedback, never post it as final.
    on: true
  - text: Reference the component name, not a screenshot.
  - text: Flag anything that breaks the type scale.
---

Example five-Bot design studio. No file edits, no publishing.
