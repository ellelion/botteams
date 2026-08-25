---
name: google-keyword-research
description: Query Ellelion's read-only Google Ads keyword-idea tool for SEO, AEO, and GEO research. Use for keyword discovery, demand validation, content briefs, target-query selection, and country/language comparisons. Do not use for ad creation or for purely technical SEO fixes whose target query is already known.
---

# Google keyword research

Use the Google Ads API only as an internal SEO/AEO/GEO research source for Ellelion-owned sites.
It is not an advertising tool.

## Before a keyword request

1. Read the first canonical state page that exists:
   - `~/Desktop/root/wiki/shared/google-ads-keyword-api.md`
   - `~/wiki/shared/google-ads-keyword-api.md`
2. Run `ellelion-keywords doctor`.
3. If the command is missing and the wiki is present, run the wiki's
   `scripts/install-agent-tooling.sh`, then retry.
4. In a cloud agent, run `~/wiki/scripts/hydrate-agent-secrets.sh` first when Runtime Secrets
   are available.

Production keyword calls require `ready: true` and Google Ads Basic or Standard Access. Explorer
Access does not permit `KeywordPlanIdeaService`. If the gate is not ready, report `Ads API
pending` and continue with GSC, Bing keyword data, Ahrefs/Semrush, Google Trends UI, and the live
SERP.

## Command

```bash
ellelion-keywords ideas \
  --keyword "ai agent teams" \
  --geo US \
  --language en \
  --limit 100
```

Use `--url` for one public page, `--site` for an entire owned site, or repeat `--keyword` for up
to 20 seeds. Always set geography and language explicitly. Numeric `--geo-id` and
`--language-id` remain available for targets not in the command's convenience map.

## Decision rules

- Start with GSC for queries and pages where the site already has impressions.
- Use Ads ideas for new vocabulary, related demand, monthly history, and country/language
  comparisons.
- Treat Ads competition as advertiser competition, not organic ranking difficulty.
- Treat no-spend volume as approximate ranges and prioritization signals.
- Check Ahrefs/Semrush, the live SERP, business fit, and cannibalization before creating a page.
- For AEO/GEO, use ideas as question/entity vocabulary. They do not measure AI citations.

## Hard boundary

The installed client exposes only `KeywordPlanIdeaService.GenerateKeywordIdeas`. Never create or
modify campaigns, ads, budgets, billing, audiences, conversions, permissions, remarketing, or
Customer Match. Never request secret values in chat or put them in git.
