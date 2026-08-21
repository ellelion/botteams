---
slug: xai-account-manager
name: Account Manager
tagline: Rebuilds the context for every account call so nobody walks in cold, and leaves the follow-up drafted.
bots: 1
section: Customer Success & Support
status: team
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Salesforce
  - Gmail
  - Calendar
  - Gong
  - Slack
connector_modes:
  Salesforce: read
  Gmail: draft
  Calendar: draft
  Gong: read
  Slack: draft
agents:
  - name: Account Desk
    persona: Pulls transcripts, notes, CRM and chat into a prep sheet before each call, then drafts the follow-up and the next steps afterwards. Proposes CRM edits, never makes them.
    connectors:
      - Salesforce
      - Gmail
      - Calendar
      - Gong
      - Slack
rooms: []
routines: []
suggest:
  - text: Never email a customer without a human yes.
    on: true
  - text: Never change the CRM. Propose the edit and wait.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Account Manager is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this shelf.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
