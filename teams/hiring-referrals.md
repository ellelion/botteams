---
slug: hiring-referrals
name: Referral program
tagline: Keeps referrals from disappearing, since they convert best and get chased least.
bots: 4
section: Hiring
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Ashby
  - Gmail
  - Notion
  - LinkedIn
connector_modes:
  Ashby: draft
  Gmail: draft
  Notion: draft
  LinkedIn: ask
bot_roster:
  - name: Referral · Intake
    persona: Records every referral with who referred and for what role.
    icon: clipboard
    connectors:
      - Notion
  - name: Referral · Speed
    persona: Flags referrals not contacted within two days.
    icon: shield
    connectors:
      - Ashby
  - name: Referral · Update
    persona: Drafts the update to the referrer, because not hearing back stops referrals.
    icon: pen
    connectors:
      - Gmail
  - name: Referral · Sources
    persona: Reports which people refer candidates who actually get hired.
    icon: pipeline
    connectors:
      - LinkedIn
rooms:
  - name: Referral desk
    members:
      - Referral · Intake
      - Referral · Speed
      - Referral · Update
      - Referral · Sources
routines:
  - name: Speed check
    owner: Referral · Speed
    schedule: Every weekday at 09:00
    prompt: List referrals not contacted within two days of being referred.
  - name: Referrer update
    owner: Referral · Update
    schedule: Every Friday at 15:00
    prompt: Draft an update for every referrer with a candidate in play. Never send.
suggest:
  - text: Never mail a candidate without a human yes.
    on: true
  - text: Never reject anyone automatically.
    on: true
  - text: Judge on the work, not on the school.
  - text: Flag a role that has been open over 30 days.
---

Four Bots on referrals. Keeps the referrer informed, drafts only.
