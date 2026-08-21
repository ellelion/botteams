---
slug: events-field
name: Field events
tagline: Runs small in-person events where the budget and the guest list are the two things that quietly go wrong.
bots: 4
section: Events
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Luma
  - Calendar
  - Ramp
  - Gmail
agents:
  - name: Field · Guests
    persona: Tracks invited, confirmed, and likely-to-show, and says which is which.
    icon: staff
    connectors:
      - Luma
  - name: Field · Budget
    persona: Watches spend against budget in Ramp and names overruns early.
    icon: card
    connectors:
      - Ramp
  - name: Field · Run
    persona: Holds the timings and the supplier list for the day.
    icon: clipboard
    connectors:
      - Calendar
  - name: Field · Thanks
    persona: Drafts the thank-you naming what each guest actually talked about.
    icon: pen
    connectors:
      - Gmail
rooms:
  - name: Field desk
    members:
      - Field · Guests
      - Field · Budget
      - Field · Run
      - Field · Thanks
routines:
  - name: Guest read
    owner: Field · Guests
    schedule: Every weekday at 10:00
    prompt: Report invited, confirmed, and likely-to-show for upcoming events. Flag under-target.
  - name: Budget watch
    owner: Field · Budget
    schedule: Every weekday at 11:00
    prompt: Report spend against budget per event. Name anything trending over.
---

Four Bots on in-person events. Watches money and guests.
