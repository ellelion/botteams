---
slug: sales-proposals
name: Proposal desk
tagline: Keeps proposals accurate and consistent, and stops silence being mistaken for consideration.
bots: 4
section: Sales
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Salesforce
  - Docusign
  - Notion
  - Gmail
connector_modes:
  Salesforce: ask
  Docusign: draft
  Notion: draft
  Gmail: draft
bot_roster:
  - name: Proposal · Build
    persona: Drafts the proposal from the opportunity record.
    icon: pen
    connectors:
      - Salesforce
  - name: Proposal · Check
    persona: Checks pricing and terms against what was actually discussed.
    icon: shield
    connectors:
      - Notion
  - name: Proposal · Track
    persona: Tracks proposals out and flags the quiet ones.
    icon: clipboard
    connectors:
      - Docusign
  - name: Proposal · Draft
    persona: Drafts the nudge for a proposal gone quiet. Never sends.
    icon: inbox
    connectors:
      - Gmail
rooms:
  - name: Proposal desk
    members:
      - Proposal · Build
      - Proposal · Check
      - Proposal · Track
      - Proposal · Draft
routines:
  - name: Terms check
    owner: Proposal · Check
    schedule: Every weekday at 10:00
    prompt: Check draft proposals against what was discussed. Flag any pricing that does not match.
  - name: Quiet watch
    owner: Proposal · Track
    schedule: Every weekday at 16:00
    prompt: List proposals with no response for five days, oldest first.
suggest:
  - text: Never email a prospect. Draft only.
    on: true
  - text: Never discount without a human yes.
    on: true
  - text: Update the CRM stage only after the call.
  - text: Tell me which deals went quiet this week.
---

Four Bots on proposals. Checks terms, signs nothing.
