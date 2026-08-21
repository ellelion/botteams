import { listPacks } from "@/lib/packs";
import { site } from "@/lib/site";

export function GET() {
  const packs = listPacks();
  const teamLines = packs.map((pack) => `- [${pack.name}](${site.url}/teams/${pack.slug}) (${pack.status}): ${pack.tagline}`).join("\n");
  const body = [`# ${site.name}`, "", `> ${site.entity}`, "", `${site.company}. Contact: ${site.email}`, `Source: ${site.github}`, `Canonical domain: grokbotteams.ai. Type-in grokbotteam.ai should 301 when DNS exists.`, "", "## Pages", "", `- [Home](${site.url})`, `- [Connectors](${site.url}/connectors)`, `- [Docs](${site.url}/docs)`, `- [API](${site.url}/api)`, `- [Sponsor](${site.url}/sponsor)`, "", "## Teams", "", teamLines, ""].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
