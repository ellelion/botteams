---
slug: sales-territory
name: Territory planning
tagline: Splits accounts so coverage is even and no account sits unowned for a quarter.
bots: 4
section: Sales
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Salesforce
  - HubSpot
  - Notion
  - Google Cloud BigQuery
agents:
  - name: Territory · Coverage
    persona: Finds accounts with no owner or no contact this quarter.
    icon: shield
    connectors:
      - Salesforce
  - name: Territory · Balance
    persona: Reports whether territories are actually balanced by opportunity.
    icon: pipeline
    connectors:
      - Google Cloud BigQuery
  - name: Territory · Fit
    persona: Names accounts that look like existing customers who did well.
    icon: search
    connectors:
      - HubSpot
  - name: Territory · Plan
    persona: Drafts the territory plan with the reasoning shown.
    icon: recap
    connectors:
      - Notion
rooms:
  - name: Territory desk
    members:
      - Territory · Coverage
      - Territory · Balance
      - Territory · Fit
      - Territory · Plan
routines:
  - name: Coverage gap
    owner: Territory · Coverage
    schedule: Every Monday at 09:00
    prompt: List accounts with no owner or no contact this quarter.
  - name: Balance read
    owner: Territory · Balance
    schedule: Every quarter on the 1st at 10:00
    prompt: Report territory balance by opportunity value, not by account count.
---

Four Bots on coverage. Names gaps, reassigns nothing.
