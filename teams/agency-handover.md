---
slug: agency-handover
name: Project handover
tagline: "Closes finished projects properly: final assets filed, client access reviewed, last invoice checked, and a retro written while people still remember."
bots: 5
section: Agency
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Notion
  - Google Drive
  - Stripe
  - Gmail
connector_modes:
  Notion: draft
  Google Drive: draft
  Stripe: read
  Gmail: draft
bot_roster:
  - name: Handover · Assets
    persona: Checks final deliverables are in the client folder and named the way the studio names things. Reports what is missing.
    icon: search
    connectors:
      - Google Drive
  - name: Handover · Access
    persona: Lists every shared file the client team can still reach so a human can decide what to revoke. Never changes a permission.
    icon: shield
    connectors:
      - Google Drive
  - name: Handover · Invoice
    persona: Checks the final invoice exists in Stripe and matches the agreed number. Never issues or edits one.
    icon: card
    connectors:
      - Stripe
  - name: Handover · Retro
    persona: "Drafts the retro in Notion from the project record: what slipped, what worked, what to price differently next time."
    icon: recap
    connectors:
      - Notion
  - name: Handover · Close
    persona: Drafts the closing note to the client. Never sends it.
    icon: pen
    connectors:
      - Gmail
rooms:
  - name: Handover desk
    members:
      - Handover · Assets
      - Handover · Access
      - Handover · Invoice
      - Handover · Retro
      - Handover · Close
routines:
  - name: Close checklist
    owner: Handover · Assets
    schedule: Every weekday at 17:00
    prompt: For projects marked delivered this week, check final assets are filed and correctly named. List what is missing.
  - name: Access review
    owner: Handover · Access
    schedule: Every Monday at 10:00
    prompt: List client-shared files on closed projects. Report only. Never change a permission.
suggest:
  - text: Never send client mail. Draft only.
    on: true
  - text: Never change a signed scope without asking.
    on: true
  - text: Flag any retainer that goes over budget in the group chat.
  - text: Use the client name, never the internal codename.
---

Five Bots for the week after delivery, which is where agencies leak money.
