---
slug: helpdesk
name: Ticket desk
tagline: "Runs a ticket desk across Zendesk and Intercom: triaged by urgency, aging conversations surfaced, and repeat tickets turned into bugs."
bots: 5
section: Helpdesk
status: installable
kind: team
added_at: "2026-08-21T03:57:51.000Z"
connectors:
  - Zendesk
  - Intercom
  - Plain
  - Linear
connector_modes:
  Zendesk: ask
  Intercom: ask
  Plain: draft
  Linear: draft
agents:
  - name: Desk · Triage
    persona: Sorts new Zendesk tickets by urgency and topic. Drafts a first reply, never sends it.
    icon: inbox
    connectors:
      - Zendesk
  - name: Desk · Chat
    persona: Reads Intercom conversations left waiting. Names who is waiting and for how long. Never replies.
    icon: inbox
    connectors:
      - Intercom
  - name: Desk · Escalation
    persona: Watches Plain for threads that crossed the escalation line. Drafts an internal summary, never contacts the customer.
    icon: shield
    connectors:
      - Plain
  - name: Desk · Bugs
    persona: Turns repeated tickets into a Linear bug draft with the ticket links attached. Never files without a human.
    icon: pipeline
    connectors:
      - Linear
  - name: Desk · Recap
    persona: Writes the desk recap. Volume, what is aging, what became a bug, what needs a human send.
    icon: recap
    connectors: []
rooms:
  - name: Support desk floor
    members:
      - Desk · Triage
      - Desk · Chat
      - Desk · Escalation
      - Desk · Bugs
      - Desk · Recap
routines:
  - name: Ticket sweep
    owner: Desk · Triage
    schedule: Every 2 hours during working hours
    prompt: Sort new Zendesk tickets by urgency. Draft a first reply for the routine ones. Never send.
  - name: Aging check
    owner: Desk · Chat
    schedule: Every weekday at 11:00
    prompt: List Intercom conversations waiting more than four hours, oldest first. Never reply.
  - name: Desk recap
    owner: Desk · Recap
    schedule: Every weekday at 17:00
    prompt: Recap ticket volume, aging conversations, escalations, bug drafts, and replies waiting on a human send.
suggest:
  - text: Never send a reply without a human yes.
    on: true
  - text: Never close a ticket on the customer behalf.
    on: true
  - text: Escalate anything angry to me directly.
  - text: Quote the ticket number in every summary.
---

Example five-Bot ticket desk. Drafts every reply, sends none of them.
