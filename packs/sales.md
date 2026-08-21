---
slug: sales
name: Sales company
tagline: "Runs a two-Bot sales floor: the pipeline read every morning and follow-ups drafted for everything that went quiet."
bots: 2
section: Sales
status: team
added_at: "2026-08-20T20:50:24.000Z"
connectors:
  - Gmail
  - Calendar
  - HubSpot
  - Gong
  - Apollo.io
agents:
  - name: Sales · Pipeline
    persona: Keeps the pipeline honest from Calendar and notes. Does not invent deals.
    icon: pipeline
    connectors:
      - Calendar
      - HubSpot
      - Apollo.io
  - name: Sales · Follow-ups
    persona: Drafts follow-up mail. Never sends.
    icon: inbox
    connectors:
      - Gmail
      - Gong
rooms:
  - name: Sales floor
    members:
      - Sales · Pipeline
      - Sales · Follow-ups
routines:
  - name: Morning pipeline
    owner: Sales · Pipeline
    schedule: Weekdays at 09:00
    prompt: Summarize open deals and today's Calendar meetings into Sales floor. Do not invent status.
  - name: Follow-up drafts
    owner: Sales · Follow-ups
    schedule: Weekdays at 16:00
    prompt: Draft follow-up mail for stale threads. Do not send.
skills: []
---

Sales company is a two-Bot room. Pipeline reads the calendar. Follow-ups draft mail. Drafts only, never send. There is no Gmail plugin listing cited here because this pack uses the account-wide Gmail connector, not a plugin install.

## Reference

Sales · Follow-ups drafts mail and never sends. The email-adjacent reference is Resend's official Agent Plugin (resend 1.0.0) on the [Agent Plugins Directory](https://agentpluginsdirectory.com/). These are references the pack expects. This site does not install them.
