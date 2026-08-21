import { en } from "@/lib/messages/en";

/*
 * Three arrangements of one recipe, chosen from the URL.
 *
 * This lives outside the picker component because the server page reads
 * the query to decide what to render, and a "use client" module cannot be
 * called from the server.
 */
export type RecipeLayout = "rail" | "workbench" | "outline";

export const LAYOUTS: { id: RecipeLayout; label: string }[] = [
  { id: "rail", label: en.recipe.layoutRail },
  { id: "workbench", label: en.recipe.layoutWorkbench },
  { id: "outline", label: en.recipe.layoutOutline },
];

/** Anything unrecognised falls back to the default rather than 404ing. */
export function normalizeLayout(value: string | undefined): RecipeLayout {
  return value === "workbench" || value === "outline" ? value : "rail";
}
