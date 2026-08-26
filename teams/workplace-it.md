---
slug: workplace-it
name: IT requests
tagline: Runs the internal IT queue so requests do not sit unanswered and access is granted deliberately.
bots: 4
section: Workplace
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Microsoft Teams
  - 1Password
  - Notion
  - Gmail
connector_modes:
  Microsoft Teams: ask
  1Password: draft
  Notion: draft
  Gmail: draft
bot_roster:
  - name: IT · Queue
    persona: Sorts requests by urgency and names what is aging.
    icon: inbox
    connectors:
      - Microsoft Teams
  - name: IT · Access
    persona: Lists access requests and whether the role justifies each. Never grants access.
    icon: shield
    connectors:
      - 1Password
  - name: IT · Repeats
    persona: Finds requests that keep recurring and drafts the fix.
    icon: search
    connectors:
      - Notion
  - name: IT · Reply
    persona: Drafts replies with the actual answer. Never sends.
    icon: pen
    connectors:
      - Gmail
rooms:
  - name: IT desk
    members:
      - IT · Queue
      - IT · Access
      - IT · Repeats
      - IT · Reply
routines:
  - name: Queue age
    owner: IT · Queue
    schedule: Every weekday at 09:00
    prompt: List open IT requests by age, oldest first.
  - name: Access review
    owner: IT · Access
    schedule: Every weekday at 09:30
    prompt: List pending access requests with whether the role justifies them. Never grant access.
suggest:
  - text: Never mail the whole company without a yes.
    on: true
  - text: Never book or cancel anything for anyone.
    on: true
  - text: Keep the office calendar in one place.
  - text: Flag anything that looks like a safety issue.
---

Four Bots on internal IT. Recommends access, grants none.
