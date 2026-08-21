# Grok Bot Teams

Install a Grok Bot team, not a bot.

A public shelf of company teams for Grok Bot. Pick a team, copy one installer
prompt, paste it into Grok Bot. It creates the named Bots, the group chat, and
proposes the routines for you to confirm.

No accounts on this site. No plugin API. No one-click OAuth. Connectors have to
be on your Grok Bot account already.

Ellelion LLC · info@ellelion.com · MIT · **Not affiliated with xAI.**

## The shelf is a repo

A team is one markdown file in [`teams/`](./teams). Front matter names the Bots,
the group chat, the routines, and the connectors. The installer prompt is
generated from it, so the file is the product and GitHub is the CMS.

To add one, read [CONTRIBUTING.md](./CONTRIBUTING.md). The bar is that you ran
it end to end.

## Pages

| Route | What |
|---|---|
| `/` | Team index. Search, category, connector filter, sort. |
| `/teams/<slug>` | A team: Bots, group chat, routines, installer prompt, and Customize. |
| `/docs` | The team spec. Our recipe format, mapped onto official Grok Bot nouns. |
| `/connectors` | Every connector Grok Bot reaches, and which teams use each. |
| `/api` | Public API contract, readable without JavaScript. |
| `/sponsor` | Placements and rules. |

## Customize

Every team page can be edited in place: turn Bots off, rename them, set the
group chat, set how far each connector goes, and add standing instructions.
The installer prompt rewrites as you go and one Copy pill takes it.

The edits live in the URL hash, so a customized team is shareable and
nothing is stored on the site. Download gives you the same team back as a
team file you could open a pull request with.

A connector mode is **wording in the prompt, not a permission**. Grok Bot
connectors are account-wide: every Bot on the account can reach every
connected tool, and separate Bots are not a security boundary. The only
real switch is Grok Bot Settings, then Plugins, which is account-wide too.
The UI says so rather than drawing a lock the product does not have.

Per team, in the team file: `connector_modes` and `suggest`. See
[CONTRIBUTING.md](./CONTRIBUTING.md).

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

A row is a **team**. The unit is a **Bot**, capital B. Group chats hold two to six Bots. No em-dashes.

`status: team` is a team you can install. `status: example` is a format demo.
The folder, the route, the type, and the copy all say team. There is no
older spelling kept alive as an alias: nothing had shipped to anyone, so a
second name would only have been a second thing to maintain.

Canonical domain: grokbotteams.ai. `grokbotteam.ai` (no s) is a type-in that
should 301 when DNS exists. This repo does not buy or configure DNS.

## Stack

Next.js 16.2.10, React 19.2.4, TypeScript, Tailwind 4, gray-matter.
