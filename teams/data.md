---
slug: data
name: Data desk
tagline: "Runs a data floor: warehouse checks, product analytics read, model failures caught, and a weekly note on which numbers are unsafe to quote."
bots: 6
section: Data
status: installable
kind: team
added_at: "2026-08-21T03:57:51.000Z"
connectors:
  - Google Cloud BigQuery
  - Snowflake
  - Mixpanel
  - PostHog
  - dbt Labs
connector_modes:
  Google Cloud BigQuery: draft
  Snowflake: draft
  Mixpanel: draft
  PostHog: draft
  dbt Labs: draft
bot_roster:
  - name: Data · Warehouse
    persona: Runs read-only BigQuery checks on the numbers the company quotes. Never writes or drops a table.
    icon: search
    connectors:
      - Google Cloud BigQuery
  - name: Data · Lake
    persona: Watches Snowflake for query cost spikes and tables nobody reads. Reports only, never alters storage.
    icon: card
    connectors:
      - Snowflake
  - name: Data · Product
    persona: Reads Mixpanel funnels and flags where they moved. Never changes an event or a report.
    icon: pipeline
    connectors:
      - Mixpanel
  - name: Data · Web
    persona: Reads PostHog for session and conversion changes. Reports what shifted and by how much.
    icon: pipeline
    connectors:
      - PostHog
  - name: Data · Models
    persona: Watches dbt runs for failures and stale models. Never triggers a rebuild.
    icon: shield
    connectors:
      - dbt Labs
  - name: Data · Recap
    persona: Writes the data recap. What moved, what broke, which number should not be quoted this week.
    icon: recap
    connectors: []
rooms:
  - name: Data floor
    members:
      - Data · Warehouse
      - Data · Lake
      - Data · Product
      - Data · Web
      - Data · Models
      - Data · Recap
routines:
  - name: Model health
    owner: Data · Models
    schedule: Every weekday at 08:00
    prompt: Report failed or stale dbt models since yesterday. Name the downstream reports each one affects. Never rebuild.
  - name: Cost watch
    owner: Data · Lake
    schedule: Every Monday at 10:00
    prompt: Report the ten most expensive Snowflake queries of the past week and who ran them. Never alter anything.
  - name: Data recap
    owner: Data · Recap
    schedule: Every Friday at 16:00
    prompt: Recap funnel movement, model failures, cost spikes, and any number that is currently unsafe to quote.
suggest:
  - text: Read only. Never write back to a warehouse table.
    on: true
  - text: Never present a number without the query behind it.
    on: true
  - text: Say out loud when a dashboard is stale.
  - text: Flag a metric that moved more than 20 percent.
---

Example six-Bot data desk. Read-only against every warehouse.
