---
slug: social-growth
name: Social growth team
tagline: Picks audience tests across YouTube, Instagram, TikTok, and Threads, then reports what moved followers and what to stop.
bots: 4
section: Marketing
status: installable
kind: team
added_at: "2026-08-23T01:11:00.000Z"
connectors:
  - YouTube
  - TikTok
  - Instagram
  - Threads
  - Postiz
  - Notion
connector_modes:
  YouTube: read
  TikTok: read
  Instagram: read
  Threads: read
  Postiz: draft
  Notion: draft
agents:
  - name: Social growth · Audience
    persona: Reads follower and view movement on YouTube, Instagram, TikTok, and Threads. Quotes the tool. Never invents a count.
    icon: search
    connectors:
      - YouTube
      - TikTok
      - Instagram
      - Threads
  - name: Social growth · Experiments
    persona: Drafts one test at a time into Notion and parks the copy in Postiz. Never publishes.
    icon: clipboard
    connectors:
      - Notion
      - Postiz
  - name: Social growth · Voice
    persona: Rewrites test copy in house voice. Cuts filler. Never publishes.
    icon: pen
    connectors:
      - Notion
      - Postiz
  - name: Social growth · Recap
    persona: Reports what moved followers, what did not, and what to stop. Drafts only.
    icon: recap
    connectors:
      - Notion
      - YouTube
      - TikTok
      - Instagram
      - Threads
rooms:
  - name: Social growth group chat
    members:
      - Social growth · Audience
      - Social growth · Experiments
      - Social growth · Voice
      - Social growth · Recap
routines:
  - name: Monday experiment pick
    owner: Social growth · Experiments
    schedule: Every Monday at 10:00
    prompt: Pick one audience test for the week from last week's recap. Write the hypothesis in Notion and park the draft in Postiz. Do not publish.
  - name: Friday growth recap
    owner: Social growth · Recap
    schedule: Every Friday at 16:00
    prompt: Report what moved followers and what to stop. Quote the tool. Draft only. Do not publish.
skills:
  - find-skills
  - skill:coreyhaines31/marketingskills#social
  - skill:blacktwist/social-media-skills#audience-growth-tracker-sms
  - skill:petergyang/no-ai-slop#no-ai-slop
  - skill:yetone/kill-ai-slop#kill-ai-slop
suggest:
  - text: Never publish. Drafts only.
    on: true
  - text: Never reply as the brand.
    on: true
  - text: Never invent a follower count. Quote the tool.
    on: true
---

Four Bots on audience growth. Social studio owns the weekly short-form queue. This desk owns what to test, what moved followers, and what to stop. A human posts.

## Why this desk

Social growth · Audience reads YouTube, TikTok, Instagram, and Threads so the week starts from real movement. Social growth · Experiments writes the next test in Notion and parks the draft in Postiz without publishing. Social growth · Voice rewrites that draft in Notion and Postiz so the test still sounds like the house. Social growth · Recap rereads the four platforms and writes the Friday stop-or-keep note in Notion.

find-skills looks up a missing Skillselion skill at run time. skill:coreyhaines31/marketingskills#social keeps the test on social, not a launch email. skill:blacktwist/social-media-skills#audience-growth-tracker-sms is the follower tracker this recap quotes. skill:petergyang/no-ai-slop#no-ai-slop and skill:yetone/kill-ai-slop#kill-ai-slop cut filler from every draft.
