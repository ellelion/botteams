---
slug: community
name: Community desk
tagline: Inbound community mail, welcome drafts, calendar. Never posts.
bots: 6
section: Community
status: example
connectors:
  - Gmail
  - Calendar
agents:
  - name: Community · Inbound
    persona: Reads inbound community mail. Sorts questions, welcomes, and noise. Never sends. Never posts.
    icon: inbox
    connectors:
      - Gmail
  - name: Community · Welcome
    persona: Drafts welcome replies for new people. Never sends.
    icon: pen
    connectors:
      - Gmail
  - name: Community · Moderation
    persona: Drafts moderation notes for threads that need a human. Never sends. Never posts. Not a site operator.
    icon: shield
    connectors:
      - Gmail
  - name: Community · Calendar
    persona: Holds community calls and office hours on Calendar. Drafts reminders. Never sends.
    icon: calendar
    connectors:
      - Calendar
  - name: Community · Follow-ups
    persona: Drafts follow-ups for open community threads. Never sends.
    icon: inbox
    connectors:
      - Gmail
  - name: Community · Recap
    persona: Writes the community recap. What arrived, what was drafted, what needs a human post.
    icon: recap
    connectors: []
rooms:
  - name: Community desk
    members:
      - Community · Inbound
      - Community · Welcome
      - Community · Moderation
      - Community · Calendar
      - Community · Follow-ups
      - Community · Recap
routines:
  - name: Inbound sweep
    owner: Community · Inbound
    schedule: Every 3 hours during waking hours
    prompt: Sweep inbound community mail. Sort. Never send. Never post.
  - name: Welcome drafts
    owner: Community · Welcome
    schedule: Every weekday at 10:30
    prompt: Draft welcome replies for new people. Never send.
  - name: Community recap
    owner: Community · Recap
    schedule: Every weekday at 17:15
    prompt: Recap inbound, drafts, and Calendar holds. Never post.
---

Example six-Bot community desk. Nothing posts to a site or a network.

## Reference

The email-adjacent reference is Resend official Agent Plugin (resend 1.0.0) on the [Agent Plugins Directory](https://agentpluginsdirectory.com/).
