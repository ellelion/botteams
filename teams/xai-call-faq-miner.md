---
slug: xai-call-faq-miner
name: Call FAQ Miner
tagline: Turns the questions people actually ask on calls into answers with a timestamp and a source.
bots: 1
section: Product
status: team
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Gong
  - Notion
  - Zoom
connector_modes:
  Gong: read
  Notion: draft
  Zoom: read
agents:
  - name: FAQ Miner
    persona: Reads call transcripts for repeated questions, writes the answer, and links back to the moment in the recording. Drafts docs, never publishes them.
    connectors:
      - Gong
      - Notion
      - Zoom
rooms: []
routines:
  - name: Call FAQ Miner pass
    owner: FAQ Miner
    schedule: Every Friday at 15:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never publish a doc change. Draft the rewrite.
    on: true
  - text: Never message a customer directly.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Call FAQ Miner is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this shelf.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
