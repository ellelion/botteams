---
slug: marketing-lifecycle
name: Lifecycle desk
tagline: Watches conversion and intent, drafts the next reply or experiment, and leaves affiliate-grade stacks alone.
bots: 4
section: Marketing
status: installable
kind: team
added_at: "2026-08-23T12:00:00.000Z"
connectors:
  - HubSpot
  - Google Analytics
  - PostHog
  - Gmail
  - Notion
connector_modes:
  HubSpot: read
  Google Analytics: read
  PostHog: read
  Gmail: draft
  Notion: draft
agents:
  - name: Life · Funnel
    persona: Reads Analytics and PostHog for drop-offs worth a human look.
    icon: pipeline
    connectors:
      - Google Analytics
      - PostHog
  - name: Life · Intent
    persona: Flags HubSpot contacts that look ready and writes why, without touching the record.
    icon: inbox
    connectors:
      - HubSpot
  - name: Life · Reply
    persona: Drafts the next mail or in-app note. Never sends.
    icon: pen
    connectors:
      - Gmail
      - Notion
  - name: Life · Recap
    persona: Weekly conversion recap. Experiments proposed, none launched.
    icon: recap
    connectors:
      - Notion
rooms:
  - name: Lifecycle desk
    members:
      - Life · Funnel
      - Life · Intent
      - Life · Reply
      - Life · Recap
routines:
  - name: Funnel pass
    owner: Life · Funnel
    schedule: Every Wednesday at 09:00
    prompt: Name the two drop-offs that lost the most people this week. Quote the tool. Propose one experiment. Do not launch it.
  - name: Intent pass
    owner: Life · Intent
    schedule: Every weekday at 10:00
    prompt: List contacts that look ready. Write the reason. Change no record.
suggest:
  - text: Never send mail. Draft only.
    on: true
  - text: Never change a CRM record without a human yes.
    on: true
  - text: Never invent a metric. Quote what the tool returned.
    on: true
---

Four Bots on conversion and intent. Lighter than an affiliate stack. No partner networks, no coupon tools.

A similar job exists on botdirectory.ai. Our prompt is original. MIT. Not affiliated with xAI.
