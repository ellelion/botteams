---
slug: hiring-offers
name: Offer desk
tagline: Handles the offer stage where speed matters most, and keeps the terms consistent with what was discussed.
bots: 4
section: Hiring
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Ashby
  - Docusign
  - Gmail
  - Calendar
agents:
  - name: Offer · Terms
    persona: Checks the offer matches what was discussed and the band for the role.
    icon: shield
    connectors:
      - Ashby
  - name: Offer · Draft
    persona: Drafts the offer note and the verbal script. Never sends either.
    icon: pen
    connectors:
      - Gmail
  - name: Offer · Signature
    persona: Tracks offers out for signature and flags anything gone quiet.
    icon: clipboard
    connectors:
      - Docusign
  - name: Offer · Start
    persona: Holds start dates and lists what must happen before day one.
    icon: calendar
    connectors:
      - Calendar
rooms:
  - name: Offer desk
    members:
      - Offer · Terms
      - Offer · Draft
      - Offer · Signature
      - Offer · Start
routines:
  - name: Signature watch
    owner: Offer · Signature
    schedule: Every weekday at 10:00
    prompt: List offers out for signature more than two days, oldest first.
  - name: Pre-start check
    owner: Offer · Start
    schedule: Every Monday at 09:00
    prompt: For starts inside three weeks, list what is not yet done and who owns it.
---

Four Bots at offer stage. Drafts and tracks, signs nothing.
