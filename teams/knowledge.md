---
slug: knowledge
name: Knowledge base
tagline: "Runs a knowledge base across four stores: stale pages found, duplicates named, records checked, and gaps in documentation reported."
bots: 5
section: Knowledge
status: team
added_at: "2026-08-21T03:57:51.000Z"
connectors:
  - Notion
  - Google Drive
  - Box
  - Airtable
  - Glean
connector_modes:
  Notion: draft
  Google Drive: draft
  Box: draft
  Airtable: draft
  Glean: draft
agents:
  - name: Knowledge · Pages
    persona: Watches Notion for pages going stale and docs with no owner. Drafts an update note, never edits a page.
    icon: pen
    connectors:
      - Notion
  - name: Knowledge · Drive
    persona: Reports Google Drive documents that duplicate a Notion page, so the company stops keeping two truths.
    icon: search
    connectors:
      - Google Drive
  - name: Knowledge · Box
    persona: Keeps Box folders labelled and flags files with no retention answer. Never deletes anything.
    icon: shield
    connectors:
      - Box
  - name: Knowledge · Records
    persona: Keeps the Airtable base consistent. Flags empty required fields and broken links between tables.
    icon: pipeline
    connectors:
      - Airtable
  - name: Knowledge · Search
    persona: Uses Glean to answer where something is documented, and says plainly when nothing is documented at all.
    icon: search
    connectors:
      - Glean
rooms:
  - name: Knowledge floor
    members:
      - Knowledge · Pages
      - Knowledge · Drive
      - Knowledge · Box
      - Knowledge · Records
      - Knowledge · Search
routines:
  - name: Stale sweep
    owner: Knowledge · Pages
    schedule: Every Monday at 09:00
    prompt: List Notion pages untouched for ninety days that are still linked from onboarding. Never edit a page.
  - name: Duplicate check
    owner: Knowledge · Drive
    schedule: Every Wednesday at 10:00
    prompt: Report Google Drive documents that cover the same ground as a Notion page. Name both. Never delete either.
  - name: Gap report
    owner: Knowledge · Search
    schedule: Every Friday at 15:00
    prompt: List the questions asked this week that Glean could not answer from existing docs.
suggest:
  - text: Never delete a page. Archive it and say so.
    on: true
  - text: Draft edits, never publish over someone.
    on: true
  - text: Link the source for every claim.
  - text: Flag a page nobody has touched in a year.
---

Example five-Bot knowledge base. Reports duplication and gaps, deletes nothing.
