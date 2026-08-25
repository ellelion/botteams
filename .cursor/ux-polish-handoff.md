# UX polish handoff

Resume this, do not restart it. The user **stopped the 10-minute loop and the goal**. Do not `CreateGoal`, do not resubscribe `loop-ux-polish`, unless they ask.

Public name is **botteams.ai**. Never grokbotteams.ai.

## Where it is

| Item | Value |
| --- | --- |
| Repo | `ellelion/botteams` |
| Work branch | `cursor/ux-ui-polish-2027-44f3` (must stay `cursor/<name>-44f3`) |
| Preview branch | `preview/ux-ui-polish-review` |
| Handoff parent | `535581d` Keep Customize Copy-failed orange at rest |
| Merge PR | https://github.com/ellelion/botteams/pull/1 (draft, base `main`) |
| Preview PR | https://github.com/ellelion/botteams/pull/20 (draft, base `main`) |
| CI on `535581d` | 9/9 green |

`vercel.json` disables Git previews for `cursor/**`, `claude/**`, `codex/**`. User-visible catalog/Watch/CSS fixes go to **both** remotes:

```
git push -u origin cursor/ux-ui-polish-2027-44f3
git push origin HEAD:preview/ux-ui-polish-review
git branch -u origin/cursor/ux-ui-polish-2027-44f3
```

`update_pr` with `base_branch: main`. Omit title/body unless you mean to change them. Do not use `gh` for PR writes. Merge stays #1.

PR #1 was `mergeable_state: behind` at handoff. Rebase only if asked. Product commits wait for an explicit ask; this polish thread was that ask.

## Why this branch exists

Polish the directory to 2026–2027 UX practice: hierarchy, type, spacing, contrast, motion, WCAG, responsive, interaction, empty/error/loading. Success is **production-grade**, not incremental niceness.

Ledger: dark-first, mint, `--r-pill` / `--r-card` / `--r-inner`, no card shadows, no em-dashes, capital **B** in Bot. Chrome 11px stays (filters, chips, Copy, share, select triggers, `.browse-pick-btn`, kickers, `.cz-legend`, Watch Close type on desktop). Press squash `scale(0.96)` is intentional. Installer long lines stay one line; the `pre` is the scrollport.

## Last leftover shipped (do not re-fix)

Copy-fail color lost to a later idle rule. LightningCSS merges a restated `.foo.is-copy-fail` back to the early pair, then a later `.foo { color: ink-soft }` or `.cz-btn-quiet` wins at rest. Hover/focus still painted `--beta`, so a focused click looked fixed.

- Share: `f9bf5a5` — `.share-btn:not(.is-copy-fail)` plus `.share-bar .share-btn.is-copy-fail`
- Customize: `535581d` — `.cz-btn-quiet:not(.is-copy-fail)` plus `.cz-btn.cz-btn-quiet.is-copy-fail` / `.cz-actions .cz-btn.is-copy-fail`

Measured on a **fresh** Chrome profile, `setCacheEnabled(false)`, **wait 200ms** after `classList.add`, then read. Do not snapshot idle+fail in one evaluate without a wait (live `getComputedStyle` + no recalc looks like ink-soft). Blur after the wait: fail stays `--beta`, focused false.

| State | Dark | Light |
| --- | --- | --- |
| Idle Copy / share / download | ink-soft `#a8abb2` | ink-soft `#3f3f46` |
| Fail at rest | `--beta` `#ff8a4d` **8.48:1** | `--beta` `#9a3412` **7.31:1** |
| Post on X | stays idle | stays idle |
| Customize actions on phone | 114×44 / 142×44 | same |

`useCopyFeedback` pulses 2s then idle. Headless clipboard usually **fails** (useful for a real click). Theme key is `botteams-theme-v4`, not `grokbotteams-theme-v3`.

## Recent Watch / recipe (already measured)

- Typing line instead of 6px dots; light dots 3.66:1
- Notch Replay; landscape 667 title x=47; Replay vs Close; dock first item clears left 47
- `#watch` deep link; Customize `#c=` hold (`CUSTOMIZE_HASH_KEY`); Close must not throw a share hash
- One-Bot Watch plays generated `conversation` (`/bots/applicant-sheet-screen`)
- Hiring 1:1 empty: “No 1:1 replay for this Bot.” + Open group chat 131×44, hover + forced-colors
- `start()` not sync in effect bodies (`set-state-in-effect`); hash/IO/timeout
- Travel Coordinator: no Watch; empty routines + “Read how to create a Bot” 194×44

Open Watch with `#watch` after hydrate, not a click-before-hydrate. Customize is `button.rp-secondary` whose text is exactly `Customize`.

## What already passed (re-check if you change CSS)

