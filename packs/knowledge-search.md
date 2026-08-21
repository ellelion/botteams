---
slug: knowledge-search
name: Findability
tagline: Measures whether people can find what exists, and fixes the naming that stops them.
bots: 4
section: Knowledge
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Glean
  - Notion
  - Google Drive
agents:
  - name: Find · Failed
    persona: Reports searches that returned nothing useful.
    icon: search
    connectors:
      - Glean
  - name: Find · Naming
    persona: Names documents whose title does not match what anyone would search for.
    icon: pen
    connectors:
      - Notion
  - name: Find · Duplicates
    persona: Finds several documents answering the same question differently.
    icon: shield
    connectors:
      - Google Drive
  - name: Find · Recap
    persona: Reports what people looked for and could not find.
    icon: recap
    connectors:
      - Glean
rooms:
  - name: Findability desk
    members:
      - Find · Failed
      - Find · Naming
      - Find · Duplicates
      - Find · Recap
routines:
  - name: Failed search
    owner: Find · Failed
    schedule: Every Friday at 14:00
    prompt: List searches that returned nothing useful this week, most frequent first.
  - name: Duplicate scan
    owner: Find · Duplicates
    schedule: Every Monday at 11:00
    prompt: Find documents answering the same question differently. Name all copies.
---

Four Bots on whether knowledge can actually be found.
