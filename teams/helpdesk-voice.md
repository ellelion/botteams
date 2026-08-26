---
slug: helpdesk-voice
name: Support voice
tagline: Keeps support replies consistent and human, and catches the ones that read like a form letter.
bots: 4
section: Helpdesk
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Zendesk
  - Intercom
  - Notion
connector_modes:
  Zendesk: ask
  Intercom: ask
  Notion: draft
bot_roster:
  - name: Voice · Sample
    persona: Samples sent replies and checks them against the voice guide.
    icon: search
    connectors:
      - Zendesk
  - name: Voice · Robotic
    persona: Flags replies that read like a template where a person was needed.
    icon: shield
    connectors:
      - Intercom
  - name: Voice · Guide
    persona: Keeps the voice guide current with real examples, good and bad.
    icon: pen
    connectors:
      - Notion
  - name: Voice · Coach
    persona: Drafts private, specific coaching notes. Never sends them.
    icon: staff
    connectors: []
rooms:
  - name: Voice desk
    members:
      - Voice · Sample
      - Voice · Robotic
      - Voice · Guide
      - Voice · Coach
routines:
  - name: Reply sample
    owner: Voice · Sample
    schedule: Every weekday at 16:00
    prompt: Sample twenty sent replies and check them against the voice guide.
  - name: Template flag
    owner: Voice · Robotic
    schedule: Every weekday at 16:30
    prompt: Flag replies that used a template where the question needed a person.
suggest:
  - text: Never send a reply without a human yes.
    on: true
  - text: Never close a ticket on the customer behalf.
    on: true
  - text: Escalate anything angry to me directly.
  - text: Quote the ticket number in every summary.
---

Four Bots on how support sounds. Coaches in private, sends nothing.
