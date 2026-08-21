---
slug: research-customer
name: Customer research
tagline: Keeps a running picture of what customers say, built from evidence with the quote attached.
bots: 4
section: Research
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Intercom
  - Zendesk
  - Notion
  - Glean
connector_modes:
  Intercom: ask
  Zendesk: ask
  Notion: draft
  Glean: draft
agents:
  - name: Customer · Gather
    persona: Collects what customers said across support and chat.
    icon: inbox
    connectors:
      - Intercom
      - Zendesk
  - name: Customer · Theme
    persona: Finds themes appearing across many accounts, not one loud one.
    icon: search
    connectors:
      - Notion
  - name: Customer · Quote
    persona: Attaches a real quote to every claim made.
    icon: clipboard
    connectors:
      - Glean
  - name: Customer · Brief
    persona: Writes the brief separating what was said from what was inferred.
    icon: recap
    connectors:
      - Notion
rooms:
  - name: Customer research desk
    members:
      - Customer · Gather
      - Customer · Theme
      - Customer · Quote
      - Customer · Brief
routines:
  - name: Theme pass
    owner: Customer · Theme
    schedule: Every Friday at 11:00
    prompt: Find themes across at least five accounts this week. Attach a quote to each.
  - name: Inference check
    owner: Customer · Brief
    schedule: Every Friday at 15:00
    prompt: Rewrite the brief separating observed statements from inferences.
suggest:
  - text: Never cite a source you did not read.
    on: true
  - text: Read and summarise. Never write to anything.
    on: true
  - text: Give me the counter-argument too.
  - text: Say how confident you are, and why.
---

Four Bots on customer evidence. Quotes everything it claims.
