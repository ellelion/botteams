---
slug: content-newsletter
name: Newsletter desk
tagline: "Keeps a newsletter shipping on schedule: the issue assembled, links checked, and the retro written against what people actually opened."
bots: 4
section: Content
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Notion
  - Gmail
  - Webflow
  - Calendar
connector_modes:
  Notion: draft
  Gmail: draft
  Webflow: draft
  Calendar: draft
agents:
  - name: Newsletter · Assemble
    persona: Builds the issue from the queue and says what is still missing.
    icon: clipboard
    connectors:
      - Notion
  - name: Newsletter · Check
    persona: Checks every link resolves and every name is spelled the way that person spells it.
    icon: shield
    connectors:
      - Webflow
  - name: Newsletter · Schedule
    persona: Holds the send date and names what has to be done by when.
    icon: calendar
    connectors:
      - Calendar
  - name: Newsletter · Retro
    persona: Reports what was opened and clicked against what was predicted, and says where the prediction was wrong.
    icon: recap
    connectors:
      - Gmail
rooms:
  - name: Newsletter desk
    members:
      - Newsletter · Assemble
      - Newsletter · Check
      - Newsletter · Schedule
      - Newsletter · Retro
routines:
  - name: Assembly check
    owner: Newsletter · Assemble
    schedule: Every Tuesday at 10:00
    prompt: Assemble this week's issue from the queue. List what is missing and who owns it.
  - name: Pre-send check
    owner: Newsletter · Check
    schedule: Every Thursday at 09:00
    prompt: Check every link and every name in the assembled issue. Never send it.
suggest:
  - text: Never publish. Draft only.
    on: true
  - text: Never claim a number you cannot source.
    on: true
  - text: Keep every draft in our house voice.
  - text: Flag anything that reads like a legal claim.
---

Four Bots on a recurring newsletter. Assembles and checks, never sends.
