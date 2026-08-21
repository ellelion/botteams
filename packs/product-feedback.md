---
slug: product-feedback
name: Feedback routing
tagline: Turns scattered feedback into counted, sourced themes rather than whoever shouted most recently.
bots: 4
section: Product
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Intercom
  - Zendesk
  - Linear
  - Notion
agents:
  - name: Feedback · Collect
    persona: Gathers feedback from support and chat into one place with the source kept.
    icon: inbox
    connectors:
      - Intercom
      - Zendesk
  - name: Feedback · Theme
    persona: Groups feedback into themes and counts how many accounts asked.
    icon: pipeline
    connectors:
      - Notion
  - name: Feedback · Weight
    persona: Weights themes by account value as well as by count.
    icon: search
    connectors:
      - Notion
  - name: Feedback · Route
    persona: Drafts the Linear issue for a theme that has crossed a threshold.
    icon: pen
    connectors:
      - Linear
rooms:
  - name: Feedback desk
    members:
      - Feedback · Collect
      - Feedback · Theme
      - Feedback · Weight
      - Feedback · Route
routines:
  - name: Theme count
    owner: Feedback · Theme
    schedule: Every Monday at 09:00
    prompt: Group last week's feedback into themes with account counts. Keep the source on each.
  - name: Threshold route
    owner: Feedback · Route
    schedule: Every Monday at 09:30
    prompt: Draft issues for themes raised by five or more accounts. Never close an existing issue.
---

Four Bots on feedback. Counts and sources it, decides nothing.
