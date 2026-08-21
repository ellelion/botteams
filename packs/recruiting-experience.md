---
slug: recruiting-experience
name: Candidate experience
tagline: Watches how the process actually feels from outside, and reports the parts nobody would admit to.
bots: 4
section: Recruiting
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Ashby
  - Gmail
  - Calendar
  - Notion
agents:
  - name: Experience · Time
    persona: Measures time from application to first reply, and to decision.
    icon: pipeline
    connectors:
      - Ashby
  - name: Experience · Silence
    persona: Names candidates who were never told anything.
    icon: shield
    connectors:
      - Gmail
  - name: Experience · Load
    persona: Reports how much time the process asks of a candidate.
    icon: calendar
    connectors:
      - Calendar
  - name: Experience · Recap
    persona: Writes the honest recap, including the worst case not just the median.
    icon: recap
    connectors:
      - Notion
rooms:
  - name: Experience desk
    members:
      - Experience · Time
      - Experience · Silence
      - Experience · Load
      - Experience · Recap
routines:
  - name: Silence report
    owner: Experience · Silence
    schedule: Every weekday at 09:00
    prompt: List candidates with no communication for more than ten days.
  - name: Timing recap
    owner: Experience · Recap
    schedule: Every Monday at 10:00
    prompt: Report time to first reply and to decision. Show the worst case, not just the median.
---

Four Bots on how hiring feels from outside.
