---
slug: creator-shorts
name: Shorts desk
tagline: "Runs the short-form pipeline: which long videos have a clip worth cutting, and what each cut needs to work on its own."
bots: 4
section: Creator
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - YouTube
  - Canva
  - Notion
connector_modes:
  YouTube: ask
  Canva: draft
  Notion: draft
bot_roster:
  - name: Shorts · Mine
    persona: Reads back catalogue performance and names the moments most likely to work as a standalone clip.
    icon: search
    connectors:
      - YouTube
  - name: Shorts · Cut
    persona: "Writes the cut list: in point, out point, and the hook the clip opens on."
    icon: pen
    connectors:
      - Notion
  - name: Shorts · Cover
    persona: Drafts the thumbnail and title brief for each clip.
    icon: camera
    connectors:
      - Canva
  - name: Shorts · Track
    persona: Reports how published shorts performed against the prediction.
    icon: pipeline
    connectors:
      - YouTube
rooms:
  - name: Shorts desk
    members:
      - Shorts · Mine
      - Shorts · Cut
      - Shorts · Cover
      - Shorts · Track
routines:
  - name: Mining pass
    owner: Shorts · Mine
    schedule: Every Monday at 10:00
    prompt: Name moments in the back catalogue most likely to work as standalone clips. Say why for each.
  - name: Performance read
    owner: Shorts · Track
    schedule: Every Friday at 15:00
    prompt: Report how this week's shorts did against prediction. Name where the prediction was wrong.
suggest:
  - text: Never publish or schedule without a human yes.
    on: true
  - text: Never reply as me in public.
    on: true
  - text: Keep captions under the platform limit.
  - text: Tell me which idea you dropped and why.
---

Four Bots on short-form. Plans cuts, edits nothing.
