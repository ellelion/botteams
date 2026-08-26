import type { ScoutedRecipe } from "@/lib/x-mentions/types";

function scalar(value: string): string {
  return JSON.stringify(value);
}

function stringList(lines: string[], key: string, values: string[], indent = ""): void {
  if (values.length === 0) {
    lines.push(`${indent}${key}: []`);
    return;
  }
  lines.push(`${indent}${key}:`);
  for (const value of values) lines.push(`${indent}  - ${scalar(value)}`);
}

const EXAMPLE_NOTE =
  "This is an example drafted from the linked public X post. It has not been run end to end. Review it before changing the status to installable.";

export function recipePath(recipe: Pick<ScoutedRecipe, "kind" | "slug">): string {
  return `${recipe.kind === "bot" ? "bots" : "teams"}/${recipe.slug}.md`;
}

export function recipeUrl(recipe: Pick<ScoutedRecipe, "kind" | "slug">): string {
  return `https://botteams.ai/${recipe.kind === "bot" ? "bots" : "teams"}/${recipe.slug}`;
}

export function serializeRecipe(recipe: ScoutedRecipe): string {
  const lines = [
    "---",
    `$schema: ${scalar("https://botteams.ai/schema/team.schema.json")}`,
    `slug: ${scalar(recipe.slug)}`,
    `name: ${scalar(recipe.name)}`,
    `tagline: ${scalar(recipe.tagline)}`,
    `bots: ${recipe.botRoster.length}`,
    `section: ${scalar(recipe.section)}`,
    `status: ${scalar("example")}`,
    `kind: ${scalar(recipe.kind)}`,
    `added_at: ${scalar(recipe.addedAt)}`,
    `contributor: ${scalar(recipe.contributor)}`,
    `contributor_url: ${scalar(recipe.contributorUrl)}`,
  ];
  if (recipe.scoutedBy) lines.push(`scouted_by: ${scalar(recipe.scoutedBy)}`);
  lines.push(`added_via: ${scalar(recipe.addedVia)}`);
  stringList(lines, "connectors", recipe.connectors);
  lines.push("bot_roster:");
  for (const bot of recipe.botRoster) {
    lines.push(`  - name: ${scalar(bot.name)}`);
    lines.push(`    persona: ${scalar(bot.persona)}`);
    stringList(lines, "connectors", bot.connectors, "    ");
  }
  stringList(lines, "rooms", [], "");
  if (recipe.rooms.length > 0) {
    lines.pop();
    lines.push("rooms:");
    for (const room of recipe.rooms) {
      lines.push(`  - name: ${scalar(room.name)}`);
      stringList(lines, "members", room.members, "    ");
    }
  }
  if (recipe.routines.length === 0) {
    lines.push("routines: []");
  } else {
    lines.push("routines:");
    for (const routine of recipe.routines) {
      lines.push(`  - name: ${scalar(routine.name)}`);
      lines.push(`    owner: ${scalar(routine.owner)}`);
      lines.push(`    schedule: ${scalar(routine.schedule)}`);
      lines.push(`    prompt: ${scalar(routine.prompt)}`);
    }
  }
  lines.push("---", "");
  if (recipe.body) lines.push(recipe.body.trim(), "");
  lines.push(EXAMPLE_NOTE, "");
  return lines.join("\n");
}
