import { githubFileExists, getPullRequest, openMentionPullRequest } from "@/lib/x-mentions/github";
import {
  claimReplyAttempt,
  claimNextMention,
  ensureMentionTables,
  findSubmissionBySlug,
  getMentionCursor,
  ingestMentions,
  listPendingPullRequests,
  markMentionClosed,
  markMentionError,
  markMentionIgnored,
  markMentionPrOpen,
  markMentionReplySuppressed,
  markMentionReplied,
  markMentionWaitingForDeploy,
  markReplyError,
  releaseStaleClaims,
  replaceMentionRecipes,
  reserveDailyReply,
  reserveDailyUrlReply,
  setMentionCursor,
} from "@/lib/x-mentions/db";
import { extractRecipes, finalizeRecipes } from "@/lib/x-mentions/extract";
import {
  dailyReplyCap,
  dailyUrlReplyCap,
  mentionBackfillEnabled,
  mentionHandle,
  xReadConfig,
} from "@/lib/x-mentions/config";
import { recipePath, recipeUrl, serializeRecipe } from "@/lib/x-mentions/markdown";
import { fetchMentions, fetchReplyChain, replyOnX, resolveBotUserId } from "@/lib/x-mentions/x-client";
import { listAll } from "@/lib/teams";
import type { MentionRow, ScoutedRecipe, StoredRecipe } from "@/lib/x-mentions/types";

const MAX_MENTIONS_PER_RUN = 5;

type WorkerSummary = {
  bootstrapped: boolean;
  ingested: number;
  processed: number;
  ignored: number;
  pullRequests: number;
  replies: number;
  urlReplies: number;
  fallbackReplies: number;
  suppressedReplies: number;
  errors: number;
};

function replyText(recipes: StoredRecipe[]): string {
  const lines = recipes.map((recipe) =>
    `${recipe.outcome === "added" ? "Added" : "Already listed"} ${recipe.name}: ${recipe.url}`,
  );
  const full = lines.join("\n");
  if (full.length <= 270) return full;
  const added = recipes.filter((recipe) => recipe.outcome === "added").length;
  return `${added > 0 ? `Added ${added}` : "Found"} ${recipes.length === 1 ? "recipe" : `${recipes.length} recipes`}: ${recipes.map((recipe) => recipe.url).join(" ")}`;
}

function fallbackReplyText(recipes: StoredRecipe[]): string {
  const lines = recipes.map((recipe) =>
    `${recipe.outcome === "added" ? "Added" : "Already listed"} ${recipe.name}. Open the directory from our profile and search: ${recipe.slug}.`,
  );
  const full = lines.join("\n");
  if (full.length <= 270) return full;
  const added = recipes.filter((recipe) => recipe.outcome === "added").length;
  return `${added > 0 ? `Added ${added}` : "Found"} ${recipes.length === 1 ? "recipe" : `${recipes.length} recipes`}. Open the directory from our profile and search for the reviewed names.`;
}

async function sendBudgetedReply(
  recipes: StoredRecipe[],
  mentionId: string,
  summary: WorkerSummary,
): Promise<string | null> {
  const replyAllowed = await reserveDailyReply(mentionId, dailyReplyCap());
  if (!replyAllowed) {
    await markMentionReplySuppressed(mentionId, recipes);
    summary.suppressedReplies += 1;
    return null;
  }
  const includeUrls = await reserveDailyUrlReply(mentionId, dailyUrlReplyCap());
  const attemptClaimed = await claimReplyAttempt(mentionId);
  if (!attemptClaimed) {
    await markMentionReplySuppressed(
      mentionId,
      recipes,
      "automatic reply was already attempted; duplicate prevented",
    );
    summary.suppressedReplies += 1;
    return null;
  }
  const replyPostId = await replyOnX(
    includeUrls ? replyText(recipes) : fallbackReplyText(recipes),
    mentionId,
  );
  if (includeUrls) summary.urlReplies += 1;
  else summary.fallbackReplies += 1;
  return replyPostId;
}

