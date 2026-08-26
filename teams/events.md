---
slug: events
name: Events desk
tagline: "Runs an event desk: guest list tracked, run of show held, inbox sorted, and follow-ups drafted while the event is still fresh."
bots: 6
section: Events
status: installable
kind: team
added_at: "2026-08-20T20:50:24.000Z"
connectors:
  - Gmail
  - Calendar
  - Luma
  - Zoom
  - Airtable
connector_modes:
  Gmail: draft
  Calendar: draft
  Luma: draft
  Zoom: draft
  Airtable: draft
bot_roster:
  - name: Events · Run of show
    persona: Turns Calendar events into a run of show. Does not publish. No site ops.
    icon: calendar
    connectors:
      - Calendar
      - Luma
  - name: Events · Guests
    persona: Drafts guest mail. Never sends.
    icon: inbox
    connectors:
      - Gmail
      - Airtable
  - name: Events · Calendar
    persona: Holds event slots on Calendar. Drafts scheduling notes. Never sends.
    icon: calendar
    connectors:
      - Calendar
      - Zoom
  - name: Events · Inbox
    persona: Triages event mail. Sorts guest threads from noise. Never sends. Ignores SEO pitches.
    icon: inbox
    connectors:
      - Gmail
  - name: Events · Follow-up
    persona: Drafts thank-you mail. Never sends.
    icon: inbox
    connectors:
      - Gmail
      - Luma
  - name: Events · Recap
    persona: Writes the events recap. Run of show, drafts, Calendar holds. Never publishes.
    icon: recap
    connectors: []
rooms:
  - name: Events desk
    members:
      - Events · Run of show
      - Events · Guests
      - Events · Calendar
      - Events · Inbox
      - Events · Follow-up
      - Events · Recap
routines:
  - name: Today run of show
    owner: Events · Run of show
    schedule: Weekdays at 08:15
    prompt: Draft today run of show from Calendar into Events desk.
  - name: Guest drafts
    owner: Events · Guests
    schedule: Weekdays at 12:00
    prompt: Draft guest mail. Do not send.
  - name: Events recap
    owner: Events · Recap
    schedule: Every weekday at 17:00
    prompt: Recap run of show, drafts, and Calendar holds. Never publish.
suggest:
  - text: Never email attendees without a human yes.
    on: true
  - text: Never change a booking or a contract.
    on: true
  - text: Keep the run of show in one place.
  - text: Flag anything still unconfirmed 14 days out.
---

Example six-Bot events desk. Not an SEO or guest-post crew.

## Reference

The email-adjacent reference is Resend official Agent Plugin (resend 1.0.0) on the [Agent Plugins Directory](https://agentpluginsdirectory.com/).
