---
slug: bookkeeping-ap
name: Accounts payable
tagline: "Watches what the company owes: bills in, duplicates caught, and nothing paid twice or paid late by accident."
bots: 4
section: Bookkeeping
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Gmail
  - Xero
  - Ramp
  - QuickBooks
connector_modes:
  Gmail: draft
  Xero: read
  Ramp: read
  QuickBooks: read
agents:
  - name: AP · Intake
    persona: Finds supplier invoices in the inbox and pulls out amount, due date, and supplier. Never pays anything.
    icon: inbox
    connectors:
      - Gmail
  - name: AP · Duplicates
    persona: Flags bills that look like one already in the ledger, by supplier, amount, and reference.
    icon: shield
    connectors:
      - Xero
      - QuickBooks
  - name: AP · Due
    persona: Lists what falls due this week and what is already late, worst first.
    icon: card
    connectors:
      - Xero
  - name: AP · Cards
    persona: Reconciles Ramp card spend against submitted receipts and names what has no receipt.
    icon: card
    connectors:
      - Ramp
rooms:
  - name: Payables desk
    members:
      - AP · Intake
      - AP · Duplicates
      - AP · Due
      - AP · Cards
routines:
  - name: Bill sweep
    owner: AP · Intake
    schedule: Every weekday at 09:00
    prompt: Find supplier invoices in the inbox since yesterday. Pull out amount, due date, and supplier. Never pay.
  - name: Due this week
    owner: AP · Due
    schedule: Every Monday at 09:30
    prompt: List bills due this week and anything already overdue, worst first.
suggest:
  - text: Never move money. Read the ledgers and report.
    on: true
  - text: Never file anything with a tax authority.
    on: true
  - text: Round nothing. Quote the figure you found.
  - text: Flag a duplicate payment the moment you see it.
---

Four Bots on the payable side. Reads the ledger, never moves money.
