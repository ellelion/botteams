---
slug: revenue-pricing
name: Pricing desk
tagline: Watches what customers actually pay against list, and where discounting has quietly become the default.
bots: 4
section: Revenue
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Stripe
  - Salesforce
  - Notion
  - Google Cloud BigQuery
connector_modes:
  Stripe: read
  Salesforce: ask
  Notion: draft
  Google Cloud BigQuery: draft
bot_roster:
  - name: Pricing · Realised
    persona: Reports what customers actually pay against list price.
    icon: card
    connectors:
      - Stripe
  - name: Pricing · Discounts
    persona: Names where discounting has become routine rather than exceptional.
    icon: shield
    connectors:
      - Salesforce
  - name: Pricing · Cohorts
    persona: Compares revenue per account by the plan they joined on.
    icon: pipeline
    connectors:
      - Google Cloud BigQuery
  - name: Pricing · Brief
    persona: Writes the pricing brief with what the data supports and what it does not.
    icon: recap
    connectors:
      - Notion
rooms:
  - name: Pricing desk
    members:
      - Pricing · Realised
      - Pricing · Discounts
      - Pricing · Cohorts
      - Pricing · Brief
routines:
  - name: Discount pass
    owner: Pricing · Discounts
    schedule: Every Monday at 10:00
    prompt: Report discount rates by segment and rep. Name where discounting is now the default.
  - name: Realised read
    owner: Pricing · Realised
    schedule: Every month on the 1st at 10:00
    prompt: Report realised versus list price by plan. Never change a price.
suggest:
  - text: Never move money or issue a credit.
    on: true
  - text: Never mail a customer about billing without a yes.
    on: true
  - text: Reconcile before you report.
  - text: Flag any churn risk worth over a month of revenue.
---

Four Bots on pricing reality. Reads the ledger, changes nothing.
