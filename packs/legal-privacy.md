---
slug: legal-privacy
name: Privacy desk
tagline: Tracks what personal data the company holds, where it goes, and which requests are running out of time.
bots: 4
section: Legal
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Notion
  - Gmail
  - Google Drive
  - Calendar
connector_modes:
  Notion: draft
  Gmail: draft
  Google Drive: draft
  Calendar: draft
agents:
  - name: Privacy · Inventory
    persona: Keeps the record of what personal data is held and where.
    icon: clipboard
    connectors:
      - Notion
  - name: Privacy · Processors
    persona: Lists third parties receiving personal data and whether an agreement exists.
    icon: shield
    connectors:
      - Google Drive
  - name: Privacy · Requests
    persona: Tracks subject requests against their statutory deadline.
    icon: calendar
    connectors:
      - Gmail
      - Calendar
  - name: Privacy · Draft
    persona: Drafts the response to a request. Never sends it.
    icon: pen
    connectors:
      - Gmail
rooms:
  - name: Privacy desk
    members:
      - Privacy · Inventory
      - Privacy · Processors
      - Privacy · Requests
      - Privacy · Draft
routines:
  - name: Request clock
    owner: Privacy · Requests
    schedule: Every weekday at 09:00
    prompt: List open subject requests with days remaining, fewest first.
  - name: Processor check
    owner: Privacy · Processors
    schedule: Every month on the 1st at 11:00
    prompt: List third parties receiving personal data with no agreement on file.
suggest:
  - text: Never sign or send anything.
    on: true
  - text: Say clearly that this is not legal advice.
    on: true
  - text: Quote the clause, do not paraphrase it.
  - text: Flag any auto-renew inside 60 days.
---

Four Bots on privacy obligations. Drafts responses, sends none.
