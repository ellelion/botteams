---
$schema: "https://botteams.ai/schema/team.schema.json"
slug: "customer-pulse-briefing-bot"
name: "Customer Pulse Briefing Bot"
tagline: "Reads Gmail and Slack every weekday at 09:00, drafts a Notion priority queue, and only replies after approval."
bots: 1
section: "Customer Success & Support"
status: "example"
kind: "bot"
added_at: "2026-08-26T03:29:02.961Z"
contributor: "Skillselion"
contributor_url: "https://x.com/Skillselion"
added_via: "https://x.com/Skillselion/status/2092454005825814685"
connectors:
  - "Gmail"
  - "Slack"
  - "Notion"
bot_roster:
  - name: "Customer Pulse Briefing Bot"
    persona: "Aggregates customer signals from Gmail and Slack, drafts a Notion priority queue, and routes messages for approval."
    connectors:
      - "Gmail"
      - "Slack"
      - "Notion"
rooms: []
routines:
  - name: "Weekday Pulse Briefing"
    owner: "Customer Pulse Briefing Bot"
    schedule: "Weekdays 09:00"
    prompt: "Read Gmail and Slack messages, draft a Notion priority queue, and do not send replies without explicit approval."
---

Customer Pulse Briefing Bot runs every weekday at 09:00. It reads Gmail and Slack, drafts a Notion priority queue, and never sends replies without approval.

This is an example drafted from the linked public X post. It has not been run end to end. Review it before changing the status to installable.
