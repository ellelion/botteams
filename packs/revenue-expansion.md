---
slug: revenue-expansion
name: Expansion desk
tagline: Finds accounts that have outgrown their plan, and separates that from accounts simply being squeezed.
bots: 4
section: Revenue
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - HubSpot
  - Mixpanel
  - Stripe
  - Gmail
agents:
  - name: Expansion · Usage
    persona: Finds accounts consistently at or over their plan limits.
    icon: pipeline
    connectors:
      - Mixpanel
  - name: Expansion · Value
    persona: Checks the account is getting value before anyone suggests paying more.
    icon: shield
    connectors:
      - Stripe
  - name: Expansion · Timing
    persona: Names the right moment, which is rarely right after a support problem.
    icon: search
    connectors:
      - HubSpot
  - name: Expansion · Draft
    persona: Drafts the conversation, framed on their usage. Never sends.
    icon: pen
    connectors:
      - Gmail
rooms:
  - name: Expansion desk
    members:
      - Expansion · Usage
      - Expansion · Value
      - Expansion · Timing
      - Expansion · Draft
routines:
  - name: Limit check
    owner: Expansion · Usage
    schedule: Every Monday at 09:00
    prompt: List accounts at or over plan limits for three consecutive weeks.
  - name: Timing check
    owner: Expansion · Timing
    schedule: Every Monday at 09:30
    prompt: For expansion candidates, flag anyone with an open complaint. Never contact a customer.
---

Four Bots on expansion. Checks value first, contacts nobody.
