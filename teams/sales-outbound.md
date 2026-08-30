---
slug: sales-outbound
name: Outbound desk
tagline: Runs outbound where the research is real and the sequence stops the moment someone answers.
bullets:
  - List builds the target list
  - Research finds the one thing worth mentioning
  - Draft writes the message
  - Stop drops anyone who replied
bots: 4
section: Sales
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Apollo.io
  - Gmail
  - HubSpot
  - LinkedIn
connector_modes:
  Apollo.io: draft
  Gmail: draft
  HubSpot: ask
  LinkedIn: ask
bot_roster:
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
  - name: Outbound floor group chat
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
suggest:
  - text: Never email a prospect. Draft only.
    on: true
  - text: Never discount without a human yes.
    on: true
  - text: Update the CRM stage only after the call.
  - text: Tell me which deals went quiet this week.
---

Four Bots on outbound. Researches properly, sends nothing.
