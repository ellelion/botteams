---
slug: success-health
name: Account health
tagline: Turns scattered usage and support signals into a plain answer about which accounts are actually in trouble.
bots: 4
section: Customer success
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - HubSpot
  - Zendesk
  - Mixpanel
  - Gmail
connector_modes:
  HubSpot: ask
  Zendesk: ask
  Mixpanel: draft
  Gmail: draft
agents:
  - name: Health · Usage
    persona: Reads product usage and names accounts whose activity has fallen for three weeks running.
    icon: pipeline
    connectors:
      - Mixpanel
  - name: Health · Tickets
    persona: Reads support volume per account and separates a bad week from a pattern.
    icon: inbox
    connectors:
      - Zendesk
  - name: Health · Contacts
    persona: Flags accounts where the main contact has gone quiet or left.
    icon: shield
    connectors:
      - HubSpot
  - name: Health · Call
    persona: Says which accounts need a human conversation this week, ranked, with the reason.
    icon: staff
    connectors:
      - Gmail
rooms:
  - name: Health desk
    members:
      - Health · Usage
      - Health · Tickets
      - Health · Contacts
      - Health · Call
routines:
  - name: Health read
    owner: Health · Call
    schedule: Every Monday at 09:00
    prompt: Rank accounts needing a human conversation this week. Give the reason and the evidence for each.
  - name: Usage decline
    owner: Health · Usage
    schedule: Every weekday at 08:00
    prompt: List accounts with three consecutive weeks of falling activity. Never contact them.
suggest:
  - text: Never send to a customer without a human yes.
    on: true
  - text: Never promise a date engineering has not agreed.
    on: true
  - text: Flag any account that went quiet for 30 days.
  - text: Quote the customer own words in the summary.
---

Four Bots on churn risk. Names the accounts, contacts none of them.
