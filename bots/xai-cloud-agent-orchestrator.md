---
slug: xai-cloud-agent-orchestrator
name: Cloud Agent Orchestrator
tagline: Keeps many agent runs moving and reports only what is stuck.
bots: 1
section: Engineering
status: installable
kind: bot
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
connectors:
  - GitHub
  - Cursor Cloud Agents
  - Slack
  - Linear
connector_modes:
  GitHub: draft
  Cursor Cloud Agents: read
  Slack: draft
  Linear: draft
agents:
  - name: Run Orchestrator
    persona: Starts the runs, watches them, chases the ones that stall, and writes one summary at the end. Never merges and never touches production.
    connectors:
      - GitHub
      - Cursor Cloud Agents
      - Slack
      - Linear
rooms: []
routines:
  - name: Cloud Agent Orchestrator pass
    owner: Run Orchestrator
    schedule: Every weekday at 09:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Never merge or deploy.
    on: true
  - text: Never touch production.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Cloud Agent Orchestrator is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this directory.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
