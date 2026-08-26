---
slug: helpdesk-sla
name: Response times
tagline: Watches promised response times and warns before one is missed, not after.
bots: 4
section: Helpdesk
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Zendesk
  - Intercom
  - Plain
  - Gmail
connector_modes:
  Zendesk: ask
  Intercom: ask
  Plain: draft
  Gmail: draft
bot_roster:
  - name: SLA · Clock
    persona: Names tickets approaching their promised response time.
    icon: shield
    connectors:
      - Zendesk
  - name: SLA · Breached
    persona: Reports what was missed, by how long, and on which plan.
    icon: pipeline
    connectors:
      - Zendesk
      - Plain
  - name: SLA · Load
    persona: Shows queue volume against people available.
    icon: staff
    connectors:
      - Intercom
  - name: SLA · Recap
    persona: Writes the weekly response-time recap without smoothing the bad days.
    icon: recap
    connectors:
      - Gmail
rooms:
  - name: Response desk
    members:
      - SLA · Clock
      - SLA · Breached
      - SLA · Load
      - SLA · Recap
routines:
  - name: Approaching breach
    owner: SLA · Clock
    schedule: Every hour during working hours
    prompt: Name tickets within one hour of their promised response time. Never reply for anyone.
  - name: Weekly recap
    owner: SLA · Recap
    schedule: Every Monday at 09:00
    prompt: Report last week's response times by plan. Show the worst day, not the average.
suggest:
  - text: Never send a reply without a human yes.
    on: true
  - text: Never close a ticket on the customer behalf.
    on: true
  - text: Escalate anything angry to me directly.
  - text: Quote the ticket number in every summary.
---

Four Bots on promised response times. Warns early, replies never.
