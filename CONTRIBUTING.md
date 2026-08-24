# Add a team

A team is one markdown file in [`teams/`](./teams). Front matter names the
Bots, the group chat, the routines, and the connectors the account needs
first. The installer prompt is generated from that file, so the file is the
product. There is no database and no admin.

The machine-readable source of truth is the public
[team schema](https://botteams.ai/schema/team.schema.json). The validator also
applies semantic checks that JSON Schema cannot express, such as matching the
filename to `slug` and checking that room members and routine owners name Bots
in the same recipe.

## How pull requests work

1. Fork the repository and create a branch from `main`.
2. Add or change one focused item.
3. Run `npm ci` and `npm test` with the Node version in `.nvmrc`.
4. Open a pull request and complete the checklist.
5. Resolve review comments and keep the branch up to date with `main`.

GitHub blocks direct changes to `main`. The schema, lint, build, dependency,
and security checks must pass. Approval from code owner `@icidab` is required,
including for maintainers. See [GOVERNANCE.md](./GOVERNANCE.md).

## The bar

Before you open a pull request:

- **You ran it end to end.** Not "this should work". You pasted the installer
  prompt into Grok Bot, the Bots got created, and the routines did something
  useful.
- **It is self-contained.** A reader with the listed connectors can run it
  without any other setup, private repo, or internal doc.
- **It has the right shape.** A team has two to six Bots with distinct jobs and
  at least one group chat. A bot has exactly one Bot and no group chat.
- **It is not an ad.** A team that exists to sell one product will be closed.
  Sponsorship is a separate thing: see [/sponsor](https://botteams.ai/sponsor).
- **Guardrails are explicit.** If a Bot touches money, mail, or production,
  the persona says what it will not do. "Drafts only, never sends" is the
  house style for a reason.

## The file

Filename is `<slug>.md` and the slug must equal the `slug` field. Lowercase,
alphanumerics and dashes only.

```yaml
---
$schema: https://botteams.ai/schema/team.schema.json
slug: founder-os                    # required, equals the filename
name: Founder OS                    # required
tagline: One line for the job.      # required
bots: 2                             # required, must equal the agents length
section: Founder OS                 # required, from the closed list below
kind: team                          # required: team or bot
status: installable                 # required: installable or example
connectors:                         # required, account-wide union
  - Stripe
  - Gmail
agents:                             # required, 2 to 6 Bots
  - name: Founder · Money
    persona: Reads Stripe. Drafts the brief. Never moves funds.
    connectors: [Stripe]
  - name: Founder · Inbox
    persona: Drafts mail. Never sends.
    connectors: [Gmail]
rooms:                              # required, each 2 to 6 members
  - name: Founder HQ
    members: [Founder · Money, Founder · Inbox]
routines:                           # required
  - name: Monday money brief
    owner: Founder · Money
    schedule: Every Monday at 08:00
    prompt: Read Stripe. Draft the brief. Never move funds.
---
```

Body prose is optional. It renders under the roster.

Complete templates that pass `npm run validate`:
[`docs/examples/sample-team.md`](./docs/examples/sample-team.md) and
[`docs/examples/sample-bot.md`](./docs/examples/sample-bot.md).

### Optional attribution

| Field | Meaning |
|---|---|
| `added_at` | Quoted ISO 8601 UTC, e.g. `"2026-08-21T09:00:00.000Z"`. Otherwise taken from the commit that added the file. |
| `contributor` | Your handle. Shows as "Contributed by". |
| `contributor_url` | Your profile. Defaults to `github.com/<handle>`. |
| `scouted_by` | Whoever found it, when that is not you. |
| `added_via` | URL of the post the team came from. Shows as "Based on this post by". |
| `url` | Canonical homepage for the team. Must be unique across the directory. |
| `integration_urls` | Map of connector name to URL. Names must be connectors on this team. |

### Customize inputs

Both are optional, and both belong to the team rather than to the site. A
Sales team and a Founder OS team should not offer the same chips.

| Field | Meaning |
|---|---|
| `connector_modes` | Map of connector name to `read`, `draft`, or `ask`. Sets where the Customize control starts. Names must be connectors on this team. |
| `suggest` | Chips offered under "Also tell Grok Bot". A string, or a map with `text` and `on: true` to start it selected. Three to five is plenty. |

Use `on: true` for the lines this team should never ship without, and leave
the rest off. The reader can drop a default chip; that is the point of
showing it rather than hard-coding it into the prompt.

A mode is wording in the prompt, not a permission. Grok Bot connectors are
account-wide, so every Bot on the account can reach every connected tool.
Write the chip and the mode as an instruction to the Bots, never as a claim
that something is locked.

```yaml
connector_modes:
  Stripe: read
  Gmail: draft
suggest:
  - text: Never send mail. Draft only.
    on: true
  - text: Never move funds.
    on: true
  - text: Brief me Mondays in Founder HQ.
```

### Two shapes

A **team** is two to six Bots in one group chat and lives in `teams/`. A
**bot** is one Bot doing one job and lives in `bots/`. They are separate
folders, separate URLs, and separate API collections, and the site never
adds them into one count.

| | `bots/` | `teams/` |
|---|---|---|
| `kind` | `bot` | `team` |
| `bots` | always 1 | 2 to 6, matching `agents` |
| `agents` | exactly one | one per Bot |
| `rooms` | forbidden, empty or absent | required, each 2 to 6 Bots |
| `routines` | 0 to 50 per owning Bot | 0 to 50 per owning Bot |
| Verified | never | when the roster fits |
| URL | `/bots/<slug>` | `/teams/<slug>` |

`status` is `installable` or `example` and says nothing about shape. It
used to say `team`, which put the word on 56 files that have no group
chat. Kind says what it is; status says whether it is real or a demo.

The 50-routine cap is xAI's, and it is per owning Bot. There is no
documented cap on a team as a whole, so do not invent one.

`from_xai: true` marks a recipe as our write-up of a job xAI publishes in
its [use-case gallery](https://x.ai/bot/use-cases). It shows a **From xAI**
chip that links to the source. It is a badge on a card, not a directory claim: a bot
is a bot whether or not we sourced it. Never write copy that implies xAI
reviewed, certified, or endorsed anything here.

Verified is a separate claim, a narrow one, and it exists for teams only:
kind is `team`, at least one Bot, `bots` matching the roster, at least one
group chat, every group chat holding two to six Bots, and Bots plus group
chats under the account cap of 50. A bot is never Verified, because
Verified is a claim about a group chat and a bot makes none. The rule is
asserted in the validate script, so breaking it fails CI.

### Categories

The category list is closed so a typo cannot quietly become a new category.
Current values live in the `section` enum in the
[public schema](https://botteams.ai/schema/team.schema.json). To add one,
change that enum in the same pull request and say why.

## Checks

```bash
npm run validate   # schema, slug, category, roster sizes, attribution
npm run lint       # TypeScript and React lint rules
npm run build      # types and a full production build
npm test           # every local merge check
```

CI runs these checks, a dependency review, and CodeQL. `validate` fails on an
unknown category, a slug that does not match the filename, a duplicate slug or
`url`, a room outside 2 to 6 members, a `bots` count that disagrees with the
roster, and a per-Bot connector that is not on the team.

## Language

- A row is a **team**.
- The unit is a **Bot**, capital B, never a seat.
- Group chats hold **two to six Bots**.
- No em-dashes.

## After merge

GitHub is the CMS. There is no other admin. Merge to `main` deploys
https://botteams.ai. A team file at `teams/<slug>.md` is live at
`/teams/<slug>`. A bot file at `bots/<slug>.md` is live at `/bots/<slug>`.

CI must pass first (`npm run validate` and `npm run build`). Vercel also
builds a preview on the pull request. Merge to `main` is the publish step.
There is no second admin screen.
