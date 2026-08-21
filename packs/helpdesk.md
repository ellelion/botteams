---
slug: helpdesk
name: Ticket desk
tagline: Tickets, chats, escalations, and bug handoff. Drafts only, never replies to a customer.
bots: 5
section: Helpdesk
status: example
connectors:
  - Zendesk
  - Intercom
  - Plain
  - Linear
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
---

Example five-Bot ticket desk. Drafts every reply, sends none of them.
