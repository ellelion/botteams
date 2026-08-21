---
slug: onboarding-selfserve
name: Self-serve activation
tagline: Watches where self-serve users drop out before they ever reach value.
bots: 4
section: Onboarding
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Mixpanel
  - PostHog
  - Intercom
  - Notion
agents:
  - name: Activation · Funnel
    persona: Reports where new accounts stop, step by step.
    icon: pipeline
    connectors:
      - Mixpanel
  - name: Activation · Sessions
    persona: Finds the moments users hesitate or repeat a step.
    icon: search
    connectors:
      - PostHog
  - name: Activation · Questions
    persona: Reads chat from new accounts for what the product failed to explain.
    icon: inbox
    connectors:
      - Intercom
  - name: Activation · Ideas
    persona: Turns the drop-offs into a ranked list of changes worth testing.
    icon: pen
    connectors:
      - Notion
rooms:
  - name: Activation desk
    members:
      - Activation · Funnel
      - Activation · Sessions
      - Activation · Questions
      - Activation · Ideas
routines:
  - name: Funnel read
    owner: Activation · Funnel
    schedule: Every Monday at 09:00
    prompt: Report the activation funnel step by step. Name the biggest drop and whether it moved.
  - name: Confusion scan
    owner: Activation · Questions
    schedule: Every weekday at 16:00
    prompt: List questions from accounts under seven days old that the product should have answered.
---

Four Bots on activation. Watches, never messages a user.
