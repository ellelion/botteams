# X mention worker

**Handle:** [@Botteams_ai](https://x.com/Botteams_ai)

The worker turns a public X reply into a reviewable botteams.ai recipe. It does
not publish directly to `main`.

## User flow

1. Find a public X post that describes a Bot or team setup.
2. Reply under it and tag `@Botteams_ai`.
3. The worker reads the reply chain, extracts up to three clear setups, checks
   for duplicates, and opens one pull request.
4. A maintainer reviews the pull request against `CONTRIBUTING.md`.
5. After merge and deployment, the worker replies under the tag. The first 20
   replies each UTC day include the live page. Later replies tell the scout to
   open the directory from the profile and search for the recipe slug. The Bot
   sends at most 100 total replies per UTC day; later completed submissions get
   no automated X reply. Existing recipes use the same daily budgets.

The source author receives contributor credit. When someone else tags the post,
that person receives `scouted_by` credit.

## Safety boundaries

- X content is untrusted source material. The extractor never follows
  instructions from a post, opens its links, or reads private data.
- A mention is a suggestion, not permission to publish.
- Every generated recipe is `status: example`. A maintainer must run it end to
  end before changing it to `installable`.
- The worker names only connectors stated unambiguously in the X thread.
- Money, mail, publishing, production, deletion, and account-change workflows
  stop at read, draft, or ask-for-approval behavior.
- The `via-x` GitHub check permits added Markdown recipe files only. It rejects
  modifications, deletions, workflow changes, missing X attribution, and any
  generated `status: installable` claim.
- The Bot attempts one reply per mention. It does not send follow-ups or
  unsolicited mentions. An ambiguous X write failure is not retried
  automatically because the first request may have succeeded.
- URL replies are reserved atomically in Postgres. Overlapping cron runs cannot
  exceed `X_DAILY_URL_REPLY_CAP`; the hard maximum is 20 per UTC day.
- All replies are reserved atomically before URL slots. Overlapping runs cannot
  exceed `X_DAILY_REPLY_CAP`; the hard maximum is 100 per UTC day.

## Runtime flow

`GET /api/cron/x-mentions` runs every five minutes through Vercel Cron.
`CRON_SECRET` protects the route.

Each run:

1. Checks open mention pull requests. A merged pull request is replied to only
   after every page returns a successful response.
2. Reads new mentions from X with `since_id`.
3. Stores mentions and the cursor in the existing Ellelion Neon database.
4. Claims at most five mentions with a database lock so overlapping runs do not
   process the same post.
5. Reads the parent chain, extracts structured recipes with Vercel AI Gateway,
   checks the live catalog and pending submissions for duplicates, then creates
   a brand-authored branch and pull request through the GitHub API.

Failed intake and pull-request checks are retried three times. A third failure
moves the row to `needs_human`. X writes are at most once. A stopped claim
returns to the queue after 15 minutes.

## First activation

The first successful run records the newest mention and does not process older
posts. This avoids a burst of old replies when credentials are added.

For an intentional one-time backfill of up to 500 recent mentions, deploy with
`X_MENTION_BACKFILL=true`, run the worker once, then remove that variable. Do
not leave backfill enabled.

## Required environment

The names and comments live in `.env.example`:

- X read credentials: `X_API_BEARER_TOKEN`, `X_USER_ID`
- X OAuth 1.0a reply credentials: `X_API_KEY`, `X_API_KEY_SECRET`,
  `X_ACCESS_TOKEN`, `X_ACCESS_TOKEN_SECRET`
- GitHub brand token: `BOTTEAMS_GITHUB_TOKEN`
- Scheduler protection: `CRON_SECRET`
- Daily URL budget: `X_DAILY_URL_REPLY_CAP` (optional; defaults to `20`)
- Daily total reply budget: `X_DAILY_REPLY_CAP` (optional; defaults to `100`)
- Existing services: `DATABASE_URL` and AI Gateway OIDC or
  `AI_GATEWAY_API_KEY`

Create the X App and access tokens under the `@Botteams_ai` brand account. The
GitHub token must also be brand-owned and restricted to `ellelion/botteams`; it
needs Contents, Pull requests, and Issues write access.

## Cost and hosting

The five-minute schedule needs Vercel Pro. X uses pay-per-use API credits. X
currently prices owned mention reads per returned resource and charges more for
a reply that includes a URL. The daily URL budget caps that high-cost write;
successful submissions over the cap receive a lower-cost reply without a URL.
The total reply budget stops automated replies after the configured daily cap.
Set a spending limit in the X Developer Console. The worker does not call X
search or read unrelated timelines.