async function pagesAreLive(recipes: StoredRecipe[]): Promise<boolean> {
  const results = await Promise.all(
    recipes.map(async (recipe) => {
      try {
        const response = await fetch(recipe.url, {
          method: "HEAD",
          redirect: "follow",
          cache: "no-store",
          signal: AbortSignal.timeout(8000),
        });
        return response.ok;
      } catch {
        return false;
      }
    }),
  );
  return results.every(Boolean);
}

async function syncMergedSubmissions(summary: WorkerSummary): Promise<void> {
  for (const mention of await listPendingPullRequests()) {
    if (!mention.prNumber || mention.recipes.length === 0) continue;
    try {
      const pull = await getPullRequest(mention.prNumber);
      if (pull.state === "open") continue;
      if (!pull.merged_at) {
        await markMentionClosed(mention.mentionId);
        continue;
      }
      let publishedRecipes = mention.recipes;
      if (!(await pagesAreLive(publishedRecipes))) {
        const presence = await Promise.all(
          publishedRecipes.map((recipe) => githubFileExists(recipePath(recipe))),
        );
        const reconciled = publishedRecipes.filter((_, index) => presence[index]);
        if (reconciled.length === 0) {
          await markMentionClosed(mention.mentionId);
          continue;
        }
        if (reconciled.length !== publishedRecipes.length) {
          publishedRecipes = reconciled;
          await replaceMentionRecipes(mention.mentionId, publishedRecipes);
        }
      }
      if (!(await pagesAreLive(publishedRecipes))) {
        await markMentionWaitingForDeploy(mention.mentionId);
        continue;
      }
      const replyPostId = await sendBudgetedReply(publishedRecipes, mention.mentionId, summary);
      if (!replyPostId) continue;
      await markMentionReplied(mention.mentionId, replyPostId, publishedRecipes);
      summary.replies += 1;
    } catch (error) {
      await markReplyError(mention.mentionId, error instanceof Error ? error.message : String(error));
      summary.errors += 1;
    }
  }
}

function stored(recipe: Pick<ScoutedRecipe, "slug" | "name" | "kind">, outcome: StoredRecipe["outcome"]): StoredRecipe {
  return {
    slug: recipe.slug,
    name: recipe.name,
    kind: recipe.kind,
    url: recipeUrl(recipe),
    outcome,
  };
}

function existingStored(existing: ReturnType<typeof listAll>[number]): StoredRecipe {
  return {
    slug: existing.slug,
    name: existing.name,
    kind: existing.kind,
    url: `https://botteams.ai/${existing.kind === "bot" ? "bots" : "teams"}/${existing.slug}`,
    outcome: "existing",
  };
}

async function classifyCandidates(
  mention: MentionRow,
  recipes: ScoutedRecipe[],
): Promise<{
  newRecipes: ScoutedRecipe[];
  existing: StoredRecipe[];
  pending: MentionRow | null;
}> {
  const catalog = listAll();
  const newRecipes: ScoutedRecipe[] = [];
  const existing: StoredRecipe[] = [];
  let pending: MentionRow | null = null;

  for (const recipe of recipes) {
    const exactSource = catalog.find((item) => item.addedVia === recipe.addedVia);
    const exactIdentity = catalog.find((item) =>
      item.slug === recipe.slug || item.name.toLowerCase() === recipe.name.toLowerCase(),
    );
    const known = exactSource ?? exactIdentity;
    if (known) {
      if (!existing.some((item) => item.slug === known.slug)) existing.push(existingStored(known));
      continue;
    }

    const prior = await findSubmissionBySlug(recipe.slug, mention.mentionId);
    if (prior) {
      const priorRecipe = prior.recipes.find((item) => item.slug === recipe.slug);
      if (["pr_open", "waiting_for_deploy", "reply_error"].includes(prior.status) && prior.prNumber) {
        pending ??= prior;
      } else if (priorRecipe) {
        existing.push({ ...priorRecipe, outcome: "existing" });
      }
      continue;
    }

    if (await githubFileExists(recipePath(recipe))) {
      existing.push(stored(recipe, "existing"));
      continue;
    }
    newRecipes.push(recipe);
  }

  return { newRecipes, existing, pending };
}

