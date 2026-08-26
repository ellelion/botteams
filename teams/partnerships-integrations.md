---
slug: partnerships-integrations
name: Integration partners
tagline: "Tracks technical partnerships through the part that actually breaks: the integration staying alive after launch."
bots: 4
section: Partnerships
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - GitHub
  - Linear
  - HubSpot
  - Notion
connector_modes:
  GitHub: draft
  Linear: draft
  HubSpot: ask
  Notion: draft
bot_roster:
  - name: Integration · Health
    persona: Watches partner integrations for errors and breakage after launch.
    icon: shield
    connectors:
      - GitHub
  - name: Integration · Roadmap
    persona: Tracks what each partner said they would build and when.
    icon: clipboard
    connectors:
      - Notion
  - name: Integration · Issues
    persona: Keeps partner-reported issues visible rather than buried.
    icon: pipeline
    connectors:
      - Linear
  - name: Integration · Contacts
    persona: Flags partner contacts who have gone quiet or changed role.
    icon: staff
    connectors:
      - HubSpot
rooms:
  - name: Integration desk
    members:
      - Integration · Health
      - Integration · Roadmap
      - Integration · Issues
      - Integration · Contacts
routines:
  - name: Health check
    owner: Integration · Health
    schedule: Every weekday at 08:00
    prompt: Report partner integration error rates. Name anything worse than last week.
  - name: Commitment check
    owner: Integration · Roadmap
    schedule: Every Monday at 10:00
    prompt: List partner commitments past their stated date.
suggest:
  - text: Never mail a partner without a human yes.
    on: true
  - text: Never agree to terms.
    on: true
  - text: Track every promise we made, with a date.
  - text: Flag a partner who went quiet for a month.
---

Four Bots on integrations after launch, which is when they rot.
