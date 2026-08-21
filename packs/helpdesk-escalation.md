---
slug: helpdesk-escalation
name: Escalation path
tagline: Makes sure hard tickets reach the right person quickly, with the context already assembled.
bots: 4
section: Helpdesk
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Zendesk
  - Linear
  - Intercom
  - Gmail
agents:
  - name: Escalate · Spot
    persona: Names tickets that have bounced between people without progress.
    icon: shield
    connectors:
      - Zendesk
  - name: Escalate · Context
    persona: Assembles the history so the next person does not start from nothing.
    icon: clipboard
    connectors:
      - Intercom
  - name: Escalate · Engineering
    persona: Drafts the Linear issue when a ticket is really a bug.
    icon: pipeline
    connectors:
      - Linear
  - name: Escalate · Update
    persona: Drafts the holding update for the customer. Never sends it.
    icon: pen
    connectors:
      - Gmail
rooms:
  - name: Escalation desk
    members:
      - Escalate · Spot
      - Escalate · Context
      - Escalate · Engineering
      - Escalate · Update
routines:
  - name: Bounce check
    owner: Escalate · Spot
    schedule: Every weekday at 11:00
    prompt: List tickets reassigned more than twice without resolution.
  - name: Context pack
    owner: Escalate · Context
    schedule: Every weekday at 11:30
    prompt: For escalated tickets, assemble the history into one summary.
---

Four Bots on escalations. Assembles context, contacts nobody.
