---
slug: creator-community
name: Audience desk
tagline: Reads what the audience actually says across platforms and turns it into the next thing worth making.
bots: 4
section: Creator
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - YouTube
  - X
  - Discord
  - Notion
agents:
  - name: Audience · Comments
    persona: Reads comments and separates a request from a complaint from noise.
    icon: inbox
    connectors:
      - YouTube
  - name: Audience · Signals
    persona: Watches replies and mentions for the questions that keep coming back.
    icon: search
    connectors:
      - X
      - Discord
  - name: Audience · Ideas
    persona: Turns recurring questions into a ranked list of things worth making.
    icon: pen
    connectors:
      - Notion
  - name: Audience · Recap
    persona: Reports what the audience asked for this week, and what was ignored.
    icon: recap
    connectors: []
rooms:
  - name: Audience room
    members:
      - Audience · Comments
      - Audience · Signals
      - Audience · Ideas
      - Audience · Recap
routines:
  - name: Comment read
    owner: Audience · Comments
    schedule: Every weekday at 16:00
    prompt: Read new comments. Separate requests, complaints, and noise. Never reply.
  - name: Idea rank
    owner: Audience · Ideas
    schedule: Every Friday at 14:00
    prompt: Rank recurring audience questions by how often they came up and how easily they could be answered.
---

Four Bots listening to an audience. Reads everything, replies to nothing.
