# Deploy

Production is Dokploy on the Ellelion VPS (`152.53.18.182`), service
`botteams-web`, deployed from `ellelion/botteams` branch `main`.

Vercel is retired (2026-09-01). Its Git integration is disconnected, its crons
are disabled, and it only answers stale-DNS clients. Do not deploy there.

A push to `main` does not auto-deploy. Trigger `application.deploy` in Dokploy.

The public host is `botteams.io` (apex). `www.botteams.io` redirects here.
The domain is already attached to the existing Vercel project. Do not buy a
domain or create a Vercel team.

Vercel Git previews are disabled for `cursor/**`, `claude/**`, and `codex/**`
branches (`vercel.json`). Commit checkpoints locally, but do not spend a build
on every agent push. When one final preview is needed, push the ready commit
to a `preview/**` branch, such as `preview/final-ui-check`. Normal and
`preview/**` branches still create previews.

Host redirects for `www.botteams.io` and the retired `botteams.ai` hostname
live in Cloudflare, not in `next.config.ts`.

## Checks before push

Node version is `.nvmrc`.

```bash
npm ci
npm test
```

`npm test` runs `npm run validate`, `npm run test:unit`, `npm run lint`, and
`next build`. CI (`.github/workflows/ci.yml`) runs those same steps plus
`npm audit --audit-level=high`.

## Live check

After Dokploy finishes, confirm `https://botteams.io` returns HTTP 200 and the
change is visible.
