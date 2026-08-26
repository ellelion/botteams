---
slug: creator-launch
name: Product launch
tagline: "Runs a creator product launch: the sequence drafted, the page checked, and the first week reported without flattery."
bots: 4
section: Creator
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Gmail
  - Stripe
  - Notion
  - Webflow
connector_modes:
  Gmail: draft
  Stripe: read
  Notion: draft
  Webflow: draft
bot_roster:
  - name: Launch · Sequence
    persona: Drafts the launch email sequence with the actual dates. Never sends.
    icon: pen
    connectors:
      - Gmail
  - name: Launch · Page
    persona: Checks the sales page for broken links, wrong prices, and claims nothing supports.
    icon: shield
    connectors:
      - Webflow
  - name: Launch · Sales
    persona: Reports sales and refunds from Stripe against the plan, daily.
    icon: card
    connectors:
      - Stripe
  - name: Launch · Retro
    persona: Writes the honest retro, including what did not sell.
    icon: recap
    connectors:
      - Notion
rooms:
  - name: Launch room
    members:
      - Launch · Sequence
      - Launch · Page
      - Launch · Sales
      - Launch · Retro
routines:
  - name: Page check
    owner: Launch · Page
    schedule: Every weekday at 09:00
    prompt: Check the live sales page for broken links, wrong prices, and unsupported claims.
  - name: Daily sales
    owner: Launch · Sales
    schedule: Every day at 18:00
    prompt: Report today's sales and refunds against plan. Never issue a refund.
suggest:
  - text: Never publish or schedule without a human yes.
    on: true
  - text: Never reply as me in public.
    on: true
  - text: Keep captions under the platform limit.
  - text: Tell me which idea you dropped and why.
---

Four Bots around a launch. Drafts, checks, reports. Never sends or refunds.
