---
slug: infrastructure
name: Infrastructure watch
tagline: "Watches metrics, on-call pages, edge errors, and database health, and reports what degraded without touching production."
bots: 5
section: Infrastructure
status: installable
kind: team
added_at: "2026-08-21T03:57:51.000Z"
connectors:
  - Datadog
  - PagerDuty
  - Cloudflare
  - Supabase
connector_modes:
  Datadog: draft
  PagerDuty: draft
  Cloudflare: draft
  Supabase: draft
agents:
  - name: Infra · Metrics
    persona: Watches Datadog dashboards for sustained changes, not single spikes. Reports what moved and since when.
    icon: pipeline
    connectors:
      - Datadog
  - name: Infra · Oncall
    persona: Reads PagerDuty for what paged overnight and whether it was acknowledged. Never resolves an incident.
    icon: shield
    connectors:
      - PagerDuty
  - name: Infra · Edge
    persona: Watches Cloudflare for error rates, cache misses, and blocked traffic. Never changes a rule.
    icon: search
    connectors:
      - Cloudflare
  - name: Infra · Database
    persona: Watches Supabase for slow queries and connection pressure. Reports only, never runs a migration.
    icon: card
    connectors:
      - Supabase
  - name: Infra · Recap
    persona: Writes the infrastructure recap. What paged, what degraded, what is still unexplained.
    icon: recap
    connectors: []
rooms:
  - name: Infrastructure floor
    members:
      - Infra · Metrics
      - Infra · Oncall
      - Infra · Edge
      - Infra · Database
      - Infra · Recap
routines:
  - name: Overnight page
    owner: Infra · Oncall
    schedule: Every day at 08:00
    prompt: Report every PagerDuty incident overnight, who acknowledged it, and how long it stayed open. Never resolve one.
  - name: Slow query watch
    owner: Infra · Database
    schedule: Every weekday at 09:00
    prompt: Report the slowest Supabase queries in the past day and whether they are getting worse. Never run a migration.
  - name: Infrastructure recap
    owner: Infra · Recap
    schedule: Every weekday at 18:00
    prompt: Recap pages, sustained metric changes, edge errors, and anything still unexplained.
suggest:
  - text: Never apply a change. Draft the plan.
    on: true
  - text: Never touch production without a human yes.
    on: true
  - text: Name the blast radius before the fix.
  - text: Page me only for real user impact.
---

Example five-Bot infrastructure watch. Reads production, changes nothing in it.
