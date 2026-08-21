---
slug: revenue-churn
name: Churn analysis
tagline: Reads cancellations for the reason rather than the reason box, and separates the preventable from the rest.
bots: 4
section: Revenue
status: installable
kind: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Stripe
  - Zendesk
  - Mixpanel
  - Notion
connector_modes:
  Stripe: read
  Zendesk: ask
  Mixpanel: draft
  Notion: draft
agents:
  - name: Churn · Events
    persona: Records every cancellation with the account's real history.
    icon: card
    connectors:
      - Stripe
  - name: Churn · Reason
    persona: Reads support history for the reason behind the stated reason.
    icon: search
    connectors:
      - Zendesk
  - name: Churn · Signals
    persona: Finds what these accounts did differently before leaving.
    icon: pipeline
    connectors:
      - Mixpanel
  - name: Churn · Brief
    persona: Separates preventable churn from the rest, honestly.
    icon: recap
    connectors:
      - Notion
rooms:
  - name: Churn desk
    members:
      - Churn · Events
      - Churn · Reason
      - Churn · Signals
      - Churn · Brief
routines:
  - name: Cancellation read
    owner: Churn · Reason
    schedule: Every weekday at 10:00
    prompt: For cancellations since yesterday, read the support history and give the likely real reason.
  - name: Monthly brief
    owner: Churn · Brief
    schedule: Every month on the 1st at 11:00
    prompt: Split last month's churn into preventable and not. Do not flatter us.
suggest:
  - text: Never move money or issue a credit.
    on: true
  - text: Never mail a customer about billing without a yes.
    on: true
  - text: Reconcile before you report.
  - text: Flag any churn risk worth over a month of revenue.
---

Four Bots on churn. Looks past the reason box.
