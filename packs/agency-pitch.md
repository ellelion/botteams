---
slug: agency-pitch
name: New business desk
tagline: Runs the pitch pipeline from first inbound enquiry to sent proposal, so nothing sits unanswered while a prospect waits.
bots: 5
section: Agency
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Gmail
  - Calendar
  - Notion
  - Docusign
agents:
  - name: Pitch · Inbound
    persona: Sorts inbound project enquiries from the rest of the inbox and pulls out budget, timeline, and scope when the sender stated them. Never replies.
    icon: inbox
    connectors:
      - Gmail
  - name: Pitch · Brief
    persona: Turns a qualified enquiry into a one-page Notion brief covering what they asked for, what is missing, and what to ask on the call.
    icon: pen
    connectors:
      - Notion
  - name: Pitch · Calls
    persona: Watches Calendar for pitch calls and checks each one has a brief attached before it starts.
    icon: calendar
    connectors:
      - Calendar
  - name: Pitch · Proposal
    persona: Drafts the proposal from the brief and the call notes. Never sends it and never signs anything.
    icon: pen
    connectors:
      - Notion
  - name: Pitch · Signature
    persona: Tracks proposals out for signature in Docusign and says which have gone quiet. Never chases the client directly.
    icon: shield
    connectors:
      - Docusign
rooms:
  - name: New business floor
    members:
      - Pitch · Inbound
      - Pitch · Brief
      - Pitch · Calls
      - Pitch · Proposal
      - Pitch · Signature
routines:
  - name: Inbound triage
    owner: Pitch · Inbound
    schedule: Every 3 hours during working hours
    prompt: Sort new inbound enquiries. Pull out budget, timeline, and scope where stated. Flag anything with a deadline inside two weeks. Never reply.
  - name: Signature watch
    owner: Pitch · Signature
    schedule: Every weekday at 16:00
    prompt: List proposals out for signature longer than five days, oldest first. Never contact the client.
---

Five Bots from first enquiry to sent proposal. Drafts everything, sends nothing.
