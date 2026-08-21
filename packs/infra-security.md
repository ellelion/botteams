---
slug: infra-security
name: Security posture
tagline: "Watches the boring security surface that gets ignored until it does not: keys, permissions, and exposed endpoints."
bots: 4
section: Infrastructure
status: team
added_at: "2026-08-21T09:00:00.000Z"
connectors:
  - Cloudflare
  - GitHub
  - 1Password
  - Snyk
connector_modes:
  Cloudflare: draft
  GitHub: draft
  1Password: draft
  Snyk: draft
agents:
  - name: Security · Secrets
    persona: Finds credentials committed to a repository or left in a log.
    icon: shield
    connectors:
      - GitHub
  - name: Security · Access
    persona: Lists accounts with more access than their role needs.
    icon: staff
    connectors:
      - 1Password
  - name: Security · Exposed
    persona: Names endpoints reachable without authentication that should not be.
    icon: search
    connectors:
      - Cloudflare
  - name: Security · Deps
    persona: Reports vulnerable dependencies by whether they are actually reachable.
    icon: pipeline
    connectors:
      - Snyk
rooms:
  - name: Security desk
    members:
      - Security · Secrets
      - Security · Access
      - Security · Exposed
      - Security · Deps
routines:
  - name: Secret scan
    owner: Security · Secrets
    schedule: Every weekday at 07:00
    prompt: Scan for credentials in commits and logs since yesterday. Report privately. Never post a secret in chat.
  - name: Access review
    owner: Security · Access
    schedule: Every Monday at 09:00
    prompt: List accounts with access beyond their role. Never change a permission.
suggest:
  - text: Never apply a change. Draft the plan.
    on: true
  - text: Never touch production without a human yes.
    on: true
  - text: Name the blast radius before the fix.
  - text: Page me only for real user impact.
---

Four Bots on security hygiene. Reports privately, changes nothing.
