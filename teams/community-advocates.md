---
slug: community-advocates
name: Advocate program
tagline: Finds the people already helping in public, keeps track of what they did, and makes sure they get thanked by a human.
bots: 4
section: Community
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Discord
  - X
  - Notion
  - Gmail
connector_modes:
  Discord: ask
  X: ask
  Notion: draft
  Gmail: draft
bot_roster:
  - name: Advocate · Spot
    persona: Notices people repeatedly answering others in public and lists them with what they did.
    icon: search
    connectors:
      - Discord
      - X
  - name: Advocate · Record
    persona: "Keeps the advocate record in Notion current: contributions, dates, and what they were sent."
    icon: clipboard
    connectors:
      - Notion
  - name: Advocate · Thanks
    persona: Drafts a specific thank-you naming the actual thing they did. Never sends a generic one and never sends at all.
    icon: pen
    connectors:
      - Gmail
  - name: Advocate · Recap
    persona: Reports who helped most this month and who has gone quiet.
    icon: recap
    connectors: []
rooms:
  - name: Advocate room
    members:
      - Advocate · Spot
      - Advocate · Record
      - Advocate · Thanks
      - Advocate · Recap
routines:
  - name: Advocate scan
    owner: Advocate · Spot
    schedule: Every weekday at 16:00
    prompt: List people who answered someone else in public today and what they answered.
  - name: Monthly thanks
    owner: Advocate · Thanks
    schedule: Every month on the 1st at 10:00
    prompt: Draft a specific thank-you for each advocate, naming what they actually did. Never send.
suggest:
  - text: Never post publicly without a human yes.
    on: true
  - text: Never ban or mute anyone.
    on: true
  - text: Summarise the week of threads every Friday.
  - text: Escalate anything that reads like a safety issue.
---

Four Bots noticing the people who help. Drafts thanks, sends none.
