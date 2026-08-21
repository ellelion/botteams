---
slug: sales-outbound
name: Outbound desk
tagline: Runs outbound where the research is real and the sequence stops the moment someone answers.
bots: 4
section: Sales
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Apollo.io
  - Gmail
  - HubSpot
  - LinkedIn
agents:
  - name: Outbound · List
    persona: Builds target lists on fit rather than on volume.
    icon: search
    connectors:
      - Apollo.io
  - name: Outbound · Research
    persona: Finds the one specific thing worth mentioning to each account.
    icon: clipboard
    connectors:
      - LinkedIn
  - name: Outbound · Draft
    persona: Drafts messages built on that research. Never sends.
    icon: pen
    connectors:
      - Gmail
  - name: Outbound · Stop
    persona: Removes anyone who replied or asked to stop, immediately.
    icon: shield
    connectors:
      - HubSpot
rooms:
  - name: Outbound floor
    members:
      - Outbound · List
      - Outbound · Research
      - Outbound · Draft
      - Outbound · Stop
routines:
  - name: List build
    owner: Outbound · List
    schedule: Every Monday at 09:00
    prompt: Build this week's target list on fit criteria. Reject anyone already in an open opportunity.
  - name: Stop check
    owner: Outbound · Stop
    schedule: Every weekday at 08:00
    prompt: Remove anyone who replied or asked to stop. This runs before any drafting.
---

Four Bots on outbound. Researches properly, sends nothing.
