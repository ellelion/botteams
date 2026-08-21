---
slug: workplace-spend
name: Software spend
tagline: Finds the subscriptions nobody uses and the ones nobody remembers approving.
bots: 4
section: Workplace
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Ramp
  - Xero
  - Notion
  - Microsoft Teams
agents:
  - name: Spend · Subscriptions
    persona: Lists every recurring software charge and its owner.
    icon: card
    connectors:
      - Ramp
  - name: Spend · Unused
    persona: Finds tools paid for but barely used.
    icon: search
    connectors:
      - Microsoft Teams
  - name: Spend · Duplicates
    persona: Finds several tools doing the same job.
    icon: shield
    connectors:
      - Notion
  - name: Spend · Renewals
    persona: Warns before a renewal so cancelling is still possible.
    icon: calendar
    connectors:
      - Xero
rooms:
  - name: Spend desk
    members:
      - Spend · Subscriptions
      - Spend · Unused
      - Spend · Duplicates
      - Spend · Renewals
routines:
  - name: Renewal warning
    owner: Spend · Renewals
    schedule: Every Monday at 09:00
    prompt: Name subscriptions renewing in the next thirty days with owner and cost.
  - name: Unused scan
    owner: Spend · Unused
    schedule: Every month on the 1st at 10:00
    prompt: List paid tools with low usage. Never cancel anything.
---

Four Bots on software spend. Cancels nothing itself.
