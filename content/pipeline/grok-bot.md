# Pipeline tracker: What is Grok Bot?

Canonical: `/grok-bot` on botteams.ai
Primary query: What is Grok Bot?
Quoted sources: xAI Grok Bot docs and launch post (fetched 2026-08-24), this repository's team/bot counts.
Voice profile: none. House voice from existing botteams.ai pages.
Human-voice / write-content applied.

## Phases

| Phase | Status | Evidence |
|---|---|---|
| 0 define | done | Primary query "What is Grok Bot?". Surface: `/grok-bot`. Audience: people who heard of Grok Bot and need a sourced explainer; next action is copy an installer. Evidence: official docs + directory counts. Competitor read: flaviocopes.com/grok-bot/ (2026-08-22). We do not quote Flavio; we quote xAI and this catalog. |
| 1 structure | done | Answer block 56 words. 8 query H2s matching the numbered skeleton. Dated stats. Source: quotes. Comparison table. FAQ as h3 + schema. Last updated. 7 verified internal links. 3 xAI externals. |
| 2 draft | done | First-person directory operators. Opinion on the shared computer. No invented "we ran this Bot" story. |
| 2.5 voice match | waived | No `*-voice.md` in this repo. |
| 3 slop pass | done | grep hit one em dash inside an xAI quote (kept). Curly quotes in running prose rewritten. "not a vault" / "not a certification" / "not a fantasy bake-off" rewritten. |
| 4 scorecard | done | See below. Rendered HTML checked at localhost:3000/grok-bot (200). |
| 5 blind review | done | Separate agent 2026-08-24. Verdict: keep URL, cut overlap. Must-fix items applied: FAQ #1 removed, shared-computer lecture cut, §3 gutted, §6/§7 merged, answer-first on setup/skills/access, one href per xAI URL (source footer). |

## Source freshness

| Source | Quoted | Verified |
|---|---|---|
| https://docs.x.ai/grok-bot/overview | yes | 2026-08-24 fetch |
| https://docs.x.ai/grok-bot/get-started | yes | 2026-08-24 fetch |
| https://docs.x.ai/grok-bot/bots | supporting | 2026-08-24 fetch |
| https://docs.x.ai/grok-bot/skills-routines-and-automations | yes | 2026-08-24 fetch |
| https://docs.x.ai/grok-bot/approvals-security-and-privacy | yes | 2026-08-24 fetch |
| https://docs.x.ai/grok-bot/use-cases | yes | 2026-08-24 fetch |
| https://x.ai/news/introducing-grok-bot | yes | 2026-08-24 fetch |
| teams/ and bots/ in this repo | 140 teams, 59 bots, 56 from xAI | 2026-08-24 render |
| CONNECTOR_CATALOG.length | 342, checked 2026-08-21 | same array the /connectors page uses |
| flaviocopes.com/grok-bot/ | read, not quoted | 2026-08-24 |
| Skillselion skill catalog refresh | not quoted | skipped; no skills.sh skill is a citation in the piece |

## Phase 4 scorecard

| Rule | Result |
|---|---|
| Answer block 40-60 words | pass, 56 |
| Query headings | pass, H1 + 8 H2s |
| Dated + sourced stats | pass |
| Verbatim quotes with Source: | pass |
| Tables / numbered lists | pass |
| FAQ block | pass, 4 questions, 45-49 words, schema matches |
| Last updated date | pass, 2026-08-24 |
| Internal links 3-8, verified | pass, 7 live 200s |
| External primary sources 1-3 | pass, overview + get-started + launch |
| Keyword in title / H1 / first sentence | pass |
| One quotable finding | pass: shared computer is account-scoped; 140 teams / 59 bots on 24 August 2026 |
| No cannibalizing target | pass: homepage stays the directory |

## Gap pass

1. Footer also renders H2s (Product, Docs, Company, Ellelion). Site chrome on every page. Waived.
2. Org-authored, no personal byline. Matches the rest of botteams.ai. Waived.
3. Page is dynamic (ƒ) like /docs. Crawlers still receive full HTML. Waived.

## What still looked generated, then fixed

- Curly quotes around allow-the-browser.
- Negative labels: not a vault, not a certification, not a fantasy bake-off.
- "even plainer" throat-clearing.

## Audit log

- 2026-08-24: em dash in skills/routines quote kept (source punctuation).
- 2026-08-24: FAQ questions promoted from dt to h3 so schema names match headings.
- 2026-08-24 blind review: chatbot FAQ cloned H1/§1 (cut). Shared-computer restated six times (cut lecture, keep quote + FAQ). Recipe CTA moved out of §3. Comparison namedropped ChatGPT/Claude without verification (merged into wrong-tool table). Date-as-anchor on launch URL (body links removed; source footer keeps the three primary hrefs).
