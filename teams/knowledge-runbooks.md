---
slug: knowledge-runbooks
name: Runbooks
tagline: Keeps operational runbooks correct, since a wrong runbook is read at the worst possible moment.
bots: 4
section: Knowledge
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Notion
  - PagerDuty
  - GitHub
  - Glean
connector_modes:
  Notion: draft
  PagerDuty: draft
  GitHub: draft
  Glean: draft
agents:
  - name: Runbook · Coverage
    persona: Names alerts with no runbook attached.
    icon: shield
    connectors:
      - PagerDuty
  - name: Runbook · Drift
    persona: Checks runbook steps against how the system actually works now.
    icon: search
    connectors:
      - GitHub
  - name: Runbook · Used
    persona: Reports which runbooks were opened during real incidents.
    icon: pipeline
    connectors:
      - Glean
  - name: Runbook · Draft
    persona: Drafts the missing runbook from the incident record.
    icon: pen
    connectors:
      - Notion
rooms:
  - name: Runbook desk
    members:
      - Runbook · Coverage
      - Runbook · Drift
      - Runbook · Used
      - Runbook · Draft
routines:
  - name: Coverage check
    owner: Runbook · Coverage
    schedule: Every Monday at 09:00
    prompt: List alerts with no runbook, most frequently firing first.
  - name: Drift check
    owner: Runbook · Drift
    schedule: Every month on the 1st at 10:00
    prompt: Compare runbook steps to current system behaviour. Name steps that no longer apply.
suggest:
  - text: Never delete a page. Archive it and say so.
    on: true
  - text: Draft edits, never publish over someone.
    on: true
  - text: Link the source for every claim.
  - text: Flag a page nobody has touched in a year.
---

Four Bots on runbooks, checked before they are needed.
