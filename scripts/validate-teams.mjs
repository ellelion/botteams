import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const Ajv2020 = require("ajv/dist/2020").default;
const matter = require("gray-matter");

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const teamsDir = path.join(root, "teams");
const botsDir = path.join(root, "bots");
const schemaPath = path.join(root, "public/schema/team.schema.json");
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const validateRecipe = new Ajv2020({ allErrors: true, strict: true }).compile(schema);

/* xAI documents a per-Bot cap of 50 routines, keeping the 20 most recent
   runs of each. Zero routines is fine. There is no documented team-level
   cap, so this script does not invent one. */
const MAX_ROUTINES_PER_BOT = 50;
const REQUIRED = ["slug", "name", "tagline", "section", "status", "kind", "connectors", "bot_roster", "routines"];

/* Closed category list. A team file may only use a section that already
   exists, so the index chips and the API `category` filter stay a known
   set instead of growing a typo into a new category. Add here first. */
const CATEGORIES = new Set(schema.properties.section.enum);

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

function schemaErrors(errors) {
  return (errors || []).map((error) => {
    const location = error.instancePath || "front matter";
    const extra = error.keyword === "additionalProperties"
      ? ` (${error.params.additionalProperty})`
      : "";
    return `${location} ${error.message}${extra}`;
  }).join("; ");
}

function listDir(dir, kind) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort().map((f) => ({ file: f, dir, kind }));
}
const samples = [
  { file: "sample-team.md", dir: path.join(root, "docs/examples"), kind: "team", sample: true },
  { file: "sample-bot.md", dir: path.join(root, "docs/examples"), kind: "bot", sample: true },
].filter((row) => fs.existsSync(path.join(row.dir, row.file)));

const entries = [...listDir(teamsDir, "team"), ...listDir(botsDir, "bot"), ...samples];
if (entries.length === 0) fail("no team or bot markdown files");

