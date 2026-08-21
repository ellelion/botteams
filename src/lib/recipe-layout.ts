import { en } from "@/lib/messages/en";

/*
 * Eight arrangements of one recipe, chosen from the URL.
 *
 * This lives outside the picker component because the server page reads
 * the query to decide what to render, and a "use client" module cannot be
 * called from the server.
 *
 * Two families:
 *
 *   Document layouts (rail, workbench, outline) let the page scroll. They
 *   read like a page and keep the site footer.
 *
 *   Shell layouts (the rest) are an app frame: the window is exactly one
 *   viewport tall and never scrolls on a desktop. Content scrolls inside
 *   panes. They drop the footer, because a footer is the end of a
 *   document and a shell has no end.
 */
export type RecipeLayout =
  | "rail"
  | "workbench"
  | "outline"
  | "studio"
  | "deck"
  | "bento"
  | "inspector"
  | "stage";

export const LAYOUTS: { id: RecipeLayout; label: string }[] = [
  { id: "rail", label: en.recipe.layoutRail },
  { id: "workbench", label: en.recipe.layoutWorkbench },
  { id: "outline", label: en.recipe.layoutOutline },
  { id: "studio", label: en.recipe.layoutStudio },
  { id: "deck", label: en.recipe.layoutDeck },
  { id: "bento", label: en.recipe.layoutBento },
  { id: "inspector", label: en.recipe.layoutInspector },
  { id: "stage", label: en.recipe.layoutStage },
];

const ALL = new Set(LAYOUTS.map((l) => l.id));

/* The five that lock to the viewport. */
const SHELLS = new Set<RecipeLayout>(["studio", "deck", "bento", "inspector", "stage"]);

export function isShell(layout: RecipeLayout): boolean {
  return SHELLS.has(layout);
}

/** Anything unrecognised falls back to the default rather than 404ing. */
export function normalizeLayout(value: string | undefined): RecipeLayout {
  return value && ALL.has(value as RecipeLayout) ? (value as RecipeLayout) : "rail";
}
