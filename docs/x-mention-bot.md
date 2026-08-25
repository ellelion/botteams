# Mention bot

**Status: not implemented. There is no handle yet.**

The directory has no X account, so nothing on the site tells anyone to tag one.
This note is the design, kept so the work is a build rather than a decision
when a handle exists.

## Flow

1. Someone posts a description of a Grok Bot setup that reads like a team.
2. They reply, tagging the directory handle.
3. A worker reads the thread and drafts a team file:
   - `added_via` is the post URL.
   - `scouted_by` is whoever tagged, when that is not the author.
   - `contributor` is the author of the original post.
   - `integration_urls` is filled only for tools named unambiguously.
4. The worker opens a pull request against `ellelion/botteams`. It never
   writes to `main`.
5. A human reviews against the bar in [CONTRIBUTING.md](../CONTRIBUTING.md).
   The quality bar is not automatable: the point is that someone ran it.
6. On merge, the worker replies with the live URL.

## Rules

- A draft is a pull request, never a direct commit. A mention is a
  suggestion, not authorisation to publish.
- A post is not a run. Anything scouted lands as `status: example` until a
  human confirms it works, because the directory's claim is that these recipes
  were run.
- Never invent `integration_urls` or a connector the post did not name.
- Reply once. No follow-ups, no unsolicited mentions.

## Before building

The maintainer has to name the handle. The site copy, the contribute modal, and the
CONTRIBUTING section all reference it, so they ship together or not at all.
Do not use another directory's handle in placeholder copy.
