---
slug: community-launch
name: Community launch
tagline: "Runs a launch inside the community: the announcement drafted, questions anticipated, and the first day's reaction reported honestly."
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
  - name: Launch · Draft
    persona: Drafts the announcement for each channel in that channel's register. Never posts.
    icon: pen
    connectors:
      - Notion
  - name: Launch · Questions
    persona: Predicts the questions this launch will get and drafts an answer for each, flagging the ones nobody can answer yet.
    icon: search
    connectors:
      - Notion
  - name: Launch · Watch
    persona: "Reports reaction in the first day: what people asked, what confused them, what broke."
    icon: pipeline
    connectors:
      - Discord
      - X
  - name: Launch · Recap
    persona: Writes the honest launch recap, including what did not land.
    icon: recap
    connectors:
      - Gmail
rooms:
  - name: Launch room
    members:
      - Launch · Draft
      - Launch · Questions
      - Launch · Watch
      - Launch · Recap
routines:
  - name: Question prep
    owner: Launch · Questions
    schedule: Every weekday at 09:00
    prompt: For any launch inside seven days, list the likely questions and draft answers. Flag the unanswerable ones.
  - name: Day one watch
    owner: Launch · Watch
    schedule: Every 2 hours during waking hours
    prompt: "Report reaction to the live launch: questions, confusion, breakage. Do not reply to anyone."
suggest:
  - text: Never post publicly without a human yes.
    on: true
  - text: Never ban or mute anyone.
    on: true
  - text: Summarise the week of threads every Friday.
  - text: Escalate anything that reads like a safety issue.
---

Four Bots around a community launch. Drafts and watches, never posts.
