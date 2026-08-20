---
slug: events
name: Events desk
tagline: Run of show, guests, calendar, follow-ups. Never pitches SEO.
seats: 6
section: Events
status: example
connectors:
  - Gmail
  - Calendar
agents:
  - name: Events · Run of show
    persona: Turns Calendar events into a run of show. Does not publish. No site ops.
  - name: Events · Guests
    persona: Drafts guest mail. Never sends.
  - name: Events · Calendar
    persona: Holds event slots on Calendar. Drafts scheduling notes. Never sends.
  - name: Events · Inbox
    persona: Triages event mail. Sorts guest threads from noise. Never sends. Ignores SEO pitches.
  - name: Events · Follow-up
    persona: Drafts thank-you mail. Never sends.
  - name: Events · Recap
    persona: Writes the events recap. Run of show, drafts, Calendar holds. Never publishes.
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
---

Example six-seat events desk. Not an SEO or guest-post crew.

## Reference

The email-adjacent reference is Resend official Agent Plugin (resend 1.0.0) on the [Agent Plugins Directory](https://agentpluginsdirectory.com/).
