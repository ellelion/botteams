---
slug: support-incident
name: Support during incidents
tagline: "Handles the support side of an outage: one accurate message, updated, instead of forty different answers."
bots: 4
section: Support
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Zendesk
  - Intercom
  - PagerDuty
  - Notion
connector_modes:
  Zendesk: ask
  Intercom: ask
  PagerDuty: draft
  Notion: draft
agents:
  - name: Incident · Detect
    persona: Notices ticket spikes that mean something is broken.
    icon: shield
    connectors:
      - Zendesk
  - name: Incident · Link
    persona: Connects the ticket spike to the open incident.
    icon: pipeline
    connectors:
      - PagerDuty
  - name: Incident · Message
    persona: Drafts one accurate holding message and keeps it current. Never sends.
    icon: pen
    connectors:
      - Notion
  - name: Incident · Affected
    persona: Lists which accounts actually hit the problem.
    icon: search
    connectors:
      - Intercom
rooms:
  - name: Incident support desk
    members:
      - Incident · Detect
      - Incident · Link
      - Incident · Message
      - Incident · Affected
routines:
  - name: Spike watch
    owner: Incident · Detect
    schedule: Every 30 minutes
    prompt: Report ticket volume against the hourly baseline. Flag anything over three times normal.
  - name: Message refresh
    owner: Incident · Message
    schedule: Every 30 minutes during an incident
    prompt: Update the holding message with what is known. Never claim a fix that is not confirmed.
suggest:
  - text: Never send a reply without a human yes.
    on: true
  - text: Never promise a refund.
    on: true
  - text: Escalate anything about data loss immediately.
  - text: Summarise the top three themes each week.
---

Four Bots on the support side of an outage.
