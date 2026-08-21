---
slug: support-proactive
name: Proactive support
tagline: Contacts nobody, but finds the customers about to have a problem so a human can reach them first.
bots: 4
section: Support
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Mixpanel
  - Zendesk
  - HubSpot
  - Gmail
connector_modes:
  Mixpanel: draft
  Zendesk: ask
  HubSpot: ask
  Gmail: draft
agents:
  - name: Proactive · Errors
    persona: Finds accounts hitting errors repeatedly without filing a ticket.
    icon: shield
    connectors:
      - Mixpanel
  - name: Proactive · Stuck
    persona: Names accounts repeating the same failing action.
    icon: search
    connectors:
      - Mixpanel
  - name: Proactive · Silent
    persona: Finds accounts that stopped using the product without saying why.
    icon: pipeline
    connectors:
      - HubSpot
  - name: Proactive · Draft
    persona: Drafts a specific, non-generic outreach. Never sends.
    icon: pen
    connectors:
      - Gmail
      - Zendesk
rooms:
  - name: Proactive desk
    members:
      - Proactive · Errors
      - Proactive · Stuck
      - Proactive · Silent
      - Proactive · Draft
routines:
  - name: Silent error
    owner: Proactive · Errors
    schedule: Every weekday at 09:00
    prompt: List accounts hitting repeated errors with no ticket filed.
  - name: Stall report
    owner: Proactive · Stuck
    schedule: Every weekday at 09:30
    prompt: List accounts repeating a failing action more than five times.
suggest:
  - text: Never send a reply without a human yes.
    on: true
  - text: Never promise a refund.
    on: true
  - text: Escalate anything about data loss immediately.
  - text: Summarise the top three themes each week.
---

Four Bots finding problems before the ticket. Contacts nobody.
