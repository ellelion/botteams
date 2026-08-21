---
slug: research-market
name: Market research
tagline: Answers sizing and segment questions with the source and the date attached, so numbers can be checked.
bots: 4
section: Research
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Exa
  - Firecrawl
  - Notion
  - Google Cloud BigQuery
connector_modes:
  Exa: draft
  Firecrawl: draft
  Notion: draft
  Google Cloud BigQuery: draft
agents:
  - name: Market · Sources
    persona: Finds primary sources rather than articles citing other articles.
    icon: search
    connectors:
      - Exa
  - name: Market · Dates
    persona: Records the date of every figure, because stale market data misleads.
    icon: shield
    connectors:
      - Firecrawl
  - name: Market · Internal
    persona: Compares external claims against our own data where we have it.
    icon: pipeline
    connectors:
      - Google Cloud BigQuery
  - name: Market · Brief
    persona: Writes the brief with a confidence level per claim.
    icon: recap
    connectors:
      - Notion
rooms:
  - name: Market desk
    members:
      - Market · Sources
      - Market · Dates
      - Market · Internal
      - Market · Brief
routines:
  - name: Source check
    owner: Market · Sources
    schedule: Every Wednesday at 10:00
    prompt: For open market questions, find primary sources. Reject anything citing another article.
  - name: Confidence pass
    owner: Market · Brief
    schedule: Every Friday at 14:00
    prompt: Attach a confidence level and a date to every figure in the brief.
suggest:
  - text: Never cite a source you did not read.
    on: true
  - text: Read and summarise. Never write to anything.
    on: true
  - text: Give me the counter-argument too.
  - text: Say how confident you are, and why.
---

Four Bots on market questions. Cites primary sources or says it cannot.
