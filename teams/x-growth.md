---
slug: x-growth
name: X growth team
tagline: Drafts X posts, reads replies and quotes, and proposes tests a human tweets.
bots: 4
section: Marketing
status: installable
kind: team
added_at: "2026-08-23T01:12:00.000Z"
connectors:
  - X
  - X Ads
  - Exa
  - Notion
connector_modes:
  X: draft
  X Ads: read
  Exa: read
  Notion: draft
bot_roster:
  - name: X growth · Listen
    persona: Reads replies, quotes, and related talk on X and Exa. Never tweets and never replies as the brand.
    icon: search
    connectors:
      - X
      - Exa
  - name: X growth · Draft
    persona: Drafts posts from what Listen heard. House voice. Never tweets.
    icon: pen
    connectors:
      - X
      - Notion
  - name: X growth · Ads
    persona: Reads X Ads spend and creative. Recommends a test. Never changes a budget and never spends.
    icon: card
    connectors:
      - X Ads
  - name: X growth · Recap
    persona: Writes the week recap in Notion. What to post, what to stop, what the ads read said. Drafts only.
    icon: recap
    connectors:
      - Notion
rooms:
  - name: X growth group chat
    members:
      - X growth · Listen
      - X growth · Draft
      - X growth · Ads
      - X growth · Recap
routines:
  - name: Weekday listen
    owner: X growth · Listen
    schedule: Every weekday at 09:00
    prompt: List replies, quotes, and related talk from the last day on X and Exa. Quote the source. Do not tweet or reply.
  - name: Friday recap
    owner: X growth · Recap
    schedule: Every Friday at 16:00
    prompt: Recap drafts waiting, listen notes, and the ads read. Write it in Notion. Do not tweet. Do not spend.
skills:
  - find-skills
  - skill:coreyhaines31/marketingskills#social
  - skill:petergyang/no-ai-slop#no-ai-slop
  - skill:giulioco/skills#social-growth-engineer
suggest:
  - text: Never tweet. Drafts only.
    on: true
  - text: Never spend ad money. Read only.
    on: true
  - text: Never reply as the brand.
    on: true
---

Four Bots on X.com only. Drafts, listen notes, and an ads read. The human tweets. Nobody spends.

## Why this desk

X growth · Listen reads X and Exa so the week starts from replies and quotes, not a blank prompt. X growth · Draft writes posts on X and parks variants in Notion. X growth · Ads reads X Ads and never touches spend. X growth · Recap writes the Friday note in Notion.

find-skills looks up a missing Skillselion skill at run time. skill:coreyhaines31/marketingskills#social keeps the drafts on social work. skill:petergyang/no-ai-slop#no-ai-slop keeps the posts short. skill:giulioco/skills#social-growth-engineer is the growth experiment frame for the week.
