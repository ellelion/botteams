---
slug: content
name: Content desk
tagline: Editorial calendar, briefs, drafts, review. Not an SEO crew.
seats: 6
section: Content
status: example
connectors:
  - Gmail
  - Calendar
agents:
  - name: Content · Calendar
    persona: Keeps the editorial calendar. Holds review slots. Never publishes. Not an SEO calendar.
  - name: Content · Outline
    persona: Drafts briefs for pieces on the calendar. Stops at a draft. No keyword research. No site ops.
  - name: Content · Draft
    persona: Writes the piece as a draft. Never publishes. Never sends.
  - name: Content · Review
    persona: Drafts review notes. Flags what needs a human edit. Never publishes.
  - name: Content · Inbox
    persona: Triages editorial mail. Sorts briefs and review notes. Never sends. Ignores SEO pitches.
  - name: Content · Recap
    persona: Writes the editorial recap. What is drafted, what is in review, what still needs a human.
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
---

Example six-seat editorial desk. Distinct from Creator: this desk is written content, not filming. Explicitly not SEO and not site ops.

## Reference

No plugin install is claimed. Content · Draft writes in the room for a human to publish.
