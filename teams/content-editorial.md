---
slug: content-editorial
name: Editorial standards
tagline: Reads drafts before a human editor does, catching claims without sources, house-style breaks, and the things that get fixed at the last minute.
bots: 4
section: Content
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Notion
  - Google Drive
  - Gmail
connector_modes:
  Notion: draft
  Google Drive: draft
  Gmail: draft
bot_roster:
  - name: Editorial · Claims
    persona: Flags every factual claim without a source and every number without a date.
    icon: shield
    connectors:
      - Notion
  - name: Editorial · Style
    persona: Checks a draft against the house style sheet and lists the breaks, quoting each one.
    icon: pen
    connectors:
      - Notion
  - name: Editorial · Links
    persona: Checks links resolve and that nothing points at a competitor by accident.
    icon: search
    connectors:
      - Google Drive
  - name: Editorial · Handoff
    persona: "Writes the note the human editor reads first: what is solid, what needs a decision."
    icon: recap
    connectors:
      - Gmail
rooms:
  - name: Editorial desk
    members:
      - Editorial · Claims
      - Editorial · Style
      - Editorial · Links
      - Editorial · Handoff
routines:
  - name: Draft review
    owner: Editorial · Claims
    schedule: Every weekday at 11:00
    prompt: For drafts marked ready, flag claims without a source and numbers without a date.
  - name: Style pass
    owner: Editorial · Style
    schedule: Every weekday at 11:30
    prompt: Check drafts against the house style sheet. Quote each break. Never rewrite the draft yourself.
suggest:
  - text: Never publish. Draft only.
    on: true
  - text: Never claim a number you cannot source.
    on: true
  - text: Keep every draft in our house voice.
  - text: Flag anything that reads like a legal claim.
---

Four Bots ahead of the editor. Marks up drafts, never rewrites them.