for (const { file, dir, kind: folderKind } of entries) {
  const raw = fs.readFileSync(path.join(dir, file), "utf8");
  let parsed;
  try { parsed = matter(raw); } catch (error) {
    fail(file + ": " + (error instanceof Error ? error.message : String(error)));
    continue;
  }
  const data = parsed.data;
  const slug = path.basename(file, ".md");
  if (!validateRecipe(data)) {
    fail(`${file}: schema: ${schemaErrors(validateRecipe.errors)}`);
  }
  for (const key of REQUIRED) {
    if (data[key] === undefined || data[key] === null || data[key] === "") fail(file + ": missing " + key);
  }
  if (data.slug !== slug) fail(file + ": slug must equal filename (" + slug + ")");
  if (!/^[a-z0-9-]+$/.test(slug)) fail(file + ": slug must be lowercase alphanumeric and dashes");
  if (seenSlugs.has(slug)) fail(file + ": duplicate slug " + slug);
  seenSlugs.add(slug);
  if (data.status !== "installable" && data.status !== "example") {
    fail(file + ": status must be installable or example");
  }
  /* The folder is the claim. A file whose kind disagrees with where it
     lives would be shelved under the wrong noun. */
  if (data.kind !== folderKind) {
    fail(file + ': kind must be "' + folderKind + '" for a file in ' + path.basename(dir) + "/");
  }
  if (typeof data.section === "string" && !CATEGORIES.has(data.section)) {
    fail(file + ': unknown category "' + data.section + '". Add it to CATEGORIES in this script first.');
  }
  const bots = typeof data.bots === "number" ? data.bots : data.seats;
  if (typeof bots !== "number") fail(file + ": bots must be a number");
  if (data.seats !== undefined && data.bots === undefined) fail(file + ": rename seats to bots");

  if (!Array.isArray(data.connectors)) fail(file + ": connectors must be an array");
  const teamConnectors = new Set((data.connectors || []).map((name) => String(name)));
  const botNames = new Set();
  if (!Array.isArray(data.bot_roster) || data.bot_roster.length === 0) fail(file + ": bot_roster must be a non-empty array");
  else {
    if (data.bot_roster.length !== bots) fail(file + ": bots count must equal bot_roster length");
    data.bot_roster.forEach((bot, i) => {
      if (!isNonEmptyString(bot?.name) || !isNonEmptyString(bot?.persona)) fail(file + ": bot_roster[" + i + "] needs name and persona");
      if (botNames.has(bot?.name)) fail(file + ': duplicate Bot name "' + bot.name + '"');
      if (isNonEmptyString(bot?.name)) botNames.add(bot.name);
      if (bot.brings !== undefined && !isNonEmptyString(bot.brings)) fail(file + ": bot_roster[" + i + "].brings must be a short sentence when set");
      if (bot.connectors !== undefined) {
        if (!Array.isArray(bot.connectors)) fail(file + ": bot_roster[" + i + "].connectors must be an array");
        else bot.connectors.forEach((name) => {
          if (!teamConnectors.has(name)) fail(file + ": bot_roster[" + i + "] connector \"" + name + "\" is not in team connectors");
        });
      }
    });
  }
  const rooms = data.rooms === undefined ? [] : data.rooms;
  if (!Array.isArray(rooms)) fail(file + ": rooms must be an array when present");
  else {
    const roomNames = new Set();
    rooms.forEach((room, i) => {
      if (!isNonEmptyString(room?.name) || !Array.isArray(room?.members)) fail(file + ": rooms[" + i + "] needs name and members[]");
      else {
        if (roomNames.has(room.name)) fail(file + ': duplicate room name "' + room.name + '"');
        roomNames.add(room.name);
        if (room.members.length < 2 || room.members.length > 6) fail(file + ": rooms[" + i + "] must have two to six Bots");
        for (const member of room.members) {
          if (!botNames.has(member)) fail(file + ': rooms[' + i + '] names unknown Bot "' + member + '"');
        }
      }
    });
    /* The two shapes, enforced. A bot with a group chat or a team without
       one is the bug this whole split exists to stop. */
    if (folderKind === "bot") {
      if (rooms.length > 0) fail(file + ": a bot has no group chat, so rooms must be empty or absent");
      if (bots !== 1) fail(file + ": a bot is one Bot, so bots must be 1");
      if (Array.isArray(data.bot_roster) && data.bot_roster.length !== 1) fail(file + ": a bot has exactly one Bot");
    } else if (rooms.length === 0) {
      fail(file + ": a team needs a group chat of two to six Bots");
    } else if (bots + rooms.length > 50) {
      fail(file + ": Bots plus group chats must stay within the account cap of 50");
    }
  }
  if (!Array.isArray(data.routines)) fail(file + ": routines must be an array");
  else {
    /* xAI's cap is per owning Bot, so count per owner rather than per
       file. Nothing documents a cap on the file as a whole. */
    const perOwner = new Map();
    const routineNames = new Set();
    for (const [i, routine] of data.routines.entries()) {
      const owner = String(routine?.owner ?? "");
      if (routineNames.has(routine?.name)) fail(file + ': duplicate routine name "' + routine.name + '"');
      if (isNonEmptyString(routine?.name)) routineNames.add(routine.name);
      if (isNonEmptyString(owner) && !botNames.has(owner)) fail(file + ': routines[' + i + '] names unknown owner "' + owner + '"');
      perOwner.set(owner, (perOwner.get(owner) ?? 0) + 1);
    }
    for (const [owner, n] of perOwner) {
      if (n > MAX_ROUTINES_PER_BOT) {
        fail(file + ': "' + owner + '" owns ' + n + " routines. A Bot can own at most " + MAX_ROUTINES_PER_BOT + ".");
      }
    }
  }
  if (Array.isArray(data.routines)) data.routines.forEach((routine, i) => {
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
  if (t.kind !== "team") return false;
  if (!Array.isArray(t.botRoster) || t.botRoster.length === 0) return false;
  if (t.bots !== t.botRoster.length) return false;
  const rooms = Array.isArray(t.rooms) ? t.rooms : [];
  if (t.botRoster.length + rooms.length > ACCOUNT_CAP) return false;
  if (rooms.length === 0) return false;
  return rooms.every((r) => Array.isArray(r.members) && r.members.length >= MIN_ROOM && r.members.length <= MAX_ROOM);
}
for (const [name, team, expected] of [
  ["a bot, whatever else is true", { kind: "bot", botRoster: [{}], bots: 1, rooms: [] }, false],
  ["a team with no group chat", { kind: "team", botRoster: [{}], bots: 1, rooms: [] }, false],
  ["a group chat of one", { kind: "team", botRoster: [{}, {}], bots: 2, rooms: [{ members: ["a"] }] }, false],
  ["a group chat of seven", { kind: "team", botRoster: [{}], bots: 1, rooms: [{ members: "abcdefg".split("") }] }, false],
  ["a mismatched bots count", { kind: "team", botRoster: [{}, {}], bots: 3, rooms: [{ members: ["a", "b"] }] }, false],
  ["no Bots at all", { kind: "team", botRoster: [], bots: 0, rooms: [{ members: ["a", "b"] }] }, false],
  ["a two-Bot room", { kind: "team", botRoster: [{}, {}], bots: 2, rooms: [{ members: ["a", "b"] }] }, true],
  ["a six-Bot room", { kind: "team", botRoster: Array(6).fill({}), bots: 6, rooms: [{ members: "abcdef".split("") }] }, true],
]) {
  if (verifiedByRule(team) !== expected) {
    fail(`isVerified rule: ${name} should be ${expected ? "Verified" : "not Verified"}`);
  }
}

if (process.exitCode) process.exit(process.exitCode);
const teamCount = entries.filter((e) => e.kind === "team" && !e.sample).length;
const botCount = entries.filter((e) => e.kind === "bot" && !e.sample).length;
console.log(`validate-teams: ${teamCount} teams and ${botCount} bots ok`);
