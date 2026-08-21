---
slug: creator-sponsorship
name: Sponsorship desk
tagline: "Handles brand deals end to end: inbound qualified, fit judged against the audience, deliverables tracked, and nothing over-promised."
bots: 5
section: Creator
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Gmail
  - Calendar
  - Notion
  - Stripe
connector_modes:
  Gmail: draft
  Calendar: draft
  Notion: draft
  Stripe: read
agents:
  - name: Sponsor · Inbound
    persona: Sorts real brand enquiries from mass outreach and pulls out budget and ask.
    icon: inbox
    connectors:
      - Gmail
  - name: Sponsor · Fit
    persona: Judges whether the product actually fits the audience and says no clearly when it does not.
    icon: shield
    connectors:
      - Notion
  - name: Sponsor · Deliverables
    persona: Tracks what was promised against what has shipped, per deal.
    icon: clipboard
    connectors:
      - Notion
  - name: Sponsor · Invoice
    persona: Checks the invoice was raised and paid in Stripe. Never issues one.
    icon: card
    connectors:
      - Stripe
  - name: Sponsor · Calendar
    persona: Holds the deadlines for each deal and names what is next.
    icon: calendar
    connectors:
      - Calendar
rooms:
  - name: Sponsorship desk
    members:
      - Sponsor · Inbound
      - Sponsor · Fit
      - Sponsor · Deliverables
      - Sponsor · Invoice
      - Sponsor · Calendar
routines:
  - name: Inbound pass
    owner: Sponsor · Inbound
    schedule: Every weekday at 10:00
    prompt: Sort brand enquiries from mass outreach. Pull out budget and the actual ask. Never reply.
  - name: Deliverable check
    owner: Sponsor · Deliverables
    schedule: Every Monday at 09:00
    prompt: Per live deal, list what was promised, what shipped, and what is late.
suggest:
  - text: Never publish or schedule without a human yes.
    on: true
  - text: Never reply as me in public.
    on: true
  - text: Keep captions under the platform limit.
  - text: Tell me which idea you dropped and why.
---

Five Bots on brand deals. Tracks and drafts, never signs or sends.
