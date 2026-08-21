---
slug: workplace-policies
name: Policy desk
tagline: Keeps internal policies findable and current, and tracks who has actually read them.
bots: 4
section: Workplace
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Notion
  - SharePoint
  - Gmail
  - Glean
connector_modes:
  Notion: draft
  SharePoint: draft
  Gmail: draft
  Glean: draft
agents:
  - name: Policy · Register
    persona: Keeps the register of policies and their review dates.
    icon: clipboard
    connectors:
      - Notion
  - name: Policy · Stale
    persona: Names policies past review or referring to things that changed.
    icon: shield
    connectors:
      - SharePoint
  - name: Policy · Findable
    persona: Checks people can actually find a policy when they search for it.
    icon: search
    connectors:
      - Glean
  - name: Policy · Ack
    persona: Tracks who has acknowledged which policy and drafts the reminder.
    icon: pen
    connectors:
      - Gmail
rooms:
  - name: Policy desk
    members:
      - Policy · Register
      - Policy · Stale
      - Policy · Findable
      - Policy · Ack
routines:
  - name: Review check
    owner: Policy · Stale
    schedule: Every month on the 1st at 09:00
    prompt: List policies past their review date, longest overdue first.
  - name: Acknowledgement
    owner: Policy · Ack
    schedule: Every Monday at 10:00
    prompt: List people who have not acknowledged a required policy. Draft a reminder. Never send.
suggest:
  - text: Never mail the whole company without a yes.
    on: true
  - text: Never book or cancel anything for anyone.
    on: true
  - text: Keep the office calendar in one place.
  - text: Flag anything that looks like a safety issue.
---

Four Bots on internal policy. Tracks reading, sends nothing.
