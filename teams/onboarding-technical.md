---
slug: onboarding-technical
name: Technical onboarding
tagline: Gets a customer's integration actually working, and names where they got stuck rather than assuming they will say.
bots: 4
section: Onboarding
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Intercom
  - Linear
  - Notion
  - Mixpanel
connector_modes:
  Intercom: ask
  Linear: draft
  Notion: draft
  Mixpanel: draft
bot_roster:
  - name: Technical · Progress
    persona: Tracks each customer against the integration steps and names where they stalled.
    icon: pipeline
    connectors:
      - Mixpanel
  - name: Technical · Blockers
    persona: Reads support threads for the blockers customers hit repeatedly.
    icon: search
    connectors:
      - Intercom
  - name: Technical · Docs
    persona: Drafts the doc fix for a blocker that keeps recurring.
    icon: pen
    connectors:
      - Notion
  - name: Technical · Bugs
    persona: Files the Linear issue when the blocker is a product problem.
    icon: shield
    connectors:
      - Linear
rooms:
  - name: Technical onboarding desk
    members:
      - Technical · Progress
      - Technical · Blockers
      - Technical · Docs
      - Technical · Bugs
routines:
  - name: Stall report
    owner: Technical · Progress
    schedule: Every weekday at 09:00
    prompt: List customers stalled at the same integration step for more than three days.
  - name: Blocker pattern
    owner: Technical · Blockers
    schedule: Every Friday at 14:00
    prompt: Name blockers hit by three or more customers this week.
suggest:
  - text: Never mail a new starter without a human yes.
    on: true
  - text: Never grant access to anything.
    on: true
  - text: Check day one is ready by the Friday before.
  - text: Ask the buddy how week one went, not the manager.
---

Four Bots on integration onboarding. Finds stalls, contacts nobody.
