---
slug: infra-capacity
name: Capacity planning
tagline: Answers whether the system survives the next spike, before the spike rather than during it.
bots: 4
section: Infrastructure
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Datadog
  - Cloudflare
  - Supabase
  - Notion
connector_modes:
  Datadog: draft
  Cloudflare: draft
  Supabase: draft
  Notion: draft
agents:
  - name: Capacity · Trend
    persona: Projects load growth from the trailing quarter, not from last week.
    icon: pipeline
    connectors:
      - Datadog
  - name: Capacity · Limits
    persona: Records the known ceiling for each component and how close it is.
    icon: shield
    connectors:
      - Supabase
  - name: Capacity · Edge
    persona: Reports cache hit rates and what a miss actually costs.
    icon: search
    connectors:
      - Cloudflare
  - name: Capacity · Plan
    persona: Writes the capacity note naming the first thing that breaks.
    icon: recap
    connectors:
      - Notion
rooms:
  - name: Capacity desk
    members:
      - Capacity · Trend
      - Capacity · Limits
      - Capacity · Edge
      - Capacity · Plan
routines:
  - name: Trend read
    owner: Capacity · Trend
    schedule: Every Monday at 09:00
    prompt: Project load growth from the trailing quarter. Name the component that hits a limit first.
  - name: Limit check
    owner: Capacity · Limits
    schedule: Every weekday at 08:00
    prompt: Report each component against its known ceiling. Never change a limit.
suggest:
  - text: Never apply a change. Draft the plan.
    on: true
  - text: Never touch production without a human yes.
    on: true
  - text: Name the blast radius before the fix.
  - text: Page me only for real user impact.
---

Four Bots ahead of the spike. Read-only against production.
