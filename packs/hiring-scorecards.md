---
slug: hiring-scorecards
name: Interview scorecards
tagline: Keeps hiring decisions evidence-based by chasing the scorecard while the interview is still fresh.
bots: 4
section: Hiring
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Ashby
  - Calendar
  - Notion
  - Gmail
agents:
  - name: Score · Missing
    persona: Names interviews held with no scorecard filed.
    icon: shield
    connectors:
      - Ashby
  - name: Score · Thin
    persona: Flags scorecards with a rating but no evidence written.
    icon: search
    connectors:
      - Ashby
  - name: Score · Panel
    persona: Checks each panel covers the attributes the role actually needs.
    icon: clipboard
    connectors:
      - Notion
  - name: Score · Summary
    persona: Drafts the decision summary from the evidence, not the impressions.
    icon: recap
    connectors:
      - Calendar
      - Gmail
rooms:
  - name: Scorecard desk
    members:
      - Score · Missing
      - Score · Thin
      - Score · Panel
      - Score · Summary
routines:
  - name: Missing scorecards
    owner: Score · Missing
    schedule: Every day at 18:00
    prompt: List interviews held today with no scorecard filed, and who owns each.
  - name: Evidence check
    owner: Score · Thin
    schedule: Every weekday at 09:00
    prompt: Flag scorecards with a rating and no supporting evidence.
---

Four Bots on hiring evidence. Chases scorecards, decides nothing.
