---
slug: knowledge-onboardingdocs
name: Onboarding docs
tagline: Keeps the documents a new joiner actually reads in their first week correct, because those are the ones that mislead.
bots: 4
section: Knowledge
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Notion
  - Glean
  - Google Drive
  - Slack
connector_modes:
  Notion: draft
  Glean: draft
  Google Drive: draft
  Slack: ask
bot_roster:
  - name: Docs · Firstweek
    persona: Lists the documents new joiners actually open in week one.
    icon: search
    connectors:
      - Glean
  - name: Docs · Wrong
    persona: Checks those documents against current reality and names what is wrong.
    icon: shield
    connectors:
      - Notion
  - name: Docs · Owner
    persona: Names an owner for every first-week document, or flags that it has none.
    icon: staff
    connectors:
      - Google Drive
  - name: Docs · Draft
    persona: Drafts the correction. Never publishes it.
    icon: pen
    connectors:
      - Slack
rooms:
  - name: Onboarding docs desk
    members:
      - Docs · Firstweek
      - Docs · Wrong
      - Docs · Owner
      - Docs · Draft
routines:
  - name: Accuracy pass
    owner: Docs · Wrong
    schedule: Every Monday at 10:00
    prompt: Check first-week documents against current reality. Name every wrong statement.
  - name: Owner check
    owner: Docs · Owner
    schedule: Every month on the 1st at 09:00
    prompt: List first-week documents with no owner.
suggest:
  - text: Never delete a page. Archive it and say so.
    on: true
  - text: Draft edits, never publish over someone.
    on: true
  - text: Link the source for every claim.
  - text: Flag a page nobody has touched in a year.
---

Four Bots on the documents that mislead new joiners.
