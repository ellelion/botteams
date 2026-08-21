---
slug: hiring
name: Hiring desk
tagline: "Runs a hiring desk: applications sorted, pipeline kept moving, interviews scheduled, and offers drafted without candidates going silent."
bots: 6
section: Hiring
status: team
added_at: "2026-08-20T20:50:24.000Z"
connectors:
  - Gmail
  - Calendar
  - Ashby
  - Zoom
  - Notion
connector_modes:
  Gmail: draft
  Calendar: draft
  Ashby: draft
  Zoom: draft
  Notion: draft
agents:
  - name: Hiring · Inbound
    persona: Reads inbound applicant mail. Sorts and prioritizes. Never sends. Not a job-board operator.
    icon: inbox
    connectors:
      - Gmail
      - Ashby
  - name: Hiring · Pipeline
    persona: Keeps a current picture of open roles and next steps. Drafts updates, never sends.
    icon: pipeline
    connectors:
      - Ashby
  - name: Hiring · Screen
    persona: Drafts screening notes from inbound threads. Flags who needs a Calendar slot. Never sends.
    icon: search
    connectors:
      - Gmail
      - Notion
  - name: Hiring · Schedule
    persona: Proposes interview slots on Calendar. Drafts scheduling mail. Never sends.
    icon: calendar
    connectors:
      - Calendar
      - Zoom
  - name: Hiring · Offers
    persona: Drafts offer and decline notes. Never sends. Leaves the human the send action.
    icon: pen
    connectors:
      - Gmail
  - name: Hiring · Recap
    persona: Writes the hiring recap. Who moved, who waits, which drafts need a human. No site ops.
    icon: recap
    connectors: []
rooms:
  - name: Hiring desk
    members:
      - Hiring · Inbound
      - Hiring · Pipeline
      - Hiring · Screen
      - Hiring · Schedule
      - Hiring · Offers
      - Hiring · Recap
routines:
  - name: Inbound sweep
    owner: Hiring · Inbound
    schedule: Every weekday at 09:00
    prompt: Sweep inbound applicant mail. Prioritize. Hand screening to Hiring · Screen. Never send.
  - name: Schedule drafts
    owner: Hiring · Schedule
    schedule: Every weekday at 11:00
    prompt: Draft scheduling mail for people who need a Calendar slot. Never send.
  - name: Hiring recap
    owner: Hiring · Recap
    schedule: Every weekday at 16:30
    prompt: Recap pipeline, schedules, and offer drafts waiting on a human.
suggest:
  - text: Never mail a candidate without a human yes.
    on: true
  - text: Never reject anyone automatically.
    on: true
  - text: Judge on the work, not on the school.
  - text: Flag a role that has been open over 30 days.
---

Example six-Bot inbound hiring desk. Distinct from Recruiting, which is outbound. Nothing here posts a job or sends mail.

## Reference

The email-adjacent reference is Resend official Agent Plugin (resend 1.0.0) on the [Agent Plugins Directory](https://agentpluginsdirectory.com/).
