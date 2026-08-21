---
slug: onboarding-enterprise
name: Enterprise rollout
tagline: Runs a large rollout where the buyer and the users are different people with different problems.
bots: 4
section: Onboarding
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - HubSpot
  - Calendar
  - Notion
  - Microsoft Teams
connector_modes:
  HubSpot: ask
  Calendar: draft
  Notion: draft
  Microsoft Teams: ask
agents:
  - name: Rollout · Plan
    persona: Holds the rollout plan by department with named owners.
    icon: clipboard
    connectors:
      - Notion
  - name: Rollout · Champions
    persona: Tracks who is actually driving it inside the customer, and flags when they go quiet.
    icon: staff
    connectors:
      - HubSpot
  - name: Rollout · Sessions
    persona: Schedules training per department and reports attendance.
    icon: calendar
    connectors:
      - Calendar
  - name: Rollout · Adoption
    persona: Reports adoption by department, not company-wide, because averages hide the problem.
    icon: pipeline
    connectors:
      - Microsoft Teams
rooms:
  - name: Rollout room
    members:
      - Rollout · Plan
      - Rollout · Champions
      - Rollout · Sessions
      - Rollout · Adoption
routines:
  - name: Champion check
    owner: Rollout · Champions
    schedule: Every Monday at 09:00
    prompt: Name customer champions who have gone quiet for more than two weeks.
  - name: Adoption by team
    owner: Rollout · Adoption
    schedule: Every Monday at 09:30
    prompt: Report adoption per department. Name the lowest three and how long they have been low.
suggest:
  - text: Never mail a new starter without a human yes.
    on: true
  - text: Never grant access to anything.
    on: true
  - text: Check day one is ready by the Friday before.
  - text: Ask the buddy how week one went, not the manager.
---

Four Bots on enterprise rollout. Reports per department, never averages.
