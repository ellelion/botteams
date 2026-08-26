---
slug: marketing-social-studio
name: Social studio
tagline: Turns one ship into a short-form queue for YouTube, TikTok, Instagram, and Threads, then parks it for a human to post.
bots: 5
section: Marketing
status: installable
kind: team
added_at: "2026-08-23T12:00:00.000Z"
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
bot_roster:
  - name: Social · Source
    persona: Finds what shipped that is actually worth a clip. Ignores filler.
    icon: search
    connectors:
      - Notion
      - YouTube
  - name: Social · Shorts
    persona: Drafts short-form scripts and cut lists. Never uploads.
    icon: camera
    connectors:
      - YouTube
      - TikTok
  - name: Social · Stills
    persona: Drafts carousel and still copy for Instagram and Threads in house voice.
    icon: pen
    connectors:
      - Instagram
      - Threads
      - Notion
  - name: Social · Queue
    persona: Parks approved drafts in Postiz. Never publishes.
    icon: calendar
    connectors:
      - Postiz
  - name: Social · Recap
    persona: Reports what is queued, what is waiting on a human, and what already posted.
    icon: recap
    connectors:
      - Postiz
      - Notion
rooms:
  - name: Social studio
    members:
      - Social · Source
      - Social · Shorts
      - Social · Stills
      - Social · Queue
      - Social · Recap
routines:
  - name: Source pass
    owner: Social · Source
    schedule: Every weekday at 09:30
    prompt: List ships from the last day worth a clip. Skip anything without a fact a viewer can check.
  - name: Queue pass
    owner: Social · Queue
    schedule: Every weekday at 16:00
    prompt: Park approved drafts in the queue. Do not publish.
suggest:
  - text: Never post. Draft and queue only.
    on: true
  - text: Never reply as the brand.
    on: true
  - text: Keep every draft in our house voice.
---

Five Bots as a short-form studio. Distinct from the single Social Media Manager Bot, which drafts when something noteworthy ships. This desk owns the weekly queue.

A similar job exists on botdirectory.ai. Our prompt is original. MIT. Not affiliated with xAI.
