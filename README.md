# Grok Bot Teams

Install a Grok Bot team, not a bot.

A public shelf of company teams for Grok Bot. Pick a team, copy one installer
prompt, paste it into Grok Bot. It creates the named Bots, the group chat, and
proposes the routines for you to confirm.

No accounts on this site. No plugin API. No one-click OAuth. Connectors have to
be on your Grok Bot account already.

Ellelion LLC · info@ellelion.com · MIT · **Not affiliated with xAI.**

## The shelf is a repo

A team is one markdown file in [`packs/`](./packs). Front matter names the Bots,
the group chat, the routines, and the connectors. The installer prompt is
generated from it, so the file is the product and GitHub is the CMS.

To add one, read [CONTRIBUTING.md](./CONTRIBUTING.md). The bar is that you ran
it end to end.

## Pages

| Route | What |
|---|---|
| `/` | Team index. Search, category, connector filter, sort. |
| `/teams/<slug>` | A team: Bots, group chat, routines, installer prompt. (`/packs/<slug>` serves the same page.) |
| `/docs` | The team spec. Our recipe format, mapped onto official Grok Bot nouns. |
| `/connectors` | Every connector Grok Bot reaches, and which teams use each. |
| `/api` | Public API contract, readable without JavaScript. |
| `/sponsor` | Placements and rules. |

## API

No key, no auth, CORS open.

```bash
curl "https://grokbotteams.ai/api/teams?integration=Stripe&limit=5"
curl "https://grokbotteams.ai/api/teams?limit=100"
curl "https://grokbotteams.ai/api/teams?cursor=start&limit=100"
```

Full contract at [`/api`](https://grokbotteams.ai/api). There is no per-team
endpoint by design; filter the collection instead.

## Develop

```bash
npm install
npm run dev        # localhost:3000
npm run validate   # team schema and category checks
npm run build      # types plus production build
```

Node 22.12.0 (see `.nvmrc`).

## Language

A row is a **team**, never a pack. The unit is a **Bot**, capital B, never a
seat. Group chats hold two to six Bots. No em-dashes.

`status: team` is an installable team. `status: example` is a format demo.
Folder and route names still say `packs` for history; the UI says team.

Canonical domain: grokbotteams.ai. `grokbotteam.ai` (no s) is a type-in that
should 301 when DNS exists. This repo does not buy or configure DNS.

## Stack

Next.js 16.2.10, React 19.2.4, TypeScript, Tailwind 4, gray-matter.
