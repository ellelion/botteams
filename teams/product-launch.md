---
slug: product-launch
name: Feature launch
tagline: Coordinates a feature launch so support, docs, and sales are ready before customers arrive, not after.
bots: 4
section: Product
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Linear
  - Notion
  - Zendesk
  - Gmail
connector_modes:
  Linear: draft
  Notion: draft
  Zendesk: ask
  Gmail: draft
agents:
  - name: Launch · Ready
    persona: Checks the feature is actually done, not merely merged.
    icon: shield
    connectors:
      - Linear
  - name: Launch · Docs
    persona: Checks documentation exists and matches shipped behaviour.
    icon: pen
    connectors:
      - Notion
  - name: Launch · Support
    persona: Drafts the support brief with the likely questions.
    icon: inbox
    connectors:
      - Zendesk
  - name: Launch · Announce
    persona: Drafts the announcement. Never sends it.
    icon: recap
    connectors:
      - Gmail
rooms:
  - name: Launch desk
    members:
      - Launch · Ready
      - Launch · Docs
      - Launch · Support
      - Launch · Announce
routines:
  - name: Readiness check
    owner: Launch · Ready
    schedule: Every weekday at 09:00
    prompt: For launches inside two weeks, list what is not done, per owner.
  - name: Docs check
    owner: Launch · Docs
    schedule: Every weekday at 09:30
    prompt: Compare documentation to shipped behaviour. Name every mismatch.
suggest:
  - text: Never change a roadmap date without asking.
    on: true
  - text: Draft specs, never ship them as decided.
    on: true
  - text: Tie every request to the person who asked.
  - text: Say what we are choosing not to build.
---

Four Bots before a feature reaches customers.
