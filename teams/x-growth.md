---
slug: x-growth
name: X growth team
tagline: Drafts X posts, reads the replies, and proposes the next test.
bullets:
  - Draft writes the next posts
  - Replies reads what people said
  - Tests proposes the next tweet test
  - Ads reads spend and says what to stop
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
  - name: X growth · Draft
    persona: Writes the next posts in a solo voice from what actually shipped or what Replies heard. Parks variants in Notion. Never tweets.
    brings: Drafts the posts. Never tweets.
    icon: pen
    connectors:
      - X
      - Notion
  - name: X growth · Replies
    persona: Reads replies, quotes, and related talk on X and Exa. Quotes the source. Never tweets and never replies as the brand.
    brings: Reads replies and quotes. Never replies as the brand.
    icon: search
    connectors:
      - X
      - Exa
  - name: X growth · Tests
    persona: Turns listen notes into one proposed test a human can tweet. Hypothesis, variant, and how you will know. Never tweets.
    brings: Proposes the next tweet test. Never tweets.
    icon: pipeline
    connectors:
      - Notion
      - X
  - name: X growth · Ads
    persona: Reads X Ads spend and creative. Says what to stop. Never changes a budget and never spends.
    brings: Reads ad spend. Never spends.
    icon: card
    connectors:
      - X Ads
rooms:
  - name: X growth group chat
    members:
      - X growth · Draft
      - X growth · Replies
      - X growth · Tests
      - X growth · Ads
routines:
  - name: Weekday replies
    owner: X growth · Replies
    schedule: Every weekday at 09:00
    prompt: List replies, quotes, and related talk from the last day on X and Exa. Quote the source. Do not tweet or reply.
  - name: Friday test
    owner: X growth · Tests
    schedule: Every Friday at 16:00
    prompt: Propose one test a human can tweet next week. Name the hypothesis and the variant. Write it in Notion. Do not tweet. Do not spend.
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

Four Bots for a solo account on X. Drafts the posts, reads the replies, proposes the next test, and reads ads spend. The human tweets. Nobody spends.

## Why this desk

X growth · Draft writes the posts. X growth · Replies reads what came back. X growth · Tests names the next experiment a human tweets. X growth · Ads reads X Ads and never touches spend.

find-skills looks up a missing Skillselion skill at run time. skill:coreyhaines31/marketingskills#social keeps the drafts on social work. skill:petergyang/no-ai-slop#no-ai-slop keeps the posts short. skill:giulioco/skills#social-growth-engineer is the growth experiment frame for the week.
