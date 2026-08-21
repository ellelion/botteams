---
slug: events-webinar
name: Webinar desk
tagline: "Runs a webinar end to end: registrations watched, reminders drafted, and the follow-up ready before the call ends."
bots: 5
section: Events
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Luma
  - Zoom
  - Gmail
  - Calendar
connector_modes:
  Luma: draft
  Zoom: draft
  Gmail: draft
  Calendar: draft
agents:
  - name: Webinar · Signups
    persona: Reports registrations against target and where they came from.
    icon: pipeline
    connectors:
      - Luma
  - name: Webinar · Reminders
    persona: Drafts the reminder sequence with the actual join link. Never sends.
    icon: pen
    connectors:
      - Gmail
  - name: Webinar · Run
    persona: Holds the run of show and names who owns each segment.
    icon: clipboard
    connectors:
      - Zoom
  - name: Webinar · Follow
    persona: Drafts the follow-up split by attended and did not attend.
    icon: inbox
    connectors:
      - Gmail
  - name: Webinar · Calendar
    persona: Tracks the dates and flags anything unbooked.
    icon: calendar
    connectors:
      - Calendar
rooms:
  - name: Webinar desk
    members:
      - Webinar · Signups
      - Webinar · Reminders
      - Webinar · Run
      - Webinar · Follow
      - Webinar · Calendar
routines:
  - name: Signup read
    owner: Webinar · Signups
    schedule: Every weekday at 09:00
    prompt: Report registrations against target and by source. Flag if pace misses target.
  - name: Follow-up draft
    owner: Webinar · Follow
    schedule: Every weekday at 17:00
    prompt: For webinars held today, draft separate follow-ups for attendees and no-shows. Never send.
suggest:
  - text: Never email attendees without a human yes.
    on: true
  - text: Never change a booking or a contract.
    on: true
  - text: Keep the run of show in one place.
  - text: Flag anything still unconfirmed 14 days out.
---

Five Bots around a webinar. Drafts every email, sends none.
