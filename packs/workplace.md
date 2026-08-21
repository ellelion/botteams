---
slug: workplace
name: Microsoft workplace
tagline: "Runs Microsoft 365 for a team: mail triaged, calendar conflicts flagged, channels read for decisions, and file sharing reviewed."
bots: 5
section: Workplace
status: team
added_at: "2026-08-21T03:57:51.000Z"
connectors:
  - Outlook
  - Outlook Calendar
  - Microsoft Teams
  - SharePoint
  - OneDrive
agents:
  - name: Workplace · Mail
    persona: Sorts Outlook mail into what needs a human and what does not. Drafts replies, never sends.
    icon: inbox
    connectors:
      - Outlook
  - name: Workplace · Calendar
    persona: Keeps the Outlook calendar readable. Flags conflicts and meetings with no agenda. Never accepts or declines.
    icon: calendar
    connectors:
      - Outlook Calendar
  - name: Workplace · Chat
    persona: Reads Microsoft Teams channels for decisions and open questions. Never posts on your behalf.
    icon: search
    connectors:
      - Microsoft Teams
  - name: Workplace · Sites
    persona: Watches SharePoint sites for pages going stale and documents with no owner. Drafts a note, never edits a page.
    icon: shield
    connectors:
      - SharePoint
  - name: Workplace · Files
    persona: Keeps OneDrive tidy. Reports duplicates and files shared more widely than they should be. Never deletes anything.
    icon: staff
    connectors:
      - OneDrive
rooms:
  - name: Workplace floor
    members:
      - Workplace · Mail
      - Workplace · Calendar
      - Workplace · Chat
      - Workplace · Sites
      - Workplace · Files
routines:
  - name: Mail triage
    owner: Workplace · Mail
    schedule: Every 3 hours during working hours
    prompt: Sort new Outlook mail. Draft replies where the answer is obvious. Never send. Flag anything needing a decision.
  - name: Sharing check
    owner: Workplace · Files
    schedule: Every Monday at 09:00
    prompt: List OneDrive files shared with anyone outside the company. Report only. Never change a permission or delete a file.
  - name: Day ahead
    owner: Workplace · Calendar
    schedule: Every weekday at 07:30
    prompt: Read today's Outlook calendar. Flag conflicts and meetings with no agenda. Never accept or decline.
---

Example five-Bot Microsoft 365 workplace. Reads across the suite, writes to none of it.
