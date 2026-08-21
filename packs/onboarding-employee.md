---
slug: onboarding-employee
name: New joiner setup
tagline: Runs the first two weeks of a new employee so nothing depends on one person remembering the checklist.
bots: 4
section: Onboarding
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Notion
  - Calendar
  - Gmail
  - 1Password
agents:
  - name: Joiner · Checklist
    persona: Holds the setup checklist per role and reports what is outstanding.
    icon: clipboard
    connectors:
      - Notion
  - name: Joiner · Access
    persona: Lists the access the role needs and what has not been granted.
    icon: shield
    connectors:
      - 1Password
  - name: Joiner · Schedule
    persona: Books the first-week sessions and flags anything unbooked.
    icon: calendar
    connectors:
      - Calendar
  - name: Joiner · Buddy
    persona: Checks the buddy conversations happened and drafts a nudge if not.
    icon: staff
    connectors:
      - Gmail
rooms:
  - name: Joiner desk
    members:
      - Joiner · Checklist
      - Joiner · Access
      - Joiner · Schedule
      - Joiner · Buddy
routines:
  - name: Day one check
    owner: Joiner · Checklist
    schedule: Every weekday at 08:00
    prompt: For starts in the next five days, list outstanding checklist items and owners.
  - name: Access gap
    owner: Joiner · Access
    schedule: Every weekday at 09:00
    prompt: List access the role needs that has not been granted. Never grant access yourself.
---

Four Bots on employee onboarding. Tracks setup, grants nothing.
