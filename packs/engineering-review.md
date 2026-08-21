---
slug: engineering-review
name: Code review flow
tagline: Stops pull requests going stale by making the wait visible, without nagging anyone directly.
bots: 4
section: Engineering
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - GitHub
  - Linear
  - Sentry
agents:
  - name: Review · Waiting
    persona: Lists pull requests waiting on review, by how long, not by author.
    icon: inbox
    connectors:
      - GitHub
  - name: Review · Blocked
    persona: Finds pull requests blocked on a failing check rather than on a person.
    icon: shield
    connectors:
      - GitHub
  - name: Review · Risk
    persona: Flags changes touching payment, auth, or migration paths for a closer look.
    icon: search
    connectors:
      - GitHub
      - Sentry
  - name: Review · Load
    persona: Reports how review load is distributed, so it stops landing on the same two people.
    icon: pipeline
    connectors:
      - Linear
rooms:
  - name: Review floor
    members:
      - Review · Waiting
      - Review · Blocked
      - Review · Risk
      - Review · Load
routines:
  - name: Waiting pass
    owner: Review · Waiting
    schedule: Every weekday at 09:30 and 15:00
    prompt: List pull requests waiting on review longer than a day, oldest first. Never comment on one.
  - name: Risk flag
    owner: Review · Risk
    schedule: Every weekday at 10:00
    prompt: Flag open pull requests touching payment, auth, or migrations.
---

Four Bots on review flow. Makes waiting visible, never nags.
