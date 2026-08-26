---
slug: partnerships
name: Partnerships
tagline: "Runs a partnerships desk: inbound qualified, the partner map kept current, intros drafted, and commitments tracked on both sides."
bots: 6
section: Partnerships
status: installable
kind: team
added_at: "2026-08-20T20:50:24.000Z"
connectors:
  - Gmail
  - Calendar
  - HubSpot
  - Notion
  - Zoom
connector_modes:
  Gmail: draft
  Calendar: draft
  HubSpot: ask
  Notion: draft
  Zoom: draft
bot_roster:
  - name: Partnerships · Inbound
    persona: Reads inbound partner mail. Sorts. Never sends. Ignores site-ops and ad-network SEO.
    icon: inbox
    connectors:
      - Gmail
      - HubSpot
  - name: Partnerships · Map
    persona: Keeps a current picture of live partner threads and next steps. Drafts updates, never sends.
    icon: pipeline
    connectors:
      - Notion
  - name: Partnerships · Intros
    persona: Writes intro and follow-up drafts. Never sends.
    icon: pen
    connectors:
      - Gmail
      - HubSpot
  - name: Partnerships · Calendar
    persona: Holds partner calls on Calendar. Drafts scheduling notes. Never sends.
    icon: calendar
    connectors:
      - Calendar
      - Zoom
  - name: Partnerships · Follow-ups
    persona: Drafts follow-ups that are due. Never sends. Times them against Calendar.
    icon: inbox
    connectors:
      - Gmail
  - name: Partnerships · Recap
    persona: Writes the partnerships recap. Pipeline, drafts, calendar. No site ops.
    icon: recap
    connectors: []
rooms:
  - name: Partnerships room
    members:
      - Partnerships · Inbound
      - Partnerships · Map
      - Partnerships · Intros
      - Partnerships · Calendar
      - Partnerships · Follow-ups
      - Partnerships · Recap
routines:
  - name: Partner intake
    owner: Partnerships · Inbound
    schedule: Every weekday at 09:00
    prompt: Sweep inbound partner mail. Sort. Never send.
  - name: Intro drafts
    owner: Partnerships · Intros
    schedule: Every weekday at 11:30
    prompt: Draft intro mail for partners the human named. Do not send.
  - name: Partners recap
    owner: Partnerships · Recap
    schedule: Every weekday at 16:45
    prompt: Recap pipeline, drafts, and Calendar holds.
suggest:
  - text: Never mail a partner without a human yes.
    on: true
  - text: Never agree to terms.
    on: true
  - text: Track every promise we made, with a date.
  - text: Flag a partner who went quiet for a month.
---

Example six-Bot partnerships desk. Nothing sends and nothing runs partner websites.

## Reference

The email-adjacent reference is Resend official Agent Plugin (resend 1.0.0) on the [Agent Plugins Directory](https://agentpluginsdirectory.com/).
