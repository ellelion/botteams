import { getBot, getTeam } from "@/lib/teams";
import { recipeOgImage } from "@/lib/recipe-og";
import { site } from "@/lib/site";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ kind: string; slug: string }> },
) {
  const { kind, slug } = await params;
  const recipe = kind === "bots" ? getBot(slug) : kind === "teams" ? getTeam(slug) : undefined;
  if (!recipe) return new Response("Not found", { status: 404 });
  return recipeOgImage(recipe, site.url);
}
