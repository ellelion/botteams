import { getBot, getTeam } from "@/lib/teams";
import { recipeOgImage } from "@/lib/recipe-og";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ kind: string; slug: string }> },
) {
  const { kind, slug } = await params;
  const recipe = kind === "bots" ? getBot(slug) : kind === "teams" ? getTeam(slug) : undefined;
  if (!recipe) return new Response("Not found", { status: 404 });
  const assetOrigin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : new URL(request.url).origin;
  return recipeOgImage(recipe, assetOrigin);
}
