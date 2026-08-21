import { listTeams } from "@/lib/teams";
import { site } from "@/lib/site";

export function GET() {
  const teams = listTeams();
  const teamLines = teams.map((team) => `- [${team.name}](${site.url}/teams/${team.slug}) (${team.status}): ${team.tagline}`).join("\n");
  const body = [`# ${site.name}`, "", `> ${site.entity}`, "", `${site.company}. Contact: ${site.email}`, `Source: ${site.github}`, `Canonical domain: grokbotteams.ai. Type-in grokbotteam.ai should 301 when DNS exists.`, "", "## Pages", "", `- [Home](${site.url})`, `- [Connectors](${site.url}/connectors)`, `- [Docs](${site.url}/docs)`, `- [API](${site.url}/api)`, `- [OpenAPI 3.1](${site.url}/openapi.json)`, `- [Sponsor](${site.url}/sponsor)`, "", "## Teams", "", teamLines, ""].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
