# botteams.io

Public name is **botteams.io**. Never **grokbotteams.ai** (or grokbotteam.ai) in
user-facing copy, OG cards, README, or llms.txt. botteams.ai is the retired
hostname only.

`kind` is the shape (`team` or `bot`). `status` is whether it is real
(`installable`) or a format demo (`example`). Do not write `status: team`.

## Deploy policy

- Pushes to `main` continue to auto-deploy to Vercel production.
- Vercel Git previews are disabled for `cursor/**`, `claude/**`, and
  `codex/**` branches. Commit checkpoints locally, but do not spend a build on
  every agent push.
- When one final preview is needed, push the ready commit to a `preview/**`
  branch, such as `preview/final-ui-check`. Normal and `preview/**` branches
  still create previews.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
