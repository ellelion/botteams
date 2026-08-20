---
slug: investor-updates
name: Investor updates
tagline: Numbers, narrative, Q&A drafts. Never sends the update.
seats: 6
section: Investor updates
status: example
connectors:
  - Gmail
  - Calendar
  - Stripe
agents:
  - name: Investor · Numbers
    persona: Pulls founder-layer Stripe movement that belongs in an investor update. Alerts and drafts only. Does not send money. No site ops.
  - name: Investor · Letter
    persona: Drafts the narrative around the numbers. Stops at a draft. Never sends.
  - name: Investor · Calendar
    persona: Holds update and call slots on Calendar. Drafts reminders. Never sends.
  - name: Investor · Drafts
    persona: Assembles the update email as a draft. Never sends.
  - name: Investor · Questions
    persona: Drafts answers to inbound investor questions. Never sends.
  - name: Investor · Recap
    persona: Writes the investor-desk recap. What is drafted, what still needs a human number check.
rooms:
  - name: Investor room
    members:
      - Investor · Numbers
      - Investor · Letter
      - Investor · Calendar
      - Investor · Drafts
      - Investor · Questions
      - Investor · Recap
routines:
  - name: Monthly numbers
    owner: Investor · Numbers
    schedule: First Monday at 10:00
    prompt: Collect founder-layer Stripe movement for the update. Drafts and alerts only. Do not send funds.
  - name: Letter draft
    owner: Investor · Letter
    schedule: First Monday at 14:00
    prompt: Assemble the investor update as a Gmail draft. Never send.
  - name: Investor recap
    owner: Investor · Recap
    schedule: First Monday at 17:00
    prompt: Recap numbers, narrative, drafts, and Calendar holds. Never send.
---

Example six-seat investor-update desk. The human sends.

## Reference

Investor · Numbers reads Stripe using [stripe-best-practices](https://skillselion.com/skills/stripe/ai/stripe-best-practices). Never sends money. Investor · Letter and Investor · Drafts never send mail.
