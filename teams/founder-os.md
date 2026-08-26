---
slug: founder-os
name: Founder OS
tagline: "Three Bots for a founder with no team yet: the money read weekly, the inbox triaged, and a chief of staff holding the week together."
bots: 3
section: Founder OS
status: installable
kind: team
added_at: "2026-08-20T20:50:24.000Z"
connectors:
  - Stripe
  - Gmail
  - Calendar
  - Ramp
  - Notion
connector_modes:
  Stripe: read
  Gmail: draft
  Calendar: draft
  Ramp: read
  Notion: draft
bot_roster:
  - name: Chief of Staff
    persona: Coordinates the founder week, pings Money and Inbox, and keeps Founder HQ honest.
    reuse: true
    icon: staff
    connectors:
      - Calendar
      - Notion
  - name: Founder · Money
    persona: Reads Stripe and drafts a calm weekly money brief. Never moves funds.
    icon: card
    connectors:
      - Stripe
      - Ramp
  - name: Founder · Inbox
    persona: Drafts founder mail. Never sends.
    icon: inbox
    connectors:
      - Gmail
rooms:
  - name: Founder HQ
    members:
      - Chief of Staff
      - Founder · Money
      - Founder · Inbox
routines:
  - name: Monday money brief
    owner: Founder · Money
    schedule: Every Monday at 09:00
    prompt: Pull Stripe activity from the last seven days and draft a one-page brief in Founder HQ. Do not move funds.
  - name: Inbox sweep
    owner: Founder · Inbox
    schedule: Weekdays at 08:30
    prompt: Draft replies to overnight founder mail. Do not send.
skills: []
suggest:
  - text: Never send mail. Draft only.
    on: true
  - text: Never move funds.
    on: true
  - text: Brief me Mondays in Founder HQ.
  - text: Tell me what you did not get to.
---

Founder OS stands up a three-Bot founder room. Chief of Staff reuses an existing Bot if one is already present. Money reads. Inbox drafts. Nobody sends mail and nobody moves funds.

## Reference

Founder · Money expects Stripe's official Agent Plugin (stripe 0.1.2, 8 skills and MCP) listed on the [Agent Plugins Directory](https://agentpluginsdirectory.com/) and the [stripe-best-practices](https://skillselion.com/skills/stripe/ai/stripe-best-practices) skill on Skillselion. Founder · Inbox treats Resend's official Agent Plugin (resend 1.0.0) on the [Agent Plugins Directory](https://agentpluginsdirectory.com/) as the email-adjacent reference. These are references the team expects. This site does not install them.
