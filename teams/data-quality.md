---
slug: data-quality
name: Data quality
tagline: "Checks the numbers before anyone quotes them: freshness, row counts, and the joins that silently drop records."
bots: 4
section: Data
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Google Cloud BigQuery
  - dbt Labs
  - Snowflake
  - Notion
connector_modes:
  Google Cloud BigQuery: draft
  dbt Labs: draft
  Snowflake: draft
  Notion: draft
agents:
  - name: Quality · Freshness
    persona: Names tables that stopped updating, and when they stopped.
    icon: shield
    connectors:
      - Google Cloud BigQuery
      - Snowflake
  - name: Quality · Volume
    persona: Watches row counts for sudden jumps or drops that nobody announced.
    icon: pipeline
    connectors:
      - Google Cloud BigQuery
  - name: Quality · Joins
    persona: Finds joins quietly dropping records and reports how many.
    icon: search
    connectors:
      - dbt Labs
  - name: Quality · Register
    persona: Keeps the register of known data problems and which reports they affect.
    icon: clipboard
    connectors:
      - Notion
rooms:
  - name: Quality desk
    members:
      - Quality · Freshness
      - Quality · Volume
      - Quality · Joins
      - Quality · Register
routines:
  - name: Freshness check
    owner: Quality · Freshness
    schedule: Every weekday at 07:00
    prompt: Name tables that did not update on schedule and how long they have been stale.
  - name: Volume watch
    owner: Quality · Volume
    schedule: Every weekday at 07:30
    prompt: Report row count changes over twenty percent against the trailing week.
suggest:
  - text: Read only. Never write back to a warehouse table.
    on: true
  - text: Never present a number without the query behind it.
    on: true
  - text: Say out loud when a dashboard is stale.
  - text: Flag a metric that moved more than 20 percent.
---

Four Bots checking numbers before they are quoted. Read-only throughout.