Guides: all 20 at 320 overflow 0, TOC 44; compare tables 288 / right 304. `/grok-bot` reduced motion. `/docs` TOC open 6×44.

Chrome: 2.4.12 notched 360 name clears ticker + search. Landscape List **and** Cards clear ticker. Installer `pre` overflow 0 / `code` 2100 in 354 scrollport. Skip parked above notch; focus y=47, 123×44, 19.8:1.

Light: legal/docs/guides/sponsor paid+setup overflow 0, names 19.8:1. Accent picker 32 swatches, 44px. Light `--accent` never on body/hover text on paper; use `--accent-text` (`#336a60`). House floor **6:1** on page. Light Watch 6.23:1.

Tablet 768: hamburger 44, desktop nav hidden. Desktop 1280 `/guides`: nav on, hamburger hidden, Guides `aria-current="page"`, 24px pointer-fine (intentional). Do not extend 44px filters to 1024 `pointer:fine`. Do not lower 68rem masthead. Do not hide manifesto on portrait.

Phone footer 20 controls 44. 404 “This page is not here.” recoveries 44. Connector miss: type in `.cf-input` (proto value alone can leave shelf), wait debounce, then `.cf-empty-title`. Sponsor off + `?checkout=error` overflow 0; error 8.48:1 dark / 7.31:1 light. Roster tip opens on **focus**. Catalog pending: `aria-busy` + “updating”; reduced-motion drops 0.78 fade. No skeletons.

`querySelector(".a, .b, h1")` is **document order**. 404 hunt picked WingsHero `h1` “404” until `.idx-empty-title` was read directly.

## Do not rem / do not ship as the only tick

- Rem 11px chrome
- `/sponsor?paid=1` “mail us with the receipt”
- Hide more landscape/portrait hero unless newly measured
- Invent niceness when the hunt is clean
- Hover-only polish as the only tick unless a just-shipped control is missing hover
- shadcn, Formik/RHF, Leonardo, toasts, Framer Motion, Mantine, root `loading.tsx`, skeletons
- `status: team`

## How to verify

Puppeteer-core `/tmp/pup-light`, Chrome `/opt/google/chrome/chrome`, unique `--user-data-dir=/tmp/chrome-ux-*`. After a CSS change, **new profile** or you will measure stale chunks.

`pkill -f 'chrome.*user-data-dir=/tmp/chrome-ux'` in a **separate** invocation. A pkill of `user-data-dir=/tmp/chrome-ux` matches the current shell and kills itself.

Safe-area CDP: `Emulation.setSafeAreaInsetsOverride` with `{ insets: { top, bottom, left, right, topMax, bottomMax, leftMax, rightMax } }`. Portrait 47/34. Landscape **top 0**, bottom 21, left 47, right 21.

Headless `hover: hover` is false. Use **focus** for routine tips. Focusing inputs on 360×640 can grow `innerHeight` (emulation artifact); focus names/links for 2.4.12.

1.4.12: inject `* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }`.

Contrast: inline sRGB relative luminance. Sample **glyphs**, not padding (button `x+18` can hit page `#0a0a0a`). Image-model screenshot descriptions hallucinate leftover header lines.

Dev server: `127.0.0.1:3000`. Compare slug `/guides/grok-bot-vs-chatgpt-work`. Empty-routines bot `/bots/xai-travel-coordinator`. First-party Watch: `applicant-sheet-screen`, `on-page-seo-fixer`, `new-hire-ramp`.

## What's next, and why

1. **Hunt the next measured leftover on current HEAD.** Do not invent niceness. The last class of bug is cascade: later idle color beating a state class after LightningCSS merge. Look for the same pattern (quiet/ghost buttons, chips, alerts) only if computed style at rest is wrong.
2. **Re-run a full packet on this HEAD** (home, catalog List/Cards, team+bot, Watch, Customize, overwrite, guides×20, docs, sponsor error/paid, 404, connectors empty, light, 320/360/667/768/1280, 1.4.12, 200% type) before anyone claims production-grade. Last full packet predates `535581d`.
3. **Do not mark the polish goal complete** unless that packet plus forced-colors and a live Stripe dock (`canBuy` is false on this host) are honestly signed off. Forced-colors CSS exists; it cannot be emulated here.
4. Skill author links in Customize (`span.cz-hint a.cz-link`, ~18px) are **inline-in-sentence**. 2.5.8 excepts them. Do not bump them to 44.
5. Dead CSS only (`.talk-watch-inline`, `.os-badge`) is not a user-visible leftover. Do not ship as the only tick.

Wiki: `icidab/ellelion-wiki` 404s here. Write `no ingest: wiki not reachable`. No secrets in the wiki.
