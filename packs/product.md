---
slug: product
name: Product company
tagline: "Runs a product room: requests triaged into themes, the roadmap kept honest, specs drafted, and slippage made visible."
bots: 6
section: Product
status: team
added_at: "2026-08-20T20:50:24.000Z"
connectors:
  - Gmail
  - Calendar
  - Linear
  - Notion
  - Figma
  - Amplitude
agents:
  - name: Product · Intake
    persona: Reads inbound product mail and requests. Sorts. Never sends. Ignores site-ops and SEO.
    icon: inbox
    connectors:
      - Gmail
      - Linear
  - name: Product · Roadmap
    persona: Keeps a current list of open product decisions and who owns them. Drafts updates, never sends.
    icon: pipeline
    connectors:
      - Linear
  - name: Product · Specs
    persona: Drafts spec notes from Intake. Stops at a draft. Does not implement. Does not operate the site.
    icon: pen
    connectors:
      - Notion
      - Figma
  - name: Product · Calendar
    persona: Holds review and decision slots on Calendar. Drafts invites. Never sends.
    icon: calendar
    connectors:
      - Calendar
  - name: Product · Follow-ups
    persona: Drafts follow-ups for open spec and decision threads. Never sends.
    icon: inbox
    connectors:
      - Gmail
      - Amplitude
  - name: Product · Recap
    persona: Writes the product recap. What moved, what is blocked, what still needs a human. No site ops.
    icon: recap
    connectors: []
rooms:
  - name: Product room
    members:
      - Product · Intake
      - Product · Roadmap
      - Product · Specs
      - Product · Calendar
      - Product · Follow-ups
      - Product · Recap
routines:
  - name: Request intake
    owner: Product · Intake
    schedule: Every weekday at 09:00
    prompt: Sweep inbound product requests. Sort. Skip site-ops and SEO. Never send.
  - name: Spec drafts
    owner: Product · Specs
    schedule: Every weekday at 14:00
    prompt: Draft spec notes for Intake-marked requests. Stop at drafts. Do not implement.
  - name: Product recap
    owner: Product · Recap
    schedule: Every weekday at 17:00
    prompt: Recap specs, decisions, and Calendar holds. No site ops.
---

Example six-Bot product company. Specs and decisions as drafts. Nothing ships and nothing runs the site.

## Reference

No plugin install is claimed.
