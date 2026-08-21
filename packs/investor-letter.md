---
slug: investor-letter
name: Update letter
tagline: Drafts the monthly letter with the bad news first, and tracks what was promised in the last one.
bots: 4
section: Investor updates
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Notion
  - Gmail
  - Stripe
  - Google Drive
agents:
  - name: Letter · Draft
    persona: Drafts the update leading with what went wrong. Never sends.
    icon: pen
    connectors:
      - Notion
  - name: Letter · Promises
    persona: Lists what was promised in the last letter and whether it happened.
    icon: clipboard
    connectors:
      - Google Drive
  - name: Letter · Numbers
    persona: Checks every number in the draft against source.
    icon: shield
    connectors:
      - Stripe
  - name: Letter · Send list
    persona: Keeps the recipient list current and flags anyone who should be removed.
    icon: staff
    connectors:
      - Gmail
rooms:
  - name: Letter desk
    members:
      - Letter · Draft
      - Letter · Promises
      - Letter · Numbers
      - Letter · Send list
routines:
  - name: Promise check
    owner: Letter · Promises
    schedule: Every month on the 3rd at 10:00
    prompt: List commitments from the last letter and their status. Name anything not started.
  - name: Number check
    owner: Letter · Numbers
    schedule: Every month on the 4th at 10:00
    prompt: Verify every figure in the draft against source. Flag anything unverifiable.
---

Four Bots on the monthly letter. Bad news first, by design.
