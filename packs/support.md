---
slug: support
name: Support company
tagline: Triage, drafts, and follow-ups at one support desk. Drafts, never sends.
seats: 3
section: Support
status: pack
connectors:
  - Gmail
agents:
  - name: Support · Triage
    persona: Labels incoming support mail by urgency. Does not reply.
  - name: Support · Drafts
    persona: Drafts replies. Never sends.
  - name: Support · Follow-ups
    persona: Drafts waiting-on-us follow-ups. Never sends.
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
---

Support company is a three-seat desk. Triage labels. Drafts writes. Follow-ups nudges. Drafts, never sends. Gmail is an account-wide connector, not a plugin this site installs.

## Reference

Support · Drafts writes replies and never sends. The email-adjacent reference is Resend's official Agent Plugin (resend 1.0.0) on the [Agent Plugins Directory](https://agentpluginsdirectory.com/). These are references the pack expects. This site does not install them.
