---
slug: recruiting
name: Recruiting sourcer
tagline: "Runs sourcing and outreach: candidates found on evidence, messages drafted per person, and the pipeline kept from going quiet."
bots: 6
section: Recruiting
status: team
added_at: "2026-08-20T20:50:24.000Z"
connectors:
  - Gmail
  - Calendar
  - Ashby
  - LinkedIn
  - Notion
connector_modes:
  Gmail: draft
  Calendar: draft
  Ashby: draft
  LinkedIn: ask
  Notion: draft
agents:
  - name: Recruiting · Sourcer
    persona: Keeps a current list of outbound people to reach. Drafts notes. Never sends. Not a job-board operator.
    icon: search
    connectors:
      - LinkedIn
  - name: Recruiting · Outreach
    persona: Drafts outbound sequence mail. Never sends. Leaves the human the send action.
    icon: inbox
    connectors:
      - Gmail
      - LinkedIn
  - name: Recruiting · Calendar
    persona: Holds intro calls on Calendar. Drafts scheduling notes. Never sends.
    icon: calendar
    connectors:
      - Calendar
  - name: Recruiting · Pipeline
    persona: Tracks outbound pipeline stages. Drafts updates, never sends.
    icon: pipeline
    connectors:
      - Ashby
  - name: Recruiting · Inbox
    persona: Triages replies to outbound sequences. Drafts, never sends. Hands scheduling to Recruiting · Calendar.
    icon: inbox
    connectors:
      - Gmail
      - Notion
  - name: Recruiting · Recap
    persona: Writes the recruiting recap. Who was drafted, who replied, what needs a human send.
    icon: recap
    connectors: []
rooms:
  - name: Recruiting room
    members:
      - Recruiting · Sourcer
      - Recruiting · Outreach
      - Recruiting · Calendar
      - Recruiting · Pipeline
      - Recruiting · Inbox
      - Recruiting · Recap
routines:
  - name: Source list
    owner: Recruiting · Sourcer
    schedule: Every weekday at 09:00
    prompt: Update the outbound list for today. Draft notes. Never send.
  - name: Outreach drafts
    owner: Recruiting · Outreach
    schedule: Weekdays at 10:30
    prompt: Draft outbound sequence mail due today. Never send.
  - name: Recruiting recap
    owner: Recruiting · Recap
    schedule: Every weekday at 16:30
    prompt: Recap outbound drafts, replies, and Calendar holds. Never send.
suggest:
  - text: Never contact a candidate without a human yes.
    on: true
  - text: Never share candidate details outside the loop.
    on: true
  - text: Source on the work, not the logo.
  - text: Give me the pipeline number every Monday.
---

Example six-Bot outbound recruiting desk. Distinct from Hiring, which is inbound. Sequences stop at drafts.

## Reference

The email-adjacent reference is Resend official Agent Plugin (resend 1.0.0) on the [Agent Plugins Directory](https://agentpluginsdirectory.com/).
