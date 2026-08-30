---
slug: content-rank-desk
name: Rank desk
tagline: Reads Search Console and DataForSEO once a week, names what moved, and writes the next fix instead of another dashboard.
bots: 4
section: Content
status: installable
kind: team
added_at: "2026-08-23T12:00:00.000Z"
connectors:
  - Search Console
  - DataForSEO
  - Notion
  - Gmail
connector_modes:
  Search Console: read
  DataForSEO: read
  Notion: draft
  Gmail: draft
bot_roster:
  - name: Rank · Queries
    persona: Reads Search Console for queries that gained or lost impressions, not vanity keywords.
    icon: search
    connectors:
      - Search Console
  - name: Rank · Positions
    persona: Pulls DataForSEO ranks for the watched set and flags jumps of three or more.
    icon: pipeline
    connectors:
      - DataForSEO
  - name: Rank · Plan
    persona: Turns the movement into a one-page Notion plan. What to fix first, and why.
    icon: pen
    connectors:
      - Notion
  - name: Rank · Recap
    persona: Drafts the weekly mail. Movement, plan, and what still needs a human yes.
    icon: recap
    connectors:
      - Gmail
rooms:
  - name: Rank desk group chat
    members:
      - Rank · Queries
      - Rank · Positions
      - Rank · Plan
      - Rank · Recap
routines:
  - name: Weekly ranks
    owner: Rank · Positions
    schedule: Every Monday at 08:30
    prompt: Pull the watched keyword set. Report positions that moved three or more. Quote the tool. Invent nothing.
  - name: Recap mail
    owner: Rank · Recap
    schedule: Every Monday at 16:00
    prompt: Draft the weekly rank recap. Do not send.
suggest:
  - text: Never change the site. Write the plan.
    on: true
  - text: Never claim a number you cannot source.
    on: true
  - text: Never send mail. Draft only.
    on: true
---

Four Bots that own the Search Console plus DataForSEO loop. The SEO / AEO Auditor Bot reports. This team turns the same numbers into a weekly plan.

A similar job exists on botdirectory.ai. Our prompt is original. MIT. Not affiliated with xAI.
