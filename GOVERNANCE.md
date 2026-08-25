# Governance

botteams.ai is maintained by Ellelion LLC. GitHub is the content management
system for the public directory, so repository governance is also publishing
governance.

## Roles

- `@icidab` is the code owner and final reviewer. Pull requests from other
  accounts need this account's approval before merge. GitHub does not permit
  authors to approve their own pull requests. This maintainer account has the
  direct-push and ruleset bypass described below.
- `@skillselion` is the brand automation and repository administration account.
  It can prepare branches, workflows, settings, and releases. It cannot approve
  its own pull requests and it is not a code owner, but it has the publishing
  bypass described below.
- Contributors propose changes through forks and pull requests.

These are the only accounts with repository administrator access. `@icidab` is
the Ellelion organization owner. `@skillselion` is a direct repository
administrator.

## Decision process

Discussion happens in the issue or pull request. Maintainers may ask for
changes, close a proposal that does not fit the directory, or defer work that
the project cannot maintain. `@icidab` makes the final product and publishing
decision.

## Merge policy

Three active rulesets protect `main`:

- **Main integrity** has no bypass. It requires linear history and blocks branch
  deletion and force pushes.
- **Main required checks** requires strict schema, documentation, lint, build,
  dependency, and CodeQL status checks. `@icidab` and `@skillselion` have
  always-bypass access.
- **Main reviews** requires a pull request and approval. `@icidab` and
  `@skillselion` have always-bypass access and may push directly to `main`.

A contributor change must:

1. Use a pull request.
2. Pass schema, documentation, lint, build, dependency, and CodeQL checks.
3. Be up to date with `main`.
4. Resolve all review conversations.
5. Receive approval from `@icidab` after the latest reviewable push.
6. Use a squash merge.

The `@icidab` owner account and `@skillselion` brand administration account may
push directly to `main` or bypass the pull-request and required-check rules. CI
still runs after a direct push. Direct pushes remain blocked for every other
account. Branch deletion, force pushes, and nonlinear history are blocked for
every account. Changes to this file, `CODEOWNERS`, workflows, or a ruleset must
keep this policy accurate.

## Releases

Merging to `main` publishes repository content and starts the production
deployment. There is no separate content administration step. A failed
deployment does not weaken the merge rules; it is fixed through another pull
request.

## Security

Security reports follow [SECURITY.md](./SECURITY.md). A private security fix may
stay non-public while it is being prepared, but the final change still needs
maintainer review. Normal contributor checks apply unless `@icidab` or
`@skillselion` uses the recorded maintainer bypass.
