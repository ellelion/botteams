---
slug: helpdesk-macros
name: Reply library
tagline: Keeps canned replies accurate, because a wrong saved reply is worse than no saved reply.
bots: 4
section: Helpdesk
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Zendesk
  - Notion
  - Intercom
agents:
  - name: Macros · Usage
    persona: Reports which saved replies are used and which are never touched.
    icon: pipeline
    connectors:
      - Zendesk
  - name: Macros · Stale
    persona: Finds replies referring to features or prices that changed.
    icon: shield
    connectors:
      - Notion
  - name: Macros · Gaps
    persona: Names questions answered repeatedly by hand that deserve a saved reply.
    icon: search
    connectors:
      - Intercom
  - name: Macros · Draft
    persona: Drafts new saved replies in the support voice. Never publishes one.
    icon: pen
    connectors:
      - Notion
rooms:
  - name: Macro desk
    members:
      - Macros · Usage
      - Macros · Stale
      - Macros · Gaps
      - Macros · Draft
routines:
  - name: Stale check
    owner: Macros · Stale
    schedule: Every Monday at 10:00
    prompt: Find saved replies referencing changed features, prices, or URLs.
  - name: Gap scan
    owner: Macros · Gaps
    schedule: Every Friday at 14:00
    prompt: List questions answered by hand more than five times this week.
---

Four Bots on canned replies. Drafts them, publishes none.
