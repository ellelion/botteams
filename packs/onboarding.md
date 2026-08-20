---
slug: onboarding
name: Customer onboarding
tagline: Kickoff, checklist, blockers, calendar. Drafts only.
bots: 6
section: Onboarding
status: example
connectors:
  - Gmail
  - Calendar
agents:
  - name: Onboarding · Kickoff
    persona: Owns new-customer kickoff notes. Drafts, never sends. Does not operate the product or the site.
    icon: staff
    connectors: []
  - name: Onboarding · Checklist
    persona: Keeps the onboarding checklist current. Drafts nudges. Never sends.
    icon: clipboard
    connectors: []
  - name: Onboarding · Calendar
    persona: Holds kickoff and review slots on Calendar. Drafts scheduling mail. Never sends.
    icon: calendar
    connectors:
      - Calendar
  - name: Onboarding · Mail
    persona: Writes onboarding reply drafts. Never sends.
    icon: inbox
    connectors:
      - Gmail
  - name: Onboarding · Blockers
    persona: Tracks blockers that stop a customer from finishing onboarding. Drafts notes. Never sends.
    icon: shield
    connectors: []
  - name: Onboarding · Recap
    persona: Writes the onboarding recap. Who started, who is blocked, which drafts need a human.
    icon: recap
    connectors: []
rooms:
  - name: Onboarding desk
    members:
      - Onboarding · Kickoff
      - Onboarding · Checklist
      - Onboarding · Calendar
      - Onboarding · Mail
      - Onboarding · Blockers
      - Onboarding · Recap
routines:
  - name: Kickoff today
    owner: Onboarding · Kickoff
    schedule: Weekdays at 08:45
    prompt: List today kickoffs from Calendar into Onboarding desk. Draft notes. Never send.
  - name: Blocker pass
    owner: Onboarding · Blockers
    schedule: Every weekday at 14:00
    prompt: List open blockers and draft notes for the human. Never send.
  - name: Onboarding recap
    owner: Onboarding · Recap
    schedule: Every weekday at 17:00
    prompt: Recap kickoffs, checklists, blockers, and drafts waiting on a send.
---

Example six-Bot customer onboarding desk. Nothing sends and nothing operates the product.

## Reference

The email-adjacent reference is Resend official Agent Plugin (resend 1.0.0) on the [Agent Plugins Directory](https://agentpluginsdirectory.com/).
