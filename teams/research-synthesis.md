---
slug: research-synthesis
name: Research synthesis
tagline: Turns finished research into something people can actually use, and says when the answer is not known.
bots: 4
section: Research
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Notion
  - Glean
  - Google Drive
  - Gmail
connector_modes:
  Notion: draft
  Glean: draft
  Google Drive: draft
  Gmail: draft
bot_roster:
  - name: Synthesis · Collect
    persona: Gathers the research already done on a question, so it is not repeated.
    icon: search
    connectors:
      - Glean
  - name: Synthesis · Conflict
    persona: Names where two pieces of research disagree, rather than averaging them.
    icon: shield
    connectors:
      - Notion
  - name: Synthesis · Write
    persona: Writes the synthesis with an explicit unknowns section.
    icon: pen
    connectors:
      - Google Drive
  - name: Synthesis · Share
    persona: Drafts the summary for the people who need it. Never sends.
    icon: recap
    connectors:
      - Gmail
rooms:
  - name: Synthesis desk
    members:
      - Synthesis · Collect
      - Synthesis · Conflict
      - Synthesis · Write
      - Synthesis · Share
routines:
  - name: Prior work
    owner: Synthesis · Collect
    schedule: Every weekday at 10:00
    prompt: For new research questions, find prior work first. Say plainly if it was already answered.
  - name: Conflict pass
    owner: Synthesis · Conflict
    schedule: Every Thursday at 14:00
    prompt: Name where research findings disagree. Never average them into one answer.
suggest:
  - text: Never cite a source you did not read.
    on: true
  - text: Read and summarise. Never write to anything.
    on: true
  - text: Give me the counter-argument too.
  - text: Say how confident you are, and why.
---

Four Bots synthesising research. Names unknowns explicitly.
