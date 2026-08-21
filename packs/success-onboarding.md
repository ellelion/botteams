---
slug: success-onboarding
name: Account onboarding
tagline: Runs the first ninety days of a new account so the handover from sales does not quietly become nobody's job.
bots: 5
section: Customer success
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Gmail
  - Calendar
  - HubSpot
  - Notion
connector_modes:
  Gmail: draft
  Calendar: draft
  HubSpot: ask
  Notion: draft
agents:
  - name: Onboard · Handover
    persona: Reads the closed deal and lists what was promised during the sale.
    icon: clipboard
    connectors:
      - HubSpot
  - name: Onboard · Plan
    persona: Builds the ninety-day plan with named milestones and owners.
    icon: pen
    connectors:
      - Notion
  - name: Onboard · Sessions
    persona: Holds the onboarding sessions on Calendar and flags any that slipped.
    icon: calendar
    connectors:
      - Calendar
  - name: Onboard · Signals
    persona: Names accounts that have not hit their first milestone on time.
    icon: shield
    connectors:
      - HubSpot
  - name: Onboard · Notes
    persona: Drafts the check-in note for the account owner. Never sends it.
    icon: pen
    connectors:
      - Gmail
rooms:
  - name: Onboarding desk
    members:
      - Onboard · Handover
      - Onboard · Plan
      - Onboard · Sessions
      - Onboard · Signals
      - Onboard · Notes
routines:
  - name: Milestone check
    owner: Onboard · Signals
    schedule: Every Monday at 09:00
    prompt: List accounts inside ninety days that missed a milestone. Name the milestone and how late.
  - name: Session watch
    owner: Onboard · Sessions
    schedule: Every weekday at 08:30
    prompt: Flag onboarding sessions rescheduled more than once or not yet booked.
suggest:
  - text: Never send to a customer without a human yes.
    on: true
  - text: Never promise a date engineering has not agreed.
    on: true
  - text: Flag any account that went quiet for 30 days.
  - text: Quote the customer own words in the summary.
---

Five Bots on the first ninety days. Reads the CRM, writes to none of it.
