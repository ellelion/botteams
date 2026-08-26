import { listGuides } from "@/lib/guides";
import { listBots, listTeams } from "@/lib/teams";
import { site } from "@/lib/site";

export function GET() {
  const teams = listTeams();
  const bots = listBots();
  const teamLines = teams.map((team) => `- [${team.name}](${site.url}/teams/${team.slug}): ${team.tagline}`).join("\n");
  /* Two shelves, listed apart. A bot has one Bot and no group chat, and
     folding them into one list is how the count starts lying. */
  const botLines = bots.map((bot) => `- [${bot.name}](${site.url}/bots/${bot.slug}): ${bot.tagline}`).join("\n");
  const guideLines = listGuides().map((guide) => `- [${guide.headline}](${site.url}/guides/${guide.slug}): ${guide.description}`).join("\n");
  const body = [`# ${site.name}`, "", `> ${site.entity}`, "", `${site.company}. Contact: ${site.email}`, `Source: ${site.github}`, `Canonical domain: https://botteams.ai`, "", "## Pages", "", `- [Home](${site.url})`, `- [What is Grok Bot?](${site.url}/grok-bot)`, `- [Guides](${site.url}/guides)`, `- [Chief of Staff setups](${site.url}/collections/chief-of-staff)`, `- [Connectors](${site.url}/connectors)`, `- [Docs](${site.url}/docs)`, `- [API](${site.url}/api)`, `- [Bots](${site.url}/?kind=bot#teams)`, `- [OpenAPI 3.1](${site.url}/openapi.json)`, `- [API: teams](${site.url}/api/teams)`, `- [API: bots](${site.url}/api/bots)`, `- [Sponsor](${site.url}/sponsor)`, "", "## Guides", "", "One query per URL. The definition stays on /grok-bot.", "", guideLines, "", "## Teams", "", "A team is two to six Bots in one group chat.", "", teamLines, "", "## Bots", "", "A bot is one Bot doing one job. No group chat.", "", botLines, ""].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
