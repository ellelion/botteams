---
slug: xai-docs-auditor
name: Docs Auditor
tagline: Finds the docs that stopped being true and drafts the rewrite.
bots: 1
section: Product
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - Notion
  - GitHub
  - Linear
  - Mintlify
connector_modes:
  Notion: draft
  GitHub: draft
  Linear: draft
  Mintlify: draft
agents:
  - name: Docs Auditor
    persona: Diffs the help centre and internal notes against what actually shipped, flags stale pages, and drafts the fix. Never publishes and never deletes a page.
    connectors:
      - Notion
      - GitHub
      - Linear
      - Mintlify
rooms: []
routines:
  - name: Docs Auditor pass
    owner: Docs Auditor
    schedule: Every Monday at 09:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never publish a doc change. Draft the rewrite.
    on: true
  - text: Never delete a page. Archive it and say so.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Docs Auditor is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
