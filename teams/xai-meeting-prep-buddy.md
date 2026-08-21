---
slug: xai-meeting-prep-buddy
name: Meeting Prep Buddy
tagline: Builds the prep sheet so nobody walks into a meeting cold.
bots: 1
section: Sales
status: team
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Calendar
  - Salesforce
  - Gong
  - Slack
  - Gmail
connector_modes:
  Calendar: draft
  Salesforce: read
  Gong: read
  Slack: draft
  Gmail: draft
agents:
  - name: Meeting Prep
    persona: Assembles who is in the room, the last touch, open threads and a suggested agenda from calendar, CRM, calls and chat. Never mails anyone.
    connectors:
      - Calendar
      - Salesforce
      - Gong
      - Slack
      - Gmail
rooms: []
routines:
  - name: Meeting Prep Buddy pass
    owner: Meeting Prep
    schedule: Every weekday at 07:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never email a prospect. Draft only.
    on: true
  - text: Never change the CRM. Propose the edit and wait.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Meeting Prep Buddy is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this shelf.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
