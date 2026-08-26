# Governance

botteams.ai is maintained by Ellelion LLC. GitHub is the content management
system for the public directory, so repository governance is also publishing
governance.

## Roles

- `@skillselion` is the Ellelion brand code owner and repository administration
  account. It reviews contributor pull requests and manages workflows, settings,
  and releases. GitHub does not permit authors to approve their own pull requests,
  so changes authored by this account use the recorded publishing bypass.
- Contributors propose changes through forks and pull requests.

The `ellelion` organization owns the repository. Public project administration
uses the brand account above.

## Decision process

Discussion happens in the issue or pull request. Maintainers may ask for
changes, close a proposal that does not fit the directory, or defer work that
the project cannot maintain. Ellelion LLC makes the final product and publishing
decision through its brand account.

## Merge policy

Three active rulesets protect `main`:

- **Main integrity** has no bypass. It requires linear history and blocks branch
  deletion and force pushes.
- **Main required checks** requires strict schema, documentation, lint, build,
  dependency, and CodeQL status checks. `@skillselion` has always-bypass access.
- **Main reviews** requires a pull request and approval. `@skillselion` has
  always-bypass access and may push directly to `main`.

A contributor change must:

1. Use a pull request.
2. Pass schema, documentation, lint, build, dependency, and CodeQL checks.
3. Be up to date with `main`.
4. Resolve all review conversations.
5. Receive approval from `@skillselion` after the latest reviewable push.
6. Use a squash merge.

The `@skillselion` brand administration account may push directly to `main` or
bypass the pull-request and required-check rules. CI
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
maintainer review. Normal contributor checks apply unless `@skillselion` uses
the recorded maintainer bypass.
