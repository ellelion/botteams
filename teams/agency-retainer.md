---
slug: agency-retainer
name: Retainer watch
tagline: Tracks every retainer against the hours actually delivered, and names the accounts quietly running over before the invoice does.
bots: 4
section: Agency
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Stripe
  - Calendar
  - Gmail
  - Notion
connector_modes:
  Stripe: read
  Calendar: draft
  Gmail: draft
  Notion: draft
bot_roster:
  - name: Retainer · Ledger
    persona: Reads Stripe subscriptions and lists which retainers renewed, which failed, and which changed amount. Never issues a charge or a refund.
    icon: card
    connectors:
      - Stripe
  - name: Retainer · Hours
    persona: Adds up meeting and delivery time on Calendar per client and compares it to the retainer band. Reports the gap, never edits a booking.
    icon: calendar
    connectors:
      - Calendar
  - name: Retainer · Overrun
    persona: Names the accounts where delivered hours passed the retainer, with the number, so a human can decide to bill it or absorb it.
    icon: shield
    connectors:
      - Notion
  - name: Retainer · Notice
    persona: Drafts the overrun conversation in the account owner's voice. Never sends it.
    icon: pen
    connectors:
      - Gmail
rooms:
  - name: Retainer desk
    members:
      - Retainer · Ledger
      - Retainer · Hours
      - Retainer · Overrun
      - Retainer · Notice
routines:
  - name: Renewal pass
    owner: Retainer · Ledger
    schedule: Every Monday at 08:00
    prompt: List retainers that renewed, failed, or changed amount since last Monday. Do not charge or refund anything.
  - name: Overrun check
    owner: Retainer · Overrun
    schedule: Every Friday at 15:00
    prompt: Compare delivered hours to the retainer band per client. Name only the accounts over the line, with the hours.
suggest:
  - text: Never send client mail. Draft only.
    on: true
  - text: Never change a signed scope without asking.
    on: true
  - text: Flag any retainer that goes over budget in the group chat.
  - text: Use the client name, never the internal codename.
---

Four Bots on the money side of an agency. Reads Stripe and Calendar, writes to neither.
