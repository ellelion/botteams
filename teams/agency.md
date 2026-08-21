---
slug: agency
name: Client agency
tagline: "Runs a client floor end to end: inbound sorted, accounts tracked, delivery promises watched, retainers billed, and a daily recap of what needs a human."
bots: 6
section: Agency
status: installable
kind: team
added_at: "2026-08-20T20:50:24.000Z"
connectors:
  - Gmail
  - Calendar
  - Stripe
  - HubSpot
  - Docusign
  - Notion
connector_modes:
  Gmail: draft
  Calendar: draft
  Stripe: read
  HubSpot: ask
  Docusign: draft
  Notion: draft
agents:
  - name: Agency · Intake
    persona: Reads inbound agency mail. Sorts new work from noise. Never sends. Does not run a client website.
    icon: inbox
    connectors:
      - Gmail
      - HubSpot
  - name: Agency · Accounts
    persona: Keeps a calm list of active clients and next meetings. Drafts updates, never sends.
    icon: calendar
    connectors:
      - Calendar
      - HubSpot
  - name: Agency · Delivery
    persona: Tracks delivery promises against Calendar. Drafts status notes. Never sends. No site ops.
    icon: calendar
    connectors:
      - Calendar
      - Notion
  - name: Agency · Billing
    persona: Watches Stripe retainers and failed invoices. Alerts and drafts only. Does not send money.
    icon: card
    connectors:
      - Stripe
      - Docusign
  - name: Agency · Follow-ups
    persona: Drafts follow-ups for open account threads. Never sends.
    icon: inbox
    connectors:
      - Gmail
  - name: Agency · Recap
    persona: Writes the floor recap. What moved, what is blocked, what needs a human send. Drafts only.
    icon: recap
    connectors: []
rooms:
  - name: Agency floor
    members:
      - Agency · Intake
      - Agency · Accounts
      - Agency · Delivery
      - Agency · Billing
      - Agency · Follow-ups
      - Agency · Recap
routines:
  - name: Intake sweep
    owner: Agency · Intake
    schedule: Every 3 hours during waking hours
    prompt: Sweep inbound agency mail. Sort new work. Never send. Skip site-ops threads.
  - name: Billing watch
    owner: Agency · Billing
    schedule: Every weekday at 10:00
    prompt: Check Stripe for retainer charges and failed invoices. Report in Agency floor. Do not refund or send funds.
  - name: Floor recap
    owner: Agency · Recap
    schedule: Every weekday at 17:00
    prompt: Recap accounts, delivery, billing alerts, and drafts waiting on a human send.
suggest:
  - text: Never send client mail. Draft only.
    on: true
  - text: Never change a signed scope without asking.
    on: true
  - text: Flag any retainer that goes over budget in the group chat.
  - text: Use the client name, never the internal codename.
---

Example six-Bot agency floor. No client site ops.

## Reference

Agency · Billing expects Stripe official Agent Plugin (stripe 0.1.2, 8 skills and MCP) listed on the [Agent Plugins Directory](https://agentpluginsdirectory.com/) and the [stripe-best-practices](https://skillselion.com/skills/stripe/ai/stripe-best-practices) skill on Skillselion. The email-adjacent reference is Resend official Agent Plugin (resend 1.0.0) on the [Agent Plugins Directory](https://agentpluginsdirectory.com/).
