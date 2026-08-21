---
slug: success-renewal
name: Renewal desk
tagline: Tracks every renewal far enough ahead to do something about it, with the case for renewing written from evidence.
bots: 4
section: Customer success
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - HubSpot
  - Stripe
  - Gmail
  - Calendar
agents:
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
---

Four Bots ahead of renewal dates. Builds the case, signs nothing.
