---
slug: investor-asks
name: Investor asks
tagline: Turns vague investor offers of help into specific requests, and tracks whether anything came of them.
bots: 4
section: Investor updates
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Notion
  - Gmail
  - HubSpot
  - Calendar
agents:
  - name: Asks · Draft
    persona: Turns a general offer of help into one specific, answerable request.
    icon: pen
    connectors:
      - Notion
  - name: Asks · Route
    persona: Names which investor is best placed for each ask.
    icon: staff
    connectors:
      - HubSpot
  - name: Asks · Track
    persona: Records what was asked, of whom, and what came back.
    icon: clipboard
    connectors:
      - Notion
  - name: Asks · Follow
    persona: Drafts the follow-up on an unanswered ask. Never sends.
    icon: inbox
    connectors:
      - Gmail
      - Calendar
rooms:
  - name: Asks room
    members:
      - Asks · Draft
      - Asks · Route
      - Asks · Track
      - Asks · Follow
routines:
  - name: Ask draft
    owner: Asks · Draft
    schedule: Every month on the 1st at 11:00
    prompt: Turn this month's needs into specific, answerable asks. One line each.
  - name: Unanswered
    owner: Asks · Track
    schedule: Every Monday at 09:00
    prompt: List asks with no response after two weeks.
---

Four Bots making investor help specific enough to act on.
