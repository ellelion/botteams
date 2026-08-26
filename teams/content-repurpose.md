---
slug: content-repurpose
name: Repurpose desk
tagline: Turns one long piece into the shorter pieces it should have become, in the register each channel actually uses.
bots: 4
section: Content
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Notion
  - X
  - LinkedIn
  - Canva
connector_modes:
  Notion: draft
  X: ask
  LinkedIn: ask
  Canva: draft
bot_roster:
  - name: Repurpose · Source
    persona: Reads a published long piece and pulls out the three ideas that stand alone.
    icon: search
    connectors:
      - Notion
  - name: Repurpose · Social
    persona: Drafts the short versions for X and LinkedIn separately, because the registers are not the same. Never posts.
    icon: pen
    connectors:
      - X
      - LinkedIn
  - name: Repurpose · Visual
    persona: Lists the one chart or quote card each piece needs and drafts the brief for it.
    icon: camera
    connectors:
      - Canva
  - name: Repurpose · Queue
    persona: Keeps the queue of what is drafted, what is approved, and what has gone out.
    icon: clipboard
    connectors:
      - Notion
rooms:
  - name: Repurpose desk
    members:
      - Repurpose · Source
      - Repurpose · Social
      - Repurpose · Visual
      - Repurpose · Queue
routines:
  - name: Source pass
    owner: Repurpose · Source
    schedule: Every Monday at 10:00
    prompt: For anything published last week, pull the three ideas that stand alone without the article.
  - name: Draft pass
    owner: Repurpose · Social
    schedule: Every Tuesday at 10:00
    prompt: Draft the short versions for each channel in that channel's register. Never post.
suggest:
  - text: Never publish. Draft only.
    on: true
  - text: Never claim a number you cannot source.
    on: true
  - text: Keep every draft in our house voice.
  - text: Flag anything that reads like a legal claim.
---

Four Bots getting more out of what is already written. Drafts only.
