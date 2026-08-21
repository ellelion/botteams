---
slug: revenue-forecast
name: Revenue forecast
tagline: Builds a forecast from committed evidence and shows how wrong the last one was.
bots: 4
section: Revenue
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - HubSpot
  - Salesforce
  - Stripe
  - Notion
connector_modes:
  HubSpot: ask
  Salesforce: ask
  Stripe: read
  Notion: draft
agents:
  - name: Forecast · Commit
    persona: Separates committed pipeline from optimistic pipeline.
    icon: pipeline
    connectors:
      - Salesforce
  - name: Forecast · History
    persona: Reports how accurate the last three forecasts were.
    icon: search
    connectors:
      - Notion
  - name: Forecast · Recurring
    persona: Reads Stripe for the recurring base beneath the forecast.
    icon: card
    connectors:
      - Stripe
  - name: Forecast · Risk
    persona: Names the deals the forecast depends on most.
    icon: shield
    connectors:
      - HubSpot
rooms:
  - name: Forecast desk
    members:
      - Forecast · Commit
      - Forecast · History
      - Forecast · Recurring
      - Forecast · Risk
routines:
  - name: Weekly forecast
    owner: Forecast · Commit
    schedule: Every Monday at 08:00
    prompt: Report committed versus optimistic pipeline. Name the three deals the number depends on.
  - name: Accuracy check
    owner: Forecast · History
    schedule: Every month on the 1st at 09:00
    prompt: Report how wrong the last three forecasts were, and in which direction.
suggest:
  - text: Never move money or issue a credit.
    on: true
  - text: Never mail a customer about billing without a yes.
    on: true
  - text: Reconcile before you report.
  - text: Flag any churn risk worth over a month of revenue.
---

Four Bots on forecasting. Shows its own error rate.
