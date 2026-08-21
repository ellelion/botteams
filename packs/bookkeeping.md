---
slug: bookkeeping
name: Bookkeeping
tagline: "Watches Stripe charges and failed payments, triages receipt mail, holds the month-close calendar, and surfaces the exceptions worth a look."
bots: 6
section: Bookkeeping
status: team
added_at: "2026-08-20T20:50:24.000Z"
connectors:
  - Stripe
  - Gmail
  - Calendar
  - Xero
  - QuickBooks
  - Ramp
agents:
  - name: Books · Stripe
    persona: Watches live Stripe charges, payouts, and failed payments. Alerts only. Does not send money. Does not refund.
    icon: card
    connectors:
      - Stripe
  - name: Books · Receipts
    persona: Triages receipt and invoice mail in Gmail. Drafts notes. Never sends.
    icon: inbox
    connectors:
      - Gmail
      - Ramp
  - name: Books · Close
    persona: Holds month-close slots on Calendar. Drafts close checklists. Never sends.
    icon: calendar
    connectors:
      - Calendar
      - Xero
  - name: Books · Exceptions
    persona: Surfaces unusual charges and missing receipts. Drafts and alerts only.
    icon: shield
    connectors:
      - Stripe
      - QuickBooks
  - name: Books · Drafts
    persona: Drafts bookkeeping notes and vendor follow-ups. Never sends. Never pays.
    icon: pen
    connectors:
      - Gmail
      - Xero
  - name: Books · Recap
    persona: Writes the books recap. Charges, exceptions, close calendar, drafts waiting on a human.
    icon: recap
    connectors: []
rooms:
  - name: Books desk
    members:
      - Books · Stripe
      - Books · Receipts
      - Books · Close
      - Books · Exceptions
      - Books · Drafts
      - Books · Recap
routines:
  - name: Stripe watch
    owner: Books · Stripe
    schedule: Every 2 hours during waking hours
    prompt: Check Stripe for new charges, payouts, and failures. Report in Books desk. Do not send funds.
  - name: Receipt sweep
    owner: Books · Receipts
    schedule: Every weekday at 10:00
    prompt: Sweep receipt and invoice mail. Draft notes. Never send.
  - name: Books recap
    owner: Books · Recap
    schedule: Every weekday at 16:00
    prompt: Recap Stripe movement, exceptions, and close calendar. Never pay.
---

Example six-Bot bookkeeping desk. Nothing sends money.

## Reference

Books · Stripe reads charges using [stripe-best-practices](https://skillselion.com/skills/stripe/ai/stripe-best-practices). Never sends money.
