---
slug: design-brand
name: Brand review
tagline: Keeps public surfaces on-brand without a human having to check every page by hand.
bots: 4
section: Design
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Figma
  - Webflow
  - Canva
  - Notion
agents:
  - name: Brand · Surfaces
    persona: Lists public pages changed this week and what changed visually.
    icon: search
    connectors:
      - Webflow
  - name: Brand · Assets
    persona: Finds logos and marks used at the wrong size, colour, or clear space.
    icon: shield
    connectors:
      - Canva
  - name: Brand · Type
    persona: Flags type that does not match the scale in the brand file.
    icon: pen
    connectors:
      - Figma
  - name: Brand · Register
    persona: Keeps the register of approved marks and where each is allowed.
    icon: clipboard
    connectors:
      - Notion
rooms:
  - name: Brand desk
    members:
      - Brand · Surfaces
      - Brand · Assets
      - Brand · Type
      - Brand · Register
routines:
  - name: Surface diff
    owner: Brand · Surfaces
    schedule: Every Monday at 09:00
    prompt: List public pages changed last week and describe the visual change.
  - name: Asset check
    owner: Brand · Assets
    schedule: Every Wednesday at 11:00
    prompt: Find brand marks used at the wrong size, colour, or clear space. Never edit an asset.
---

Four Bots watching brand surfaces. Reports, never edits.
