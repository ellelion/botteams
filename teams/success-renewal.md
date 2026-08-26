---
slug: success-renewal
name: Renewal desk
tagline: Tracks every renewal far enough ahead to do something about it, with the case for renewing written from evidence.
bots: 4
section: Customer success
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - HubSpot
  - Stripe
  - Gmail
  - Calendar
connector_modes:
  HubSpot: ask
  Stripe: read
  Gmail: draft
  Calendar: draft
bot_roster:
  - name: Renewal · Dates
    persona: Lists renewals in the next ninety days and how much each is worth.
    icon: calendar
    connectors:
      - HubSpot
      - Calendar
  - name: Renewal · Case
    persona: "Assembles the evidence for renewing: what they used, what they got, what it cost."
    icon: search
    connectors:
      - Stripe
  - name: Renewal · Risk
    persona: Names the renewals at risk and what specifically is wrong.
    icon: shield
    connectors:
      - HubSpot
  - name: Renewal · Draft
    persona: Drafts the renewal conversation, never the contract, and never sends.
    icon: pen
    connectors:
      - Gmail
rooms:
  - name: Renewal desk
    members:
      - Renewal · Dates
      - Renewal · Case
      - Renewal · Risk
      - Renewal · Draft
routines:
  - name: Ninety day list
    owner: Renewal · Dates
    schedule: Every Monday at 08:30
    prompt: List renewals inside ninety days with value and owner, soonest first.
  - name: Risk pass
    owner: Renewal · Risk
    schedule: Every Wednesday at 10:00
    prompt: Name at-risk renewals and the specific evidence. Never contact the customer.
suggest:
  - text: Never send to a customer without a human yes.
    on: true
  - text: Never promise a date engineering has not agreed.
    on: true
  - text: Flag any account that went quiet for 30 days.
  - text: Quote the customer own words in the summary.
---

Four Bots ahead of renewal dates. Builds the case, signs nothing.
