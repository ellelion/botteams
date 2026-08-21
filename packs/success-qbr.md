---
slug: success-qbr
name: Quarterly reviews
tagline: Prepares the quarterly business review from real usage and real outcomes, not a slide template.
bots: 4
section: Customer success
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - HubSpot
  - Mixpanel
  - Notion
  - Calendar
agents:
  - name: QBR · Usage
    persona: Pulls the quarter's real usage per account and shows the trend, not just the total.
    icon: pipeline
    connectors:
      - Mixpanel
  - name: QBR · Promises
    persona: Lists what was promised at the last review and whether it happened.
    icon: clipboard
    connectors:
      - HubSpot
  - name: QBR · Deck
    persona: Drafts the review in Notion, leading with anything that went badly.
    icon: pen
    connectors:
      - Notion
  - name: QBR · Schedule
    persona: Books the reviews and names which accounts are overdue one.
    icon: calendar
    connectors:
      - Calendar
rooms:
  - name: Review desk
    members:
      - QBR · Usage
      - QBR · Promises
      - QBR · Deck
      - QBR · Schedule
routines:
  - name: Overdue reviews
    owner: QBR · Schedule
    schedule: Every Monday at 09:00
    prompt: List accounts overdue a quarterly review, longest first.
  - name: Promise check
    owner: QBR · Promises
    schedule: Every quarter on the 1st at 10:00
    prompt: For each account, list what was promised last review and whether it happened.
---

Four Bots preparing reviews. Leads with the bad news on purpose.
