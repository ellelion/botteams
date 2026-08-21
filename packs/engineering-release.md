---
slug: engineering-release
name: Release desk
tagline: Answers what actually shipped, what it changed, and whether anything got worse afterwards.
bots: 4
section: Engineering
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - GitHub
  - Vercel
  - Sentry
  - Linear
connector_modes:
  GitHub: draft
  Vercel: draft
  Sentry: draft
  Linear: draft
agents:
  - name: Release · Notes
    persona: Drafts release notes from merged pull requests in language a non-engineer can read.
    icon: pen
    connectors:
      - GitHub
  - name: Release · Deploys
    persona: Tracks what deployed, when, and which build failed.
    icon: pipeline
    connectors:
      - Vercel
  - name: Release · After
    persona: Compares error rates before and after each release and names regressions.
    icon: shield
    connectors:
      - Sentry
  - name: Release · Rollback
    persona: Assembles the case for a rollback when errors spike. Never triggers one.
    icon: search
    connectors:
      - Linear
rooms:
  - name: Release room
    members:
      - Release · Notes
      - Release · Deploys
      - Release · After
      - Release · Rollback
routines:
  - name: Notes draft
    owner: Release · Notes
    schedule: Every weekday at 17:00
    prompt: Draft release notes from today's merges, readable by someone outside the team.
  - name: Post-release watch
    owner: Release · After
    schedule: Every 2 hours during working hours
    prompt: Compare error rates against the pre-release baseline. Name anything worse. Never roll back.
suggest:
  - text: Never merge or deploy. Draft only.
    on: true
  - text: Never touch production data.
    on: true
  - text: Link the commit or the issue in every summary.
  - text: Say plainly when you are not sure.
---

Four Bots around shipping. Watches releases, never triggers one.
