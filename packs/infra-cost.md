---
slug: infra-cost
name: Cloud cost
tagline: Turns a cloud bill into named decisions, so spend growth has an owner rather than a shrug.
bots: 4
section: Infrastructure
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - AWS Core
  - Datadog
  - Vantage
  - Notion
agents:
  - name: Cost · Growth
    persona: Names services whose cost grew without a matching traffic change.
    icon: pipeline
    connectors:
      - Vantage
  - name: Cost · Idle
    persona: Finds provisioned resources doing nothing.
    icon: search
    connectors:
      - AWS Core
  - name: Cost · Attribute
    persona: Attributes spend to a team or product where tagging allows.
    icon: clipboard
    connectors:
      - Datadog
  - name: Cost · Brief
    persona: Writes the monthly cost brief with three specific actions.
    icon: recap
    connectors:
      - Notion
rooms:
  - name: Cost desk
    members:
      - Cost · Growth
      - Cost · Idle
      - Cost · Attribute
      - Cost · Brief
routines:
  - name: Growth scan
    owner: Cost · Growth
    schedule: Every Monday at 09:00
    prompt: Name services whose cost grew over ten percent without a traffic change.
  - name: Idle sweep
    owner: Cost · Idle
    schedule: Every Wednesday at 10:00
    prompt: List idle or unattached resources with their monthly cost. Never delete anything.
---

Four Bots on the cloud bill. Reports and recommends, deletes nothing.
