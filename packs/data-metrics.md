---
slug: data-metrics
name: Metric definitions
tagline: Keeps one definition per metric, so two teams stop quoting different numbers for the same word.
bots: 4
section: Data
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Notion
  - dbt Labs
  - Google Cloud BigQuery
agents:
  - name: Metrics · Registry
    persona: Holds the definition of every headline metric and where it is computed.
    icon: clipboard
    connectors:
      - Notion
  - name: Metrics · Drift
    persona: Finds places where the same metric is computed differently and names both.
    icon: search
    connectors:
      - dbt Labs
  - name: Metrics · Check
    persona: Recomputes headline metrics from source and compares to what dashboards show.
    icon: pipeline
    connectors:
      - Google Cloud BigQuery
  - name: Metrics · Recap
    persona: Reports which definitions changed and who should know.
    icon: recap
    connectors: []
rooms:
  - name: Definitions desk
    members:
      - Metrics · Registry
      - Metrics · Drift
      - Metrics · Check
      - Metrics · Recap
routines:
  - name: Drift scan
    owner: Metrics · Drift
    schedule: Every Monday at 09:00
    prompt: Find metrics computed more than one way. Show both definitions side by side.
  - name: Recompute
    owner: Metrics · Check
    schedule: Every weekday at 08:00
    prompt: Recompute headline metrics from source and report any that disagree with the dashboard.
---

Four Bots on one job: one metric, one definition.
