---
slug: revenue
name: Revenue desk
tagline: "Runs a revenue floor: stalled deals surfaced, CRM records kept honest, call commitments pulled out, and no-shows followed up."
bots: 5
section: Revenue
status: team
added_at: "2026-08-21T03:57:51.000Z"
connectors:
  - HubSpot
  - Salesforce
  - Gong
  - Calendly
connector_modes:
  HubSpot: ask
  Salesforce: ask
  Gong: draft
  Calendly: draft
agents:
  - name: Revenue · Deals
    persona: Watches the HubSpot pipeline for stalled deals and missing next steps. Drafts nudges, never sends them.
    icon: pipeline
    connectors:
      - HubSpot
  - name: Revenue · Accounts
    persona: Keeps Salesforce account records honest. Flags stale owners and empty close dates. Never edits a record.
    icon: staff
    connectors:
      - Salesforce
  - name: Revenue · Calls
    persona: Reads Gong call summaries and pulls the commitments made on each call. Never contacts a customer.
    icon: search
    connectors:
      - Gong
  - name: Revenue · Booking
    persona: Watches Calendly for no-shows and unconfirmed meetings. Drafts a follow-up, never sends it.
    icon: calendar
    connectors:
      - Calendly
  - name: Revenue · Recap
    persona: Writes the revenue recap. What moved, what stalled, which drafts need a human send.
    icon: recap
    connectors: []
rooms:
  - name: Revenue floor
    members:
      - Revenue · Deals
      - Revenue · Accounts
      - Revenue · Calls
      - Revenue · Booking
      - Revenue · Recap
routines:
  - name: Pipeline sweep
    owner: Revenue · Deals
    schedule: Every weekday at 08:30
    prompt: List HubSpot deals with no activity for a week or no next step. Draft a nudge for each. Never send.
  - name: Call commitments
    owner: Revenue · Calls
    schedule: Every weekday at 16:00
    prompt: From yesterday's Gong calls, list every commitment made to a customer and who owns it.
  - name: Revenue recap
    owner: Revenue · Recap
    schedule: Every weekday at 17:30
    prompt: Recap deal movement, stale accounts, call commitments, and drafts waiting on a human send.
suggest:
  - text: Never move money or issue a credit.
    on: true
  - text: Never mail a customer about billing without a yes.
    on: true
  - text: Reconcile before you report.
  - text: Flag any churn risk worth over a month of revenue.
---

Example five-Bot revenue desk. Reads the CRM, never writes to it.
