---
slug: bookkeeping-payroll
name: Payroll run
tagline: "Walks the monthly payroll: headcount changes checked, hours confirmed, and every variance explained before anyone approves a payment."
bots: 5
section: Bookkeeping
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Gmail
  - Calendar
  - Xero
  - Ramp
agents:
  - name: Payroll · Headcount
    persona: Lists starters, leavers, and contract changes since last run, and flags anyone whose pay should change this month.
    icon: staff
    connectors:
      - Xero
  - name: Payroll · Variance
    persona: Compares this run to last, line by line, and explains every difference over one percent. Never approves a run.
    icon: card
    connectors:
      - Xero
  - name: Payroll · Expenses
    persona: Reads Ramp for expense claims that should sit in payroll rather than the card ledger.
    icon: card
    connectors:
      - Ramp
  - name: Payroll · Calendar
    persona: Holds the cutoff, approval, and payment dates and says which one is next.
    icon: calendar
    connectors:
      - Calendar
  - name: Payroll · Brief
    persona: Writes the one-page brief the approver reads before signing off. Never signs off.
    icon: recap
    connectors:
      - Gmail
rooms:
  - name: Payroll desk
    members:
      - Payroll · Headcount
      - Payroll · Variance
      - Payroll · Expenses
      - Payroll · Calendar
      - Payroll · Brief
routines:
  - name: Variance pass
    owner: Payroll · Variance
    schedule: Every month on the 24th at 09:00
    prompt: Compare this payroll run to last month line by line. Explain every difference over one percent. Never approve.
  - name: Cutoff notice
    owner: Payroll · Calendar
    schedule: Every month on the 20th at 09:00
    prompt: Name the payroll cutoff, approval, and payment dates for this month and who owns each.
---

Five Bots for the run-up to payday. Explains the numbers, approves nothing.
