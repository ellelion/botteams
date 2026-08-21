---
slug: recruiting
name: Recruiting sourcer
tagline: Outbound sourcing and sequences. Drafts only. Distinct from Hiring.
bots: 6
section: Recruiting
status: team
connectors:
  - Gmail
  - Calendar
  - Ashby
  - LinkedIn
  - Notion
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
---

Example six-Bot outbound recruiting desk. Distinct from Hiring, which is inbound. Sequences stop at drafts.

## Reference

The email-adjacent reference is Resend official Agent Plugin (resend 1.0.0) on the [Agent Plugins Directory](https://agentpluginsdirectory.com/).
