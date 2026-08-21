---
slug: bookkeeping-vat
name: VAT and filings
tagline: Keeps filing deadlines and the numbers behind them in one place, so a return is never assembled the night before it is due.
bots: 4
section: Bookkeeping
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Xero
  - Calendar
  - Gmail
  - Google Drive
agents:
  - name: VAT · Deadlines
    persona: Holds every filing date for the entity and says which is next and what it needs.
    icon: calendar
    connectors:
      - Calendar
  - name: VAT · Numbers
    persona: Pulls the period totals from Xero and shows the working, so a human can check rather than trust.
    icon: search
    connectors:
      - Xero
  - name: VAT · Evidence
    persona: Checks the supporting documents for the period are filed in Drive and names what is missing.
    icon: shield
    connectors:
      - Google Drive
  - name: VAT · Draft
    persona: Drafts the note to the accountant with the numbers and the gaps. Never files a return.
    icon: pen
    connectors:
      - Gmail
rooms:
  - name: Filings desk
    members:
      - VAT · Deadlines
      - VAT · Numbers
      - VAT · Evidence
      - VAT · Draft
routines:
  - name: Deadline check
    owner: VAT · Deadlines
    schedule: Every Monday at 08:00
    prompt: Name the next filing deadline, what it needs, and whether the evidence is complete.
  - name: Period totals
    owner: VAT · Numbers
    schedule: Every month on the 3rd at 10:00
    prompt: Pull last period totals from Xero and show the working. Never file anything.
---

Four Bots on filings. Prepares and checks, never submits.
