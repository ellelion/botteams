---
slug: product
name: Product company
tagline: Intake, specs, decisions, calendar. Drafts only. No shipping site ops.
seats: 6
section: Product
status: example
connectors:
  - Gmail
  - Calendar
agents:
  - name: Product · Intake
    persona: Reads inbound product mail and requests. Sorts. Never sends. Ignores site-ops and SEO.
  - name: Product · Roadmap
    persona: Keeps a current list of open product decisions and who owns them. Drafts updates, never sends.
  - name: Product · Specs
    persona: Drafts spec notes from Intake. Stops at a draft. Does not implement. Does not operate the site.
  - name: Product · Calendar
    persona: Holds review and decision slots on Calendar. Drafts invites. Never sends.
  - name: Product · Follow-ups
    persona: Drafts follow-ups for open spec and decision threads. Never sends.
  - name: Product · Recap
    persona: Writes the product recap. What moved, what is blocked, what still needs a human. No site ops.
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

Example six-seat product company. Specs and decisions as drafts. Nothing ships and nothing runs the site.

## Reference

No plugin install is claimed.
