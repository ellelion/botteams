---
slug: data-requests
name: Data requests
tagline: Runs the ad-hoc data request queue so questions get answered once and the answer is findable next time.
bots: 4
section: Data
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Notion
  - Google Cloud BigQuery
  - Gmail
  - Linear
agents:
  - name: Requests · Intake
    persona: Reads incoming data questions and restates each one precisely enough to answer.
    icon: inbox
    connectors:
      - Gmail
  - name: Requests · Duplicate
    persona: Checks whether the question was already answered and points at the answer.
    icon: search
    connectors:
      - Notion
  - name: Requests · Draft
    persona: Drafts the query and explains what it does and does not include.
    icon: pen
    connectors:
      - Google Cloud BigQuery
  - name: Requests · Queue
    persona: Keeps the queue in Linear with age and requester visible.
    icon: pipeline
    connectors:
      - Linear
rooms:
  - name: Requests desk
    members:
      - Requests · Intake
      - Requests · Duplicate
      - Requests · Draft
      - Requests · Queue
routines:
  - name: Intake pass
    owner: Requests · Intake
    schedule: Every weekday at 09:00
    prompt: Restate new data questions precisely. Flag any that cannot be answered as asked.
  - name: Queue age
    owner: Requests · Queue
    schedule: Every Monday at 09:30
    prompt: List open data requests by age, oldest first, with requester.
---

Four Bots on ad-hoc requests. Answers once, then makes it findable.
