---
slug: support
name: Support company
tagline: "Runs a support desk: tickets triaged by urgency, replies drafted in the support voice, and follow-ups chased. Never sends."
bots: 3
section: Support
status: installable
kind: team
added_at: "2026-08-20T20:50:24.000Z"
connectors:
  - Gmail
  - Zendesk
  - Intercom
  - Linear
connector_modes:
  Gmail: draft
  Zendesk: ask
  Intercom: ask
  Linear: draft
agents:
  - name: Support · Triage
    persona: Labels incoming support mail by urgency. Does not reply.
    icon: inbox
    connectors:
      - Gmail
      - Zendesk
  - name: Support · Drafts
    persona: Drafts replies. Never sends.
    icon: pen
    connectors:
      - Gmail
      - Intercom
  - name: Support · Follow-ups
    persona: Drafts waiting-on-us follow-ups. Never sends.
    icon: inbox
    connectors:
      - Gmail
      - Linear
rooms:
  - name: Support desk
    members:
      - Support · Triage
      - Support · Drafts
      - Support · Follow-ups
routines:
  - name: Morning triage
    owner: Support · Triage
    schedule: Weekdays at 08:00
    prompt: Cluster overnight support mail by urgency in Support desk. Do not reply.
  - name: Draft replies
    owner: Support · Drafts
    schedule: Weekdays at 10:00
    prompt: Draft replies for the urgent cluster. Do not send.
  - name: Waiting follow-ups
    owner: Support · Follow-ups
    schedule: Weekdays at 15:00
    prompt: Draft follow-ups for threads waiting on us. Do not send.
skills: []
suggest:
  - text: Never send a reply without a human yes.
    on: true
  - text: Never promise a refund.
    on: true
  - text: Escalate anything about data loss immediately.
  - text: Summarise the top three themes each week.
---

Support company is a three-Bot desk. Triage labels. Drafts writes. Follow-ups nudges. Drafts, never sends. Gmail is an account-wide connector, not a plugin this site installs.

## Reference

Support · Drafts writes replies and never sends. The email-adjacent reference is Resend's official Agent Plugin (resend 1.0.0) on the [Agent Plugins Directory](https://agentpluginsdirectory.com/). These are references the team expects. This site does not install them.
