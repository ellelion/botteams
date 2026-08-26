---
slug: infra-backups
name: Backup and recovery
tagline: Checks that backups exist and could actually be restored, which is not the same question.
bots: 4
section: Infrastructure
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Supabase
  - AWS Core
  - Notion
  - PagerDuty
connector_modes:
  Supabase: draft
  AWS Core: draft
  Notion: draft
  PagerDuty: draft
bot_roster:
  - name: Backup · Ran
    persona: Confirms each backup ran and how large it was.
    icon: shield
    connectors:
      - Supabase
      - AWS Core
  - name: Backup · Restore
    persona: Tracks when a restore was last tested and how long it took.
    icon: search
    connectors:
      - Notion
  - name: Backup · Gaps
    persona: Names data with no backup policy at all.
    icon: pipeline
    connectors:
      - AWS Core
  - name: Backup · Drill
    persona: Drafts the next recovery drill and who runs it.
    icon: clipboard
    connectors:
      - PagerDuty
rooms:
  - name: Recovery desk
    members:
      - Backup · Ran
      - Backup · Restore
      - Backup · Gaps
      - Backup · Drill
routines:
  - name: Backup check
    owner: Backup · Ran
    schedule: Every day at 07:00
    prompt: Confirm every scheduled backup ran and report size against the trailing average.
  - name: Restore age
    owner: Backup · Restore
    schedule: Every Monday at 10:00
    prompt: Report how long since each system had a tested restore. Name anything over ninety days.
suggest:
  - text: Never apply a change. Draft the plan.
    on: true
  - text: Never touch production without a human yes.
    on: true
  - text: Name the blast radius before the fix.
  - text: Page me only for real user impact.
---

Four Bots on the question nobody asks until it matters.
