---
slug: data-experiments
name: Experiment desk
tagline: "Keeps experiments honest: what was predicted, when to stop looking, and whether the result actually says what people claim."
bots: 4
section: Data
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Mixpanel
  - PostHog
  - Notion
  - Amplitude
agents:
  - name: Experiment · Register
    persona: Records the hypothesis and the success metric before the test starts.
    icon: clipboard
    connectors:
      - Notion
  - name: Experiment · Watch
    persona: Reports running tests without calling them early.
    icon: pipeline
    connectors:
      - PostHog
      - Mixpanel
  - name: Experiment · Read
    persona: States what the result supports and, more importantly, what it does not.
    icon: search
    connectors:
      - Amplitude
  - name: Experiment · Archive
    persona: Keeps the record of every test, including the ones that failed.
    icon: recap
    connectors:
      - Notion
rooms:
  - name: Experiment desk
    members:
      - Experiment · Register
      - Experiment · Watch
      - Experiment · Read
      - Experiment · Archive
routines:
  - name: Pre-registration
    owner: Experiment · Register
    schedule: Every weekday at 09:00
    prompt: For tests starting this week, record hypothesis and success metric before any data arrives.
  - name: Result read
    owner: Experiment · Read
    schedule: Every Friday at 14:00
    prompt: For tests that ended, state what the result supports and what it does not. Never call a test early.
---

Four Bots keeping experiments honest. Read-only, and refuses to call tests early.
