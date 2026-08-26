---
slug: creator
name: Creator studio
tagline: "Runs a solo creator studio: the week briefed, scripts drafted, sponsor mail sorted, and the calendar honest about what can ship."
bots: 6
section: Creator
status: installable
kind: team
added_at: "2026-08-20T20:50:24.000Z"
connectors:
  - Gmail
  - Calendar
  - YouTube
  - Canva
  - HeyGen
connector_modes:
  Gmail: draft
  Calendar: draft
  YouTube: ask
  Canva: draft
  HeyGen: draft
bot_roster:
  - name: Creator · Lead
    persona: Owns the studio brief. Coordinates the other five Bots. Does not publish. No site ops.
    icon: staff
    connectors:
      - YouTube
  - name: Creator · Script
    persona: Turns a brief into a script draft. Does not publish.
    icon: pen
    connectors:
      - HeyGen
  - name: Creator · Calendar
    persona: Places filming and review slots on Calendar. Does not publish.
    icon: calendar
    connectors:
      - Calendar
  - name: Creator · Sponsors
    persona: Tracks sponsor threads in Gmail. Drafts outreach. Never sends. No site ops.
    icon: inbox
    connectors:
      - Gmail
      - Canva
  - name: Creator · Inbox
    persona: Triage studio mail that is not site ops. Drafts, never sends. Hands sponsor threads to Creator · Sponsors.
    icon: inbox
    connectors:
      - Gmail
      - YouTube
  - name: Creator · Recap
    persona: Writes the end-of-day studio recap. Drafts only. Does not publish.
    icon: recap
    connectors: []
rooms:
  - name: Creator studio
    members:
      - Creator · Lead
      - Creator · Script
      - Creator · Calendar
      - Creator · Sponsors
      - Creator · Inbox
      - Creator · Recap
routines:
  - name: Studio brief
    owner: Creator · Lead
    schedule: Every weekday at 08:30
    prompt: Compile today filming slots, open drafts, and sponsor threads into Creator studio. Do not publish. No site ops.
  - name: Script drafts
    owner: Creator · Script
    schedule: Every weekday at 11:00
    prompt: Advance script drafts due today. Leave them as drafts. Do not publish.
  - name: Studio recap
    owner: Creator · Recap
    schedule: Every weekday at 17:30
    prompt: Write a short recap of what moved, what is still a draft, and tomorrow Calendar. Do not publish.
suggest:
  - text: Never publish or schedule without a human yes.
    on: true
  - text: Never reply as me in public.
    on: true
  - text: Keep captions under the platform limit.
  - text: Tell me which idea you dropped and why.
---

Example six-Bot creator studio. Distinct from Content: this room is filming and studio mail, not long-form editorial.

## Reference

The email-adjacent reference is Resend official Agent Plugin (resend 1.0.0) on the [Agent Plugins Directory](https://agentpluginsdirectory.com/).
