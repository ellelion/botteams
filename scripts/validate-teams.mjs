import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const matter = require("gray-matter");

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const teamsDir = path.join(root, "teams");
const REQUIRED = ["slug", "name", "tagline", "section", "status", "connectors", "agents", "rooms", "routines"];

/* Closed category list. A team file may only use a section that already
   exists, so the index chips and the API `category` filter stay a known
   set instead of growing a typo into a new category. Add here first. */
const CATEGORIES = new Set([
  "Agency", "Bookkeeping", "Community", "Content", "Creator", "Customer success",
  "Data", "Design", "Engineering", "Events", "Founder OS", "Helpdesk", "Hiring",
  "Infrastructure", "Investor updates", "Knowledge", "Legal", "Onboarding",
  "Partnerships", "Product", "Recruiting", "Research", "Revenue", "Sales",
  "Support", "Workplace",
  /* Gallery categories, kept exactly as xAI spells them so a From xAI
     recipe files where its source filed it. */
  "General", "Customer Success & Support", "Recruiting & People",
  "Operations & Finance", "Life & Leverage", "Marketing",
]);

const seenSlugs = new Set();
const seenUrls = new Set();
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

function fail(message) {
  console.error("validate-teams: " + message);
  process.exitCode = 1;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

const files = fs.readdirSync(teamsDir).filter((file) => file.endsWith(".md")).sort();
if (files.length === 0) fail("no teams/*.md files");

for (const file of files) {
  const raw = fs.readFileSync(path.join(teamsDir, file), "utf8");
  let parsed;
  try { parsed = matter(raw); } catch (error) {
    fail(file + ": " + (error instanceof Error ? error.message : String(error)));
    continue;
  }
  const data = parsed.data;
  const slug = path.basename(file, ".md");
  for (const key of REQUIRED) {
    if (data[key] === undefined || data[key] === null || data[key] === "") fail(file + ": missing " + key);
  }
  if (data.slug !== slug) fail(file + ": slug must equal filename (" + slug + ")");
  if (!/^[a-z0-9-]+$/.test(slug)) fail(file + ": slug must be lowercase alphanumeric and dashes");
  if (seenSlugs.has(slug)) fail(file + ": duplicate slug " + slug);
  seenSlugs.add(slug);
  if (typeof data.section === "string" && !CATEGORIES.has(data.section)) {
    fail(file + ': unknown category "' + data.section + '". Add it to CATEGORIES in this script first.');
  }
  const bots = typeof data.bots === "number" ? data.bots : data.seats;
  if (typeof bots !== "number") fail(file + ": bots must be a number");
  if (data.seats !== undefined && data.bots === undefined) fail(file + ": rename seats to bots");
  const status = data.status === "team" ? "team" : data.status;
  if (status !== "team" && status !== "example") fail(file + ": status must be team or example");
  if (!Array.isArray(data.connectors)) fail(file + ": connectors must be an array");
  const teamConnectors = new Set((data.connectors || []).map((name) => String(name)));
  if (!Array.isArray(data.agents) || data.agents.length === 0) fail(file + ": agents must be a non-empty array");
  else {
    if (data.agents.length !== bots) fail(file + ": bots count must equal agents length");
    data.agents.forEach((agent, i) => {
      if (!isNonEmptyString(agent?.name) || !isNonEmptyString(agent?.persona)) fail(file + ": agents[" + i + "] needs name and persona");
      if (agent.connectors !== undefined) {
        if (!Array.isArray(agent.connectors)) fail(file + ": agents[" + i + "].connectors must be an array");
        else agent.connectors.forEach((name) => {
          if (!teamConnectors.has(name)) fail(file + ": agents[" + i + "] connector \"" + name + "\" is not in team connectors");
        });
      }
    });
  }
  /* Empty is legal: a one-Bot recipe has nobody to talk to. It just is
     not Verified, which the rule assertions at the bottom pin down. */
  if (!Array.isArray(data.rooms)) fail(file + ": rooms must be an array");
  else data.rooms.forEach((room, i) => {
    if (!isNonEmptyString(room?.name) || !Array.isArray(room?.members)) fail(file + ": rooms[" + i + "] needs name and members[]");
    else if (room.members.length < 2 || room.members.length > 6) fail(file + ": rooms[" + i + "] must have two to six Bots");
  });
  if (!Array.isArray(data.routines)) fail(file + ": routines must be an array");
  else data.routines.forEach((routine, i) => {
    if (!isNonEmptyString(routine?.name) || !isNonEmptyString(routine?.owner) || !isNonEmptyString(routine?.schedule) || !isNonEmptyString(routine?.prompt)) {
      fail(file + ": routines[" + i + "] needs name, owner, schedule, prompt");
    }
  });
  if (data.skills !== undefined && !Array.isArray(data.skills)) fail(file + ": skills must be an array when present");
  if (data.from_xai !== undefined && data.from_xai !== true) fail(file + ": from_xai must be true when present, or absent");

  // Optional attribution. Present means it must be well formed.
  if (data.added_at !== undefined && !ISO.test(String(data.added_at))) {
    fail(file + ": added_at must be a quoted ISO 8601 UTC string, e.g. \"2026-08-21T09:00:00.000Z\"");
  }
  for (const key of ["contributor", "scouted_by"]) {
    if (data[key] !== undefined && !isNonEmptyString(data[key])) fail(file + ": " + key + " must be a non-empty string");
  }
  for (const key of ["contributor_url", "added_via", "url"]) {
    if (data[key] !== undefined && !/^https?:\/\//.test(String(data[key]))) {
      fail(file + ": " + key + " must be an absolute http(s) URL");
    }
  }
  if (data.url !== undefined) {
    const u = String(data.url);
    if (seenUrls.has(u)) fail(file + ": duplicate url " + u);
    seenUrls.add(u);
  }
  if (data.integration_urls !== undefined) {
    if (typeof data.integration_urls !== "object" || Array.isArray(data.integration_urls)) {
      fail(file + ": integration_urls must be a map of name to URL");
    } else {
      for (const [name, href] of Object.entries(data.integration_urls)) {
        if (!teamConnectors.has(name)) fail(file + ': integration_urls names "' + name + '" which is not a connector on this team');
        if (!/^https?:\/\//.test(String(href))) fail(file + ": integration_urls." + name + " must be an absolute URL");
      }
    }
  }
  /* Customize inputs. Chips belong to the team that ships them, so this
     checks shape, not content: a team with none is fine. */
  if (data.suggest !== undefined) {
    if (!Array.isArray(data.suggest)) fail(file + ": suggest must be an array");
    else for (const [i, chip] of data.suggest.entries()) {
      if (typeof chip === "string") { if (!chip.trim()) fail(file + ": suggest[" + i + "] is empty"); continue; }
      if (!chip || typeof chip !== "object") { fail(file + ": suggest[" + i + "] must be a string or a map"); continue; }
      if (!isNonEmptyString(chip.text)) fail(file + ": suggest[" + i + "].text is required");
      if (chip.on !== undefined && typeof chip.on !== "boolean") fail(file + ": suggest[" + i + "].on must be true or false");
      /* The retired nouns. Nothing in the tree says them any more, so this
         exists to stop one arriving through a pull request. */
      if (/\bpacks?\b|\bseats?\b/i.test(String(chip.text))) {
        fail(file + ": suggest[" + i + "] uses a retired noun. A row is a team and the unit is a Bot.");
      }
    }
  }
  if (data.connector_modes !== undefined) {
    if (typeof data.connector_modes !== "object" || Array.isArray(data.connector_modes)) {
      fail(file + ": connector_modes must be a map of connector to mode");
    } else {
      for (const [name, mode] of Object.entries(data.connector_modes)) {
        if (!teamConnectors.has(name)) fail(file + ': connector_modes names "' + name + '" which is not a connector on this team');
        if (!["read", "draft", "ask"].includes(mode)) fail(file + ": connector_modes." + name + " must be read, draft, or ask");
      }
    }
  }
}

/* Verified, asserted rather than described.
   A recipe is Verified only with at least one Bot, a matching bots count,
   at least one group chat, every group chat holding two to six Bots, and
   Bots plus group chats under the account cap of 50. An empty rooms list
   is NOT Verified: it makes no claim about a group chat at all. */
const MIN_ROOM = 2, MAX_ROOM = 6, ACCOUNT_CAP = 50;
function verifiedByRule(t) {
  if (!Array.isArray(t.agents) || t.agents.length === 0) return false;
  if (t.bots !== t.agents.length) return false;
  const rooms = Array.isArray(t.rooms) ? t.rooms : [];
  if (t.agents.length + rooms.length > ACCOUNT_CAP) return false;
  if (rooms.length === 0) return false;
  return rooms.every((r) => Array.isArray(r.members) && r.members.length >= MIN_ROOM && r.members.length <= MAX_ROOM);
}
for (const [name, team, expected] of [
  ["a solo Bot with no group chat", { agents: [{}], bots: 1, rooms: [] }, false],
  ["a group chat of one", { agents: [{}, {}], bots: 2, rooms: [{ members: ["a"] }] }, false],
  ["a group chat of seven", { agents: [{}], bots: 1, rooms: [{ members: "abcdefg".split("") }] }, false],
  ["a mismatched bots count", { agents: [{}, {}], bots: 3, rooms: [{ members: ["a", "b"] }] }, false],
  ["no Bots at all", { agents: [], bots: 0, rooms: [{ members: ["a", "b"] }] }, false],
  ["a two-Bot room", { agents: [{}, {}], bots: 2, rooms: [{ members: ["a", "b"] }] }, true],
  ["a six-Bot room", { agents: Array(6).fill({}), bots: 6, rooms: [{ members: "abcdef".split("") }] }, true],
]) {
  if (verifiedByRule(team) !== expected) {
    fail(`isVerified rule: ${name} should be ${expected ? "Verified" : "not Verified"}`);
  }
}

if (process.exitCode) process.exit(process.exitCode);
console.log("validate-teams: " + files.length + " teams ok");
