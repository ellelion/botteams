---
slug: partnerships-reseller
name: Reseller channel
tagline: Keeps channel partners selling accurately, and makes deal registration something people actually do.
bots: 4
section: Partnerships
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - HubSpot
  - Salesforce
  - Gmail
  - Notion
connector_modes:
  HubSpot: ask
  Salesforce: ask
  Gmail: draft
  Notion: draft
agents:
  - name: Channel · Deals
    persona: Tracks registered deals and flags conflicts with direct sales.
    icon: pipeline
    connectors:
      - Salesforce
  - name: Channel · Enablement
    persona: Names partners using outdated materials or wrong pricing.
    icon: shield
    connectors:
      - Notion
  - name: Channel · Performance
    persona: Reports which partners actually close, not just register.
    icon: search
    connectors:
      - HubSpot
  - name: Channel · Drafts
    persona: Drafts partner communications. Never sends them.
    icon: pen
    connectors:
      - Gmail
rooms:
  - name: Channel desk
    members:
      - Channel · Deals
      - Channel · Enablement
      - Channel · Performance
      - Channel · Drafts
routines:
  - name: Conflict check
    owner: Channel · Deals
    schedule: Every weekday at 09:00
    prompt: Flag registered partner deals that overlap a direct opportunity.
  - name: Performance read
    owner: Channel · Performance
    schedule: Every month on the 1st at 10:00
    prompt: Report registered versus closed per partner. Name partners registering but never closing.
suggest:
  - text: Never mail a partner without a human yes.
    on: true
  - text: Never agree to terms.
    on: true
  - text: Track every promise we made, with a date.
  - text: Flag a partner who went quiet for a month.
---

Four Bots on the reseller channel. Flags conflicts, sends nothing.
