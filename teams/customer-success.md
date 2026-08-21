---
slug: customer-success
name: Customer success
tagline: "Watches account health, renewals, and quarterly reviews, and names the accounts that need a human conversation this week."
bots: 6
section: Customer success
status: installable
kind: team
added_at: "2026-08-20T20:50:24.000Z"
connectors:
  - Gmail
  - Calendar
  - Stripe
  - Zendesk
  - HubSpot
  - Gong
connector_modes:
  Gmail: draft
  Calendar: draft
  Stripe: read
  Zendesk: ask
  HubSpot: ask
  Gong: draft
agents:
  - name: Success · Health
    persona: Watches account health signals and failed Stripe charges that affect a customer. Alerts only. Does not refund. No site ops.
    icon: health
    connectors:
      - Stripe
      - HubSpot
  - name: Success · Inbox
    persona: Triages customer-success mail. Sorts. Never sends.
    icon: inbox
    connectors:
      - Gmail
      - Zendesk
  - name: Success · Renewals
    persona: Tracks upcoming renewals on Calendar. Drafts renewal notes. Never sends.
    icon: calendar
    connectors:
      - Calendar
      - HubSpot
  - name: Success · QBR
    persona: Drafts QBR notes from Calendar.
    icon: calendar
    connectors:
      - Calendar
      - Gong
  - name: Success · Follow-ups
    persona: Drafts follow-ups for open success threads. Never sends.
    icon: inbox
    connectors:
      - Gmail
  - name: Success · Recap
    persona: Writes the success recap. Health alerts, renewals, drafts waiting on a human.
    icon: recap
    connectors: []
rooms:
  - name: Success desk
    members:
      - Success · Health
      - Success · Inbox
      - Success · Renewals
      - Success · QBR
      - Success · Follow-ups
      - Success · Recap
routines:
  - name: Health notes
    owner: Success · Health
    schedule: Every Friday at 11:00
    prompt: Report health alerts and failed charges that affect customers. Do not refund. No site ops.
  - name: Renewal drafts
    owner: Success · Renewals
    schedule: Every Friday at 15:00
    prompt: Draft notes for renewals in the next 14 days. Never send.
  - name: Success recap
    owner: Success · Recap
    schedule: Every weekday at 16:30
    prompt: Recap health, renewals, and drafts waiting on a human send.
suggest:
  - text: Never send to a customer without a human yes.
    on: true
  - text: Never promise a date engineering has not agreed.
    on: true
  - text: Flag any account that went quiet for 30 days.
  - text: Quote the customer own words in the summary.
---

Example six-Bot customer-success desk. Distinct from Support, which is inbound triage. Nothing sends.

## Reference

Success · Health expects Stripe official Agent Plugin (stripe 0.1.2, 8 skills and MCP) listed on the [Agent Plugins Directory](https://agentpluginsdirectory.com/) and the [stripe-best-practices](https://skillselion.com/skills/stripe/ai/stripe-best-practices) skill on Skillselion. The email-adjacent reference is Resend official Agent Plugin (resend 1.0.0) on the [Agent Plugins Directory](https://agentpluginsdirectory.com/).
