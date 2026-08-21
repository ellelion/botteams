---
slug: bookkeeping-ar
name: Accounts receivable
tagline: "Chases what the company is owed: who is late, by how long, and what the follow-up should say, ready for a human to send."
bots: 4
section: Bookkeeping
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Stripe
  - Xero
  - Gmail
  - Calendar
connector_modes:
  Stripe: read
  Xero: read
  Gmail: draft
  Calendar: draft
agents:
  - name: AR · Aging
    persona: Builds the aged debtor list from Xero and Stripe, grouped by how late each one is.
    icon: pipeline
    connectors:
      - Xero
      - Stripe
  - name: AR · Failures
    persona: Watches Stripe for failed and retried charges and separates a card problem from a customer problem.
    icon: card
    connectors:
      - Stripe
  - name: AR · Chase
    persona: Drafts the chase for each late invoice, firmer the later it is. Never sends one.
    icon: pen
    connectors:
      - Gmail
  - name: AR · Escalate
    persona: Names the accounts that need a human call rather than another email, and books the slot.
    icon: calendar
    connectors:
      - Calendar
rooms:
  - name: Receivables desk
    members:
      - AR · Aging
      - AR · Failures
      - AR · Chase
      - AR · Escalate
routines:
  - name: Aging pass
    owner: AR · Aging
    schedule: Every Monday at 09:00
    prompt: Build the aged debtor list grouped by 30, 60, and 90 days late. Name the five worst.
  - name: Chase drafts
    owner: AR · Chase
    schedule: Every weekday at 10:00
    prompt: Draft a chase for every invoice that crossed a lateness threshold since yesterday. Never send.
suggest:
  - text: Never move money. Read the ledgers and report.
    on: true
  - text: Never file anything with a tax authority.
    on: true
  - text: Round nothing. Quote the figure you found.
  - text: Flag a duplicate payment the moment you see it.
---

Four Bots chasing money. Drafts every chase, sends none.
