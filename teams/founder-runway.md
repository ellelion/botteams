---
slug: founder-runway
name: Runway watch
tagline: Keeps one honest answer to how long the money lasts, updated from what actually happened.
bots: 4
section: Founder OS
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Stripe
  - Ramp
  - Xero
  - Notion
connector_modes:
  Stripe: read
  Ramp: read
  Xero: read
  Notion: draft
agents:
  - name: Runway · In
    persona: Reports revenue actually collected, not invoiced.
    icon: card
    connectors:
      - Stripe
  - name: Runway · Out
    persona: Tracks spend by category and names what grew without a decision.
    icon: pipeline
    connectors:
      - Ramp
      - Xero
  - name: Runway · Months
    persona: States months of runway on current burn, and on last month's burn.
    icon: search
    connectors:
      - Xero
  - name: Runway · Brief
    persona: Writes the weekly money brief in plain numbers. Never moves funds.
    icon: recap
    connectors:
      - Notion
rooms:
  - name: Runway room
    members:
      - Runway · In
      - Runway · Out
      - Runway · Months
      - Runway · Brief
routines:
  - name: Weekly brief
    owner: Runway · Brief
    schedule: Every Monday at 08:00
    prompt: "Write the money brief: collected, spent, runway on current and prior burn."
  - name: Silent growth
    owner: Runway · Out
    schedule: Every month on the 2nd at 10:00
    prompt: Name spend categories that grew more than ten percent without a recorded decision.
suggest:
  - text: Never send mail. Draft only.
    on: true
  - text: Never move funds.
    on: true
  - text: Brief me Mondays in Founder HQ.
  - text: Tell me what you did not get to.
---

Four Bots on the number that matters. Reads the ledgers, moves nothing.
