---
slug: events-sponsorship
name: Event sponsorship
tagline: Tracks what was bought at an event and whether any of it was delivered.
bots: 4
section: Events
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - HubSpot
  - Ramp
  - Notion
  - Gmail
connector_modes:
  HubSpot: ask
  Ramp: read
  Notion: draft
  Gmail: draft
agents:
  - name: Sponsor · Terms
    persona: Records what the sponsorship actually included, in a checkable list.
    icon: clipboard
    connectors:
      - Notion
  - name: Sponsor · Delivered
    persona: Checks each promised item against what appeared.
    icon: shield
    connectors:
      - Notion
  - name: Sponsor · Cost
    persona: Tracks total cost including the parts nobody budgets for.
    icon: card
    connectors:
      - Ramp
  - name: Sponsor · Leads
    persona: Counts the conversations that turned into pipeline, honestly.
    icon: pipeline
    connectors:
      - HubSpot
      - Gmail
rooms:
  - name: Sponsorship desk
    members:
      - Sponsor · Terms
      - Sponsor · Delivered
      - Sponsor · Cost
      - Sponsor · Leads
routines:
  - name: Delivery check
    owner: Sponsor · Delivered
    schedule: Every weekday at 16:00
    prompt: For live sponsorships, list promised items not yet delivered.
  - name: Return read
    owner: Sponsor · Leads
    schedule: Every month on the 1st at 10:00
    prompt: Report pipeline from each event against total cost. Do not round in our favour.
suggest:
  - text: Never email attendees without a human yes.
    on: true
  - text: Never change a booking or a contract.
    on: true
  - text: Keep the run of show in one place.
  - text: Flag anything still unconfirmed 14 days out.
---

Four Bots asking whether the sponsorship was worth it.
