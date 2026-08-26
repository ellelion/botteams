---
slug: on-page-seo-fixer
name: On-page SEO fixer
tagline: Finds the decaying page, drafts titles, meta, and internal links, and opens a change for review. Never publishes.
bots: 1
section: Content
status: installable
kind: bot
added_at: "2026-08-23T12:00:00.000Z"
connectors:
  - Search Console
  - Webflow
  - GitHub
  - Notion
connector_modes:
  Search Console: read
  Webflow: draft
  GitHub: draft
  Notion: draft
bot_roster:
  - name: On-page fixer
    persona: Picks pages that lost traffic, drafts title and meta and a handful of internal links, and opens a draft change. Never publishes and never merges.
    connectors:
      - Search Console
      - Webflow
      - GitHub
      - Notion
rooms: []
routines:
  - name: Fixer pass
    owner: On-page fixer
    schedule: Every Tuesday at 10:00
    prompt: Pick the page that lost the most traffic over eight weeks. Draft title, meta, and internal links. Open a draft change. Do not publish.
suggest:
  - text: Never publish. Draft only.
    on: true
  - text: Never merge a pull request.
    on: true
  - text: Never claim a number you cannot source.
    on: true
---

On-page SEO fixer is one Bot. The SEO / AEO Auditor reports. This Bot drafts the on-page fix and stops.

A similar job exists on botdirectory.ai. Our prompt is original. MIT. Not affiliated with xAI.

## Connectors

Connectors in Grok Bot are account-wide. Modes above are wording in the prompt, not a lock.
