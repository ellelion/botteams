---
slug: investor-metrics
name: Investor metrics
tagline: Assembles the same metrics the same way every month, so the trend means something across a year of updates.
bots: 4
section: Investor updates
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Stripe
  - Google Cloud BigQuery
  - Notion
  - Xero
connector_modes:
  Stripe: read
  Google Cloud BigQuery: draft
  Notion: draft
  Xero: read
agents:
  - name: Metrics · Revenue
    persona: Pulls recognised revenue and separates new, expansion, and churn.
    icon: card
    connectors:
      - Stripe
  - name: Metrics · Usage
    persona: Reports the product metric promised to investors, computed the same way as last month.
    icon: pipeline
    connectors:
      - Google Cloud BigQuery
  - name: Metrics · Cash
    persona: Reports cash in bank and burn from the ledger, not from a forecast.
    icon: search
    connectors:
      - Xero
  - name: Metrics · Consistency
    persona: Flags any metric computed differently than last month and says how.
    icon: shield
    connectors:
      - Notion
rooms:
  - name: Metrics desk
    members:
      - Metrics · Revenue
      - Metrics · Usage
      - Metrics · Cash
      - Metrics · Consistency
routines:
  - name: Monthly pull
    owner: Metrics · Revenue
    schedule: Every month on the 1st at 09:00
    prompt: Pull last month's revenue split into new, expansion, and churn.
  - name: Consistency check
    owner: Metrics · Consistency
    schedule: Every month on the 2nd at 09:00
    prompt: Compare this month's definitions to last month. Name any that changed.
suggest:
  - text: Never send to investors without a human yes.
    on: true
  - text: Never state a number you cannot source.
    on: true
  - text: Keep the update to one page.
  - text: Lead with the bad news.
---

Four Bots assembling investor numbers consistently. Read-only.
