import { site } from "@/lib/site";
import type { StoredRecipe } from "@/lib/x-mentions/types";

function shorten(value: string, maximum: number): string {
  if (value.length <= maximum) return value;
  const clipped = value.slice(0, Math.max(1, maximum - 1)).replace(/\s+\S*$/, "").trimEnd();
  return `${clipped || value.slice(0, Math.max(1, maximum - 1))}…`;
}

function recipeDescription(recipe: StoredRecipe): string {
  return recipe.tagline?.trim() || `A ${recipe.kind} recipe in the Botteams directory.`;
}

function singleReply(recipe: StoredRecipe, includeUrl: boolean): string {
  const lead = `${recipe.outcome === "added" ? "Added" : "Already listed"} ${recipe.name}.`;
  const destination = includeUrl
    ? recipe.url
    : `Open ${site.name} and search: ${recipe.slug}.`;
  const descriptionLimit = Math.max(24, 270 - lead.length - destination.length - 2);
  return `${lead}\n${shorten(recipeDescription(recipe), descriptionLimit)}\n${destination}`;
}

export function replyText(recipes: StoredRecipe[]): string {
  if (recipes.length === 1) return singleReply(recipes[0], true);
  const blocks = recipes.map((recipe) => singleReply(recipe, true));
  const full = blocks.join("\n\n");
  if (full.length <= 270) return full;
  const first = recipes[0];
  const lead = `${recipes.some((recipe) => recipe.outcome === "added") ? "Added" : "Found"} ${recipes.length} recipes.`;
  const destination = `${first.name}: ${first.url}`;
  const descriptionLimit = Math.max(24, 270 - lead.length - destination.length - 2);
  return `${lead}\n${shorten(recipeDescription(first), descriptionLimit)}\n${destination}`;
}

export function fallbackReplyText(recipes: StoredRecipe[]): string {
  if (recipes.length === 1) return singleReply(recipes[0], false);
  const lead = `${recipes.some((recipe) => recipe.outcome === "added") ? "Added" : "Found"} ${recipes.length} recipes.`;
  const first = recipes[0];
  const destination = `Open ${site.name} and search: ${first.slug}.`;
  const descriptionLimit = Math.max(24, 270 - lead.length - destination.length - 2);
  return `${lead}\n${shorten(recipeDescription(first), descriptionLimit)}\n${destination}`;
}