async function processMention(mention: MentionRow, botUserId: string, summary: WorkerSummary): Promise<void> {
  const chain = await fetchReplyChain(mention.mentionId);
  const request = chain.at(-1);
  const source = chain.at(-2);
  if (!request || !source) {
    await markMentionIgnored(mention.mentionId, "mention is not a reply to a source post");
    summary.ignored += 1;
    return;
  }
  const expectedHandle = mentionHandle().toLowerCase();
  if (request.authorId === botUserId || !request.text.toLowerCase().includes(expectedHandle)) {
    await markMentionIgnored(mention.mentionId, "mention is not an explicit request to the configured handle");
    summary.ignored += 1;
    return;
  }
  if (source.authorId === botUserId) {
    await markMentionIgnored(mention.mentionId, "source post belongs to the directory bot");
    summary.ignored += 1;
    return;
  }

  const candidates = await extractRecipes(chain);
  const recipes = finalizeRecipes({
    candidates,
    source,
    scout: request,
    addedAt: new Date().toISOString(),
  });
  if (recipes.length === 0) {
    await markMentionIgnored(mention.mentionId, "no clear safe recipe was found in the thread");
    summary.ignored += 1;
    return;
  }

  const { newRecipes, existing, pending } = await classifyCandidates(mention, recipes);
  if (newRecipes.length === 0 && existing.length > 0) {
    const replyPostId = await sendBudgetedReply(existing, mention.mentionId, summary);
    if (!replyPostId) return;
    await markMentionReplied(mention.mentionId, replyPostId, existing, true);
    summary.replies += 1;
    return;
  }
  if (newRecipes.length === 0 && pending?.prNumber && pending.prUrl) {
    const carried = pending.recipes.map((recipe) => ({ ...recipe, outcome: "added" as const }));
    await markMentionPrOpen(mention.mentionId, pending.prNumber, pending.prUrl, carried);
    return;
  }
  if (newRecipes.length === 0) {
    await markMentionIgnored(mention.mentionId, "matching recipe is already awaiting review");
    summary.ignored += 1;
    return;
  }

  const pull = await openMentionPullRequest({
    mentionId: mention.mentionId,
    sourceUrl: recipes[0].addedVia,
    scout: request.authorUsername,
    names: newRecipes.map((recipe) => recipe.name),
    files: newRecipes.map((recipe) => ({ path: recipePath(recipe), content: serializeRecipe(recipe) })),
  });
  const storedRecipes = [
    ...newRecipes.map((recipe) => stored(recipe, "added")),
    ...existing,
  ];
  await markMentionPrOpen(mention.mentionId, pull.number, pull.html_url, storedRecipes);
  summary.pullRequests += 1;
}

export async function runMentionWorker(): Promise<WorkerSummary> {
  const summary: WorkerSummary = {
    bootstrapped: false,
    ingested: 0,
    processed: 0,
    ignored: 0,
    pullRequests: 0,
    replies: 0,
    urlReplies: 0,
    fallbackReplies: 0,
    suppressedReplies: 0,
    errors: 0,
  };
  xReadConfig();
  await ensureMentionTables();
  await releaseStaleClaims();
  const botUserId = await resolveBotUserId();
  await syncMergedSubmissions(summary);

  const cursor = await getMentionCursor();
  if (cursor === null) {
    const backfill = mentionBackfillEnabled();
    const firstPage = await fetchMentions(botUserId, undefined, !backfill);
    await setMentionCursor(firstPage.newestId ?? "0");
    summary.bootstrapped = true;
    if (!backfill) return summary;
    summary.ingested += await ingestMentions(firstPage.posts);
  } else {
    const page = await fetchMentions(botUserId, cursor);
    summary.ingested += await ingestMentions(page.posts);
    if (page.newestId) await setMentionCursor(page.newestId);
  }

  for (let index = 0; index < MAX_MENTIONS_PER_RUN; index += 1) {
    const mention = await claimNextMention();
    if (!mention) break;
    try {
      await processMention(mention, botUserId, summary);
      summary.processed += 1;
    } catch (error) {
      await markMentionError(mention.mentionId, error instanceof Error ? error.message : String(error));
      summary.errors += 1;
    }
  }
  return summary;
}
