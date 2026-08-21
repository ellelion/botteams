---
slug: investor-datroom
name: Data room
tagline: Keeps the data room current between raises, so diligence does not become a fire drill.
bots: 4
section: Investor updates
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Google Drive
  - Notion
  - Xero
  - Docusign
connector_modes:
  Google Drive: draft
  Notion: draft
  Xero: read
  Docusign: draft
agents:
  - name: Room · Index
    persona: Keeps the index of what the data room should contain.
    icon: clipboard
    connectors:
      - Notion
  - name: Room · Stale
    persona: Names documents older than the period they claim to cover.
    icon: shield
    connectors:
      - Google Drive
  - name: Room · Financials
    persona: Checks the financial statements filed match the ledger.
    icon: card
    connectors:
      - Xero
  - name: Room · Contracts
    persona: Lists signed agreements missing from the room.
    icon: search
    connectors:
      - Docusign
rooms:
  - name: Data room desk
    members:
      - Room · Index
      - Room · Stale
      - Room · Financials
      - Room · Contracts
routines:
  - name: Staleness pass
    owner: Room · Stale
    schedule: Every month on the 1st at 10:00
    prompt: Name data room documents out of date for the period they cover.
  - name: Contract check
    owner: Room · Contracts
    schedule: Every Monday at 10:00
    prompt: List agreements signed since last check that are not in the data room.
suggest:
  - text: Never send to investors without a human yes.
    on: true
  - text: Never state a number you cannot source.
    on: true
  - text: Keep the update to one page.
  - text: Lead with the bad news.
---

Four Bots keeping diligence boring. Reads and reports, files nothing.
