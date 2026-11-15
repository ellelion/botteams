# AGENTS.md

Rules for any agent (Grok Bot, Claude Code, Cursor, Codex) working in this repo.

## Source of truth
- Strategy, standards, infra, access and decisions live in the Ellelion wiki:
  GitHub `ellelion/ellelion-wiki`, on the Mac at `~/Desktop/root/wiki`.
- Read first: `index.md`, `shared/agents.md`, `shared/bot-hq.md`, and this product's page
  (see below). Recent `log.md` lines beat older pages.
- This repo's docs cover code only. Do not copy wiki content here.

## Base rules
1. Commit and push directly to `main`. No pull requests.
2. The build (and tests, where present) passes before every push.
3. Verify live after deploy (HTTP 200 and the change visible) and name the check.
4. After a durable change, append one line to the wiki `log.md` and update the owning
   page; commit and push the wiki.
5. Secrets: never print or commit values. Pointers only (`shared/secrets-inventory.md`).
6. Ask first (wiki `shared/bot-hq.md` gates): quarterly plans, launches, new spend,
   DNS/Cloudflare/Dokploy/keys or other production infra changes.

## This repo
<!-- REPO-SPECIFIC START -->
- Product: botteams.io (Grok Bot teams directory) — wiki page `products/grokbotteams/overview.md`
- Site bot: botteams (owner). Experts: Marketing, Infrastructure, Finance.
- Build: `npm run build` · Test: `npm test` · Deploy: Dokploy service `botteams-web` from `main` (a push does not auto-deploy; trigger `application.deploy`). Vercel is retired. Details: `docs/deploy.md`.
- Live URL to verify: https://botteams.io
- Public name is `botteams.io`. Never `grokbotteams.ai` or `grokbotteam.ai` in user-facing copy, OG cards, README, or llms.txt. `botteams.ai` is the retired hostname only.
- `kind` is the shape (`team` or `bot`). `status` is `installable` (real) or `example` (format demo). Do not write `status: team`.
- Node version is `.nvmrc`. `npm test` runs validate, unit tests, lint, and `next build`. CI (`.github/workflows/ci.yml`) also runs `npm audit --audit-level=high`.
- Ellelion agents push to `main` (base rule 1). Outside contributors still open a pull request; `main` is protected except the `@skillselion` admin bypass (`CONTRIBUTING.md`, `GOVERNANCE.md`).
<!-- REPO-SPECIFIC END -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
