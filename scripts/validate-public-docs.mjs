import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const files = {
  readme: "README.md",
  contributing: "CONTRIBUTING.md",
  docsPage: "src/app/docs/page.tsx",
  site: "src/lib/site.ts",
  schema: "public/schema/team.schema.json",
};
const text = Object.fromEntries(
  Object.entries(files).map(([key, file]) => [key, fs.readFileSync(path.join(root, file), "utf8")]),
);

const failures = [];
function requireText(key, value) {
  if (!text[key].includes(value)) failures.push(`${files[key]}: missing ${JSON.stringify(value)}`);
}

for (const key of ["readme", "contributing", "docsPage"]) {
  for (const [pattern, label] of [
    [/grokbotteams\.ai/gi, "retired public domain"],
    [/grokbotteam\.ai/gi, "retired public domain"],
    [/status:\s*team\b/gi, "retired status value"],
  ]) {
    if (pattern.test(text[key])) failures.push(`${files[key]}: contains ${label}`);
  }
}

requireText("readme", "https://botteams.io/schema/team.schema.json");
requireText("readme", "kind: team");
requireText("readme", "status: installable");
requireText("contributing", "https://botteams.io/schema/team.schema.json");
requireText("contributing", "kind: team");
requireText("contributing", "status: installable");
requireText("contributing", "bot_roster:");
requireText("docsPage", "/schema/team.schema.json");
requireText("docsPage", "<code>installable</code>");
requireText("docsPage", "<code>example</code>");
requireText("docsPage", "<code>kind</code>");
requireText("docsPage", "<code>bot_roster</code>");
requireText("site", 'url: "https://botteams.io"');
requireText("schema", '"$id": "https://botteams.io/schema/team.schema.json"');
requireText("schema", '"bot_roster"');

for (const key of ["contributing", "docsPage", "schema"]) {
  for (const pattern of [/\bagents\s*:/i, /<code>agents<\/code>/i, /"agents"\s*:/i]) {
    if (pattern.test(text[key])) failures.push(`${files[key]}: contains the retired Grok Bot field agents`);
  }
}

if (failures.length) {
  for (const failure of failures) console.error(`validate-public-docs: ${failure}`);
  process.exit(1);
}

console.log("validate-public-docs: repository and website claims are aligned");
