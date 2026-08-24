# Governance

botteams.ai is maintained by Ellelion LLC. GitHub is the content management
system for the public directory, so repository governance is also publishing
governance.

## Roles

- `@icidab` is the code owner and final reviewer. Every pull request needs this
  account's approval before merge.
- `@skillselion` is the brand automation and repository administration account.
  It can prepare branches, workflows, and settings. It cannot approve its own
  pull requests and it is not a code owner.
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

The active `main` ruleset has no bypass account. A change must:

1. Use a pull request.
2. Pass schema, documentation, lint, build, dependency, and CodeQL checks.
3. Be up to date with `main`.
4. Resolve all review conversations.
5. Receive approval from `@icidab` after the latest reviewable push.
6. Use a squash merge.

Direct pushes, branch deletion, and force pushes on `main` are blocked. Changes
to this file, `CODEOWNERS`, workflows, or the ruleset follow the same process.

## Releases

Merging to `main` publishes repository content and starts the production
deployment. There is no separate content administration step. A failed
deployment does not weaken the merge rules; it is fixed through another pull
request.

## Security

Security reports follow [SECURITY.md](./SECURITY.md). A private security fix may
stay non-public while it is being prepared, but the final change still needs
maintainer review and the normal automated checks before release.
