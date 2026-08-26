---
slug: research
name: Research desk
tagline: "Runs a research desk: the brief written, sources found and dated, notes kept, and a synthesis that separates fact from inference."
bots: 6
section: Research
status: installable
kind: team
added_at: "2026-08-20T20:50:24.000Z"
connectors:
  - Gmail
  - Calendar
  - Notion
  - Exa
  - Glean
  - Firecrawl
connector_modes:
  Gmail: draft
  Calendar: draft
  Notion: draft
  Exa: draft
  Glean: draft
  Firecrawl: draft
bot_roster:
  - name: Research · Brief
    persona: Owns the research question. Keeps the desk on the brief. Does not run SEO or site ops.
    icon: staff
    connectors:
      - Notion
  - name: Research · Sources
    persona: Collects source notes for the brief. Quotes and dates them. Drafts only. Never sends.
    icon: search
    connectors:
      - Exa
      - Firecrawl
  - name: Research · Notes
    persona: Turns sources into structured notes. Stops at a draft. No publishing.
    icon: pen
    connectors:
      - Notion
  - name: Research · Synthesis
    persona: Drafts the synthesis for the room. Separates fact from inference. Never sends.
    icon: pen
    connectors:
      - Glean
  - name: Research · Calendar
    persona: Holds research review slots on Calendar. Drafts reminders. Never sends.
    icon: calendar
    connectors:
      - Calendar
  - name: Research · Recap
    persona: Writes the desk recap. What was learned, what is still open, what needs a human.
    icon: recap
    connectors: []
rooms:
  - name: Research desk
    members:
      - Research · Brief
      - Research · Sources
      - Research · Notes
      - Research · Synthesis
      - Research · Calendar
      - Research · Recap
routines:
  - name: Morning brief
    owner: Research · Brief
    schedule: Every weekday at 08:45
    prompt: Restate the live research question and today review slot. No SEO. No site ops.
  - name: Source pass
    owner: Research · Sources
    schedule: Every weekday at 12:00
    prompt: Add dated source notes for the brief. Drafts only.
  - name: Research recap
    owner: Research · Recap
    schedule: Every weekday at 16:45
    prompt: Recap notes, synthesis drafts, and open questions. Never publish.
suggest:
  - text: Never cite a source you did not read.
    on: true
  - text: Read and summarise. Never write to anything.
    on: true
  - text: Give me the counter-argument too.
  - text: Say how confident you are, and why.
---

Example six-Bot research desk. Not an SEO or ranking crew. Nothing publishes.

## Reference

No plugin install is claimed.
