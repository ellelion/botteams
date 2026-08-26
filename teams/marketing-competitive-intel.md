---
slug: marketing-competitive-intel
name: Competitive intel watch
tagline: Watches competitor sites, ads, and prices as they change, and writes a brief that separates shipped from announced.
bots: 5
section: Marketing
status: installable
kind: team
added_at: "2026-08-23T12:00:00.000Z"
connectors:
  - Exa
  - Firecrawl
  - ScreenshotOne
  - X Ads
  - Notion
connector_modes:
  Exa: read
  Firecrawl: read
  ScreenshotOne: read
  X Ads: read
  Notion: draft
bot_roster:
  - name: Intel · Site
    persona: Diffs competitor product pages. Ignores the blog.
    icon: search
    connectors:
      - Firecrawl
      - ScreenshotOne
  - name: Intel · Ads
    persona: Notes competitor ads that appeared or vanished. Quotes the creative, invents no spend.
    icon: camera
    connectors:
      - X Ads
      - Exa
  - name: Intel · Price
    persona: Records public price and plan changes with a date.
    icon: card
    connectors:
      - Firecrawl
  - name: Intel · Brief
    persona: Writes the Notion brief. Shipped versus announced. Confidence stated.
    icon: pen
    connectors:
      - Notion
  - name: Intel · Recap
    persona: Weekly recap of what actually moved.
    icon: recap
    connectors:
      - Notion
rooms:
  - name: Intel watch
    members:
      - Intel · Site
      - Intel · Ads
      - Intel · Price
      - Intel · Brief
      - Intel · Recap
routines:
  - name: Surface pass
    owner: Intel · Site
    schedule: Every Monday at 09:00
    prompt: Report real changes to watched competitor pages. Attach or describe the screenshot. Ignore announcements.
  - name: Weekly brief
    owner: Intel · Brief
    schedule: Every Friday at 15:00
    prompt: Write the brief. Separate shipped from announced. Say how confident you are.
suggest:
  - text: Never cite a source you did not read.
    on: true
  - text: Read and summarise. Never write to a competitor surface.
    on: true
  - text: Say how confident you are, and why.
---

Five Bots. Distinct from Competitive watch under Research, which tracks shipping versus announcing in public posts. This desk adds ads, prices, and screenshots for marketing.

A similar job exists on botdirectory.ai. Our prompt is original. MIT. Not affiliated with xAI.
