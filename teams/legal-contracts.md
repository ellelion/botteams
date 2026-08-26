---
slug: legal-contracts
name: Contract register
tagline: Keeps one list of what the company signed, what it committed to, and when each obligation lands.
bots: 4
section: Legal
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Docusign
  - Notion
  - Google Drive
  - Calendar
connector_modes:
  Docusign: draft
  Notion: draft
  Google Drive: draft
  Calendar: draft
bot_roster:
  - name: Contract · Register
    persona: Keeps the register of signed agreements and their key terms.
    icon: clipboard
    connectors:
      - Docusign
  - name: Contract · Obligations
    persona: Extracts what the company must actually do, with dates.
    icon: search
    connectors:
      - Notion
  - name: Contract · Dates
    persona: Holds renewal and notice dates and warns before a notice window closes.
    icon: calendar
    connectors:
      - Calendar
  - name: Contract · Store
    persona: Checks the executed copy is filed where it should be.
    icon: shield
    connectors:
      - Google Drive
rooms:
  - name: Contract desk
    members:
      - Contract · Register
      - Contract · Obligations
      - Contract · Dates
      - Contract · Store
routines:
  - name: Notice windows
    owner: Contract · Dates
    schedule: Every Monday at 09:00
    prompt: Name contracts whose notice window opens or closes in the next sixty days.
  - name: Obligation pass
    owner: Contract · Obligations
    schedule: Every month on the 1st at 10:00
    prompt: List obligations falling due this month and who owns each.
suggest:
  - text: Never sign or send anything.
    on: true
  - text: Say clearly that this is not legal advice.
    on: true
  - text: Quote the clause, do not paraphrase it.
  - text: Flag any auto-renew inside 60 days.
---

Four Bots on signed agreements. Tracks obligations, signs nothing.
