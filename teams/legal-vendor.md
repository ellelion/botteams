---
slug: legal-vendor
name: Vendor review
tagline: Reviews what the company is about to sign, and flags the terms that matter before signature rather than after.
bots: 4
section: Legal
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Docusign
  - Notion
  - Ramp
  - Gmail
connector_modes:
  Docusign: draft
  Notion: draft
  Ramp: read
  Gmail: draft
bot_roster:
  - name: Vendor · Intake
    persona: Records incoming agreements and what they are for.
    icon: inbox
    connectors:
      - Gmail
  - name: Vendor · Terms
    persona: Flags auto-renewal, liability, and termination terms worth a human read.
    icon: shield
    connectors:
      - Notion
  - name: Vendor · Spend
    persona: Checks the committed spend against what was budgeted.
    icon: card
    connectors:
      - Ramp
  - name: Vendor · Status
    persona: Tracks what is out for signature and what is stuck.
    icon: clipboard
    connectors:
      - Docusign
rooms:
  - name: Vendor desk
    members:
      - Vendor · Intake
      - Vendor · Terms
      - Vendor · Spend
      - Vendor · Status
routines:
  - name: Terms flag
    owner: Vendor · Terms
    schedule: Every weekday at 10:00
    prompt: For agreements received since yesterday, flag auto-renewal, liability, and termination terms.
  - name: Stuck check
    owner: Vendor · Status
    schedule: Every Monday at 09:30
    prompt: List agreements out for signature more than a week.
suggest:
  - text: Never sign or send anything.
    on: true
  - text: Say clearly that this is not legal advice.
    on: true
  - text: Quote the clause, do not paraphrase it.
  - text: Flag any auto-renew inside 60 days.
---

Four Bots reading vendor paper. Flags terms, approves nothing.
