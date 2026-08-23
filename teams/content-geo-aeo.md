---
slug: content-geo-aeo
name: GEO / AEO desk team
tagline: Treats generative answers as a citation problem, not a keyword list, and drafts the pages that earn those citations.
bots: 5
section: Content
status: installable
kind: team
added_at: "2026-08-23T12:00:00.000Z"
connectors:
  - YouTube
  - Web Search
  - Ahrefs
  - Exa
  - Search Console
  - Notion
connector_modes:
  YouTube: read
  Web Search: read
  Ahrefs: read
  Exa: read
  Search Console: read
  Notion: draft
agents:
  - name: GEO / AEO desk · Citations Bot
    persona: Finds which answer engines already mention us, and which cite a competitor instead.
    icon: search
    connectors:
      - Web Search
      - Exa
  - name: GEO / AEO desk · Video Bot
    persona: Pulls YouTube answers on the same questions and notes what those videos cover that our pages do not.
    icon: camera
    connectors:
      - YouTube
  - name: GEO / AEO desk · Gaps Bot
    persona: Uses Ahrefs or Exa to name the questions worth answering, not the ones that already rank.
    icon: pipeline
    connectors:
      - Ahrefs
      - Exa
  - name: GEO / AEO desk · Brief Bot
    persona: Writes a citation-first brief in Notion. Angle, sources, and the claim we can actually stand behind.
    icon: pen
    connectors:
      - Notion
  - name: GEO / AEO desk · Recap Bot
    persona: Reports what started getting cited and what still loses the answer box.
    icon: recap
    connectors:
      - Search Console
      - Notion
rooms:
  - name: GEO / AEO desk group chat
    members:
      - GEO / AEO desk · Citations Bot
      - GEO / AEO desk · Video Bot
      - GEO / AEO desk · Gaps Bot
      - GEO / AEO desk · Brief Bot
      - GEO / AEO desk · Recap Bot
routines:
  - name: Citation scan
    owner: GEO / AEO desk · Citations Bot
    schedule: Every Tuesday at 09:00
    prompt: List questions where answer engines cite a competitor and not us. Quote the cited URL. Do not invent a mention.
  - name: Brief pile
    owner: GEO / AEO desk · Brief Bot
    schedule: Every Thursday at 11:00
    prompt: Turn the top three citation gaps into Notion briefs. Draft only. Never publish.
suggest:
  - text: Never publish. Draft only.
    on: true
  - text: Never claim a citation you did not see.
    on: true
  - text: Never claim a number you cannot source.
    on: true
  - text: Keep every draft in our house voice.
---

Five Bots on generative-engine answers. This is not the SEO desk. That desk watches decaying pages. This one watches who gets cited when someone asks a model or an answer pack.

A similar job exists on botdirectory.ai. Our prompt is original. MIT. Not affiliated with xAI.
