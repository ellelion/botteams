---
slug: community-forum
name: Forum triage
tagline: Sorts a public forum so questions reach the right people and answered threads become documentation instead of disappearing.
bots: 4
section: Community
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Discord
  - Notion
  - Intercom
connector_modes:
  Discord: ask
  Notion: draft
  Intercom: ask
bot_roster:
  - name: Forum · Route
    persona: Reads new threads and says which team owns each. Never answers on their behalf.
    icon: pipeline
    connectors:
      - Discord
  - name: Forum · Stale
    persona: Lists threads that went quiet without a resolution, oldest first.
    icon: shield
    connectors:
      - Discord
  - name: Forum · Harvest
    persona: Turns a resolved thread into a draft doc entry so the answer stops being buried in chat.
    icon: pen
    connectors:
      - Notion
  - name: Forum · Escalate
    persona: Moves anything that reads like a paying-customer problem to the support queue as a draft.
    icon: inbox
    connectors:
      - Intercom
rooms:
  - name: Forum floor
    members:
      - Forum · Route
      - Forum · Stale
      - Forum · Harvest
      - Forum · Escalate
routines:
  - name: Routing pass
    owner: Forum · Route
    schedule: Every 3 hours during working hours
    prompt: Route new threads to an owning team. Never answer on their behalf.
  - name: Harvest pass
    owner: Forum · Harvest
    schedule: Every Thursday at 15:00
    prompt: Turn this week's resolved threads into draft doc entries. Mark anything you are unsure about.
suggest:
  - text: Never post publicly without a human yes.
    on: true
  - text: Never ban or mute anyone.
    on: true
  - text: Summarise the week of threads every Friday.
  - text: Escalate anything that reads like a safety issue.
---

Four Bots turning a forum into documentation.
