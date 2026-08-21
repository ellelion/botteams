# Add a team

A team is one markdown file in [`packs/`](./packs). Front matter names the
Bots, the group chat, the routines, and the connectors the account needs
first. The installer prompt is generated from that file, so the file is the
product. There is no database and no admin.

## The bar

Before you open a pull request:

- **You ran it end to end.** Not "this should work". You pasted the installer
  prompt into Grok Bot, the Bots got created, and the routines did something
  useful.
- **It is self-contained.** A reader with the listed connectors can run it
  without any other setup, private repo, or internal doc.
- **It is a team, not a bot.** Two to six Bots with distinct jobs and one
  group chat. A single Bot is not a team.
- **It is not an ad.** A team that exists to sell one product will be closed.
  Sponsorship is a separate thing: see [/sponsor](https://grokbotteams.ai/sponsor).
- **Guardrails are explicit.** If a Bot touches money, mail, or production,
  the persona says what it will not do. "Drafts only, never sends" is the
  house style for a reason.

## The file

Filename is `<slug>.md` and the slug must equal the `slug` field. Lowercase,
alphanumerics and dashes only.

```yaml
---
slug: founder-os                    # required, equals the filename
name: Founder OS                    # required
tagline: One line for the job.      # required
bots: 3                             # required, must equal the agents length
section: Founder OS                 # required, from the closed list below
status: team                        # required: team (installable) or example
connectors:                         # required, account-wide union
  - Stripe
  - Gmail
agents:                             # required, 2 to 6 Bots
  - name: Founder · Money
    persona: What this Bot does, and what it will not do.
    icon: card                      # optional
    connectors: [Stripe]            # optional, must be a subset of the team list
    reuse: true                     # optional
rooms:                              # required, each 2 to 6 members
  - name: Founder HQ
    members: [Founder · Money, Founder · Inbox]
routines:                           # required
  - name: Monday money brief
    owner: Founder · Money
    schedule: Every Monday at 08:00
    prompt: Read Stripe. Draft the brief. Never move funds.
---

Body prose is optional. It renders under the roster.
```

### Optional attribution

| Field | Meaning |
|---|---|
| `added_at` | Quoted ISO 8601 UTC, e.g. `"2026-08-21T09:00:00.000Z"`. Otherwise taken from the commit that added the file. |
| `contributor` | Your handle. Shows as "Contributed by". |
| `contributor_url` | Your profile. Defaults to `github.com/<handle>`. |
| `scouted_by` | Whoever found it, when that is not you. |
| `added_via` | URL of the post the team came from. Shows as "Based on this post by". |
| `url` | Canonical homepage for the team. Must be unique across the shelf. |
| `integration_urls` | Map of connector name to URL. Names must be connectors on this team. |

### Categories

The category list is closed so a typo cannot quietly become a new category.
Current values live in `CATEGORIES` in
[`scripts/validate-packs.mjs`](./scripts/validate-packs.mjs). To add one,
change that list in the same pull request and say why.

## Checks

```bash
npm run validate   # schema, slug, category, roster sizes, attribution
npm run build      # types and a full production build
```

CI runs both. `validate` fails on an unknown category, a slug that does not
match the filename, a duplicate slug or `url`, a room outside 2 to 6 members,
a `bots` count that disagrees with the roster, and a per-Bot connector that is
not on the team.

## Language

- A row is a **team**, never a pack.
- The unit is a **Bot**, capital B, never a seat.
- Group chats hold **two to six Bots**.
- No em-dashes.

## Contributing by post

Not live yet. There is no shelf handle to tag, so a pull request is the only
way in today. The intended flow is written up in
[`docs/x-mention-bot.md`](./docs/x-mention-bot.md).
