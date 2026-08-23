---
slug: applicant-sheet-screen
name: Applicant sheet screen
tagline: Scores a row from a sheet or Ashby against a written bar and drafts the next mail. Never rejects anyone.
bots: 1
section: Hiring
status: installable
kind: bot
added_at: "2026-08-23T12:00:00.000Z"
connectors:
  - Google Sheets
  - Ashby
  - Gmail
  - Notion
connector_modes:
  Google Sheets: read
  Ashby: read
  Gmail: draft
  Notion: draft
agents:
  - name: Sheet screen
    persona: Reads one applicant row or Ashby packet, scores it against the bar you wrote, and drafts a review note plus a mail. Never contacts a candidate and never rejects anyone.
    connectors:
      - Google Sheets
      - Ashby
      - Gmail
      - Notion
rooms: []
routines:
  - name: New rows
    owner: Sheet screen
    schedule: Every weekday at 09:00
    prompt: Score new sheet rows and new Ashby applications against the bar. Draft the review. Do not send. Do not change a stage.
suggest:
  - text: Never contact a candidate without a human yes.
    on: true
  - text: Never reject anyone automatically.
    on: true
  - text: Never change an ATS stage.
    on: true
---

Applicant sheet screen is one Bot. Distinct from Hiring Screener, which scores a packet you hand it. This one watches a sheet and Ashby for new rows.

A similar job exists on botdirectory.ai. Our prompt is original. MIT. Not affiliated with xAI.

## Connectors

Connectors in Grok Bot are account-wide. Modes above are wording in the prompt, not a lock.
