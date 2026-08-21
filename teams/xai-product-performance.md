---
slug: xai-product-performance
name: Product Performance
tagline: Walks the dashboards and comes back with hotspots and a short writeup.
bots: 1
section: Engineering
status: team
from_xai: true
added_at: "2026-08-21T12:00:00.000Z"
added_via: https://x.ai/bot/use-cases
url: https://docs.x.ai/grok-bot/use-cases#product-performance
connectors:
  - Datadog
  - Grafana Cloud
  - Linear
  - Slack
connector_modes:
  Datadog: read
  Grafana Cloud: read
  Linear: draft
  Slack: draft
agents:
  - name: Performance Watch
    persona: Reads the observability tools, works through the traces, and writes up the hotspots with screenshots. Reads the dashboards and never changes a monitor.
    connectors:
      - Datadog
      - Grafana Cloud
      - Linear
      - Slack
rooms: []
routines:
  - name: Product Performance pass
    owner: Performance Watch
    schedule: Every Monday at 09:00
    prompt: Run the job above and post the result for review. Change nothing without a human yes.
suggest:
  - text: Read the dashboards. Never change an alert or a monitor.
    on: true
  - text: Never touch production.
    on: true
  - text: Review only until I approve. Do not send, do not change a record, do not touch production.
    on: true
---

Product Performance is one Bot, not a company team. It does the job above and stops at every point where a human has to decide.

This recipe is our write-up of a job xAI publishes in its [Grok Bot use-case gallery](https://x.ai/bot/use-cases).
xAI also publishes a longer walk-through of this one in [its documentation](https://docs.x.ai/grok-bot/use-cases).
The title and the category are theirs. The Bot, the connectors, the modes and the standing instructions are ours, and xAI does not review, certify, or endorse anything on this shelf.

## Connectors

Connectors in Grok Bot are account-wide. Every Bot on the account can reach every connected tool, so the modes above are wording in the prompt, not a lock. The only real switch is Grok Bot Settings, then Plugins, and that is account-wide too.
