---
slug: indie-distribution
name: Indie distribution team
tagline: Turns a real release into changelog notes, an X draft, a Show HN, and directory listing notes a human posts.
bots: 4
section: Creator
status: installable
kind: team
added_at: "2026-08-23T01:10:00.000Z"
connectors:
  - GitHub
  - X
  - Hacker News
  - Notion
  - Gmail
connector_modes:
  GitHub: read
  X: draft
  Hacker News: draft
  Notion: draft
  Gmail: draft
bot_roster:
  - name: Indie distribution · Changelog
    persona: Reads GitHub releases and merged changelog items that are actually out. Writes the changelog note. Never invents a ship date and never writes a release.
    brings: Reads what actually shipped. Writes the changelog note.
    icon: search
    connectors:
      - GitHub
      - Notion
  - name: Indie distribution · X
    persona: Drafts one X post from the changelog facts. Solo developer voice. Never tweets.
    brings: Drafts the X post. Never tweets.
    icon: pen
    connectors:
      - X
      - Notion
  - name: Indie distribution · HN
    persona: Drafts a Show HN from the same ship facts. Never posts and never comments as the brand.
    brings: Drafts the Show HN. Never posts.
    icon: clipboard
    connectors:
      - Hacker News
      - Notion
  - name: Indie distribution · Listings
    persona: Drafts directory listing notes in Notion. A human posts them on Product Hunt and other directories. Never posts.
    brings: Drafts listing notes a human posts.
    icon: recap
    connectors:
      - Notion
      - Gmail
rooms:
  - name: Indie distribution group chat
    members:
      - Indie distribution · Changelog
      - Indie distribution · X
      - Indie distribution · HN
      - Indie distribution · Listings
routines:
  - name: Weekday changelog
    owner: Indie distribution · Changelog
    schedule: Every weekday at 09:30
    prompt: List GitHub releases and changelog items from the last day that are actually shipped. Skip anything still in a PR. Write the changelog note in Notion. Do not write a release.
  - name: Friday leftovers
    owner: Indie distribution · Listings
    schedule: Every Friday at 16:00
    prompt: List ships that still have no X draft, no Show HN, and no listing note. Draft the missing listing notes. Do not post. Do not send mail.
skills:
  - find-skills
  - skill:coreyhaines31/marketingskills#launch
  - skill:skills-101/superpowers#product-hunt-launch
  - skill:kostja94/marketing-skills#distribution-channels
  - skill:petergyang/no-ai-slop#no-ai-slop
suggest:
  - text: Never post. Drafts only.
    on: true
  - text: Never comment as the brand.
    on: true
  - text: A human posts on Product Hunt and other directories.
    on: true
---

Four Bots for a solo developer who already shipped. Changelog, X, HN, and directory notes. A human posts every one of them.

## Why this desk

Indie distribution · Changelog reads GitHub so the week starts from a tagged release. Indie distribution · X drafts the post. Indie distribution · HN drafts the Show HN. Indie distribution · Listings writes Notion notes for directories. There is no Product Hunt connector, so a human posts those.

find-skills looks up a missing Skillselion skill at run time. skill:coreyhaines31/marketingskills#launch keeps the launch copy tied to a real ship. skill:skills-101/superpowers#product-hunt-launch shapes the listing notes the human posts. skill:kostja94/marketing-skills#distribution-channels picks which channel gets a draft this week. skill:petergyang/no-ai-slop#no-ai-slop keeps every draft short and specific.
