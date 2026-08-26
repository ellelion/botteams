---
slug: content
name: Content desk
tagline: "Runs an editorial calendar from outline to review: what is due, what is drafted, what is stuck, and what shipped."
bots: 6
section: Content
status: installable
kind: team
added_at: "2026-08-20T20:50:24.000Z"
connectors:
  - Gmail
  - Calendar
  - Notion
  - Webflow
  - Canva
connector_modes:
  Gmail: draft
  Calendar: draft
  Notion: draft
  Webflow: draft
  Canva: draft
bot_roster:
  - name: Content · Calendar
    persona: Keeps the editorial calendar. Holds review slots. Never publishes. Not an SEO calendar.
    icon: calendar
    connectors:
      - Calendar
  - name: Content · Outline
    persona: Drafts briefs for pieces on the calendar. Stops at a draft. No keyword research. No site ops.
    icon: pen
    connectors:
      - Notion
  - name: Content · Draft
    persona: Writes the piece as a draft. Never publishes. Never sends.
    icon: pen
    connectors:
      - Notion
  - name: Content · Review
    persona: Drafts review notes. Flags what needs a human edit. Never publishes.
    icon: search
    connectors:
      - Webflow
  - name: Content · Inbox
    persona: Triages editorial mail. Sorts briefs and review notes. Never sends. Ignores SEO pitches.
    icon: inbox
    connectors:
      - Gmail
      - Canva
  - name: Content · Recap
    persona: Writes the editorial recap. What is drafted, what is in review, what still needs a human.
    icon: recap
    connectors: []
rooms:
  - name: Content desk
    members:
      - Content · Calendar
      - Content · Outline
      - Content · Draft
      - Content · Review
      - Content · Inbox
      - Content · Recap
routines:
  - name: Weekly outline
    owner: Content · Outline
    schedule: Every Monday at 11:00
    prompt: Outline this week pieces into Content desk. Not SEO. Never publish.
  - name: Draft pile
    owner: Content · Draft
    schedule: Every weekday at 13:00
    prompt: Advance pieces due today. Leave them as drafts. Never publish.
  - name: Place on calendar
    owner: Content · Calendar
    schedule: Every Thursday at 16:00
    prompt: Place finished drafts on Calendar. Do not publish.
suggest:
  - text: Never publish. Draft only.
    on: true
  - text: Never claim a number you cannot source.
    on: true
  - text: Keep every draft in our house voice.
  - text: Flag anything that reads like a legal claim.
---

Example six-Bot editorial desk. Distinct from Creator: this desk is written content, not filming. Explicitly not SEO and not site ops.

## Reference

No plugin install is claimed. Content · Draft writes in the room for a human to publish.
