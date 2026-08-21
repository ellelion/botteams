import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const matter = require("gray-matter");

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const packsDir = path.join(root, "packs");
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
]);

const seenSlugs = new Set();
const seenUrls = new Set();
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

function fail(message) {
  console.error("validate-packs: " + message);
  process.exitCode = 1;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

const files = fs.readdirSync(packsDir).filter((file) => file.endsWith(".md")).sort();
if (files.length === 0) fail("no packs/*.md files");

for (const file of files) {
  const raw = fs.readFileSync(path.join(packsDir, file), "utf8");
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
  const status = data.status === "pack" ? "team" : data.status;
  if (status !== "team" && status !== "example") fail(file + ": status must be team or example");
  if (!Array.isArray(data.connectors)) fail(file + ": connectors must be an array");
  const packConnectors = new Set((data.connectors || []).map((name) => String(name)));
  if (!Array.isArray(data.agents) || data.agents.length === 0) fail(file + ": agents must be a non-empty array");
  else {
    if (data.agents.length !== bots) fail(file + ": bots count must equal agents length");
    data.agents.forEach((agent, i) => {
      if (!isNonEmptyString(agent?.name) || !isNonEmptyString(agent?.persona)) fail(file + ": agents[" + i + "] needs name and persona");
      if (agent.connectors !== undefined) {
        if (!Array.isArray(agent.connectors)) fail(file + ": agents[" + i + "].connectors must be an array");
        else agent.connectors.forEach((name) => {
          if (!packConnectors.has(name)) fail(file + ": agents[" + i + "] connector \"" + name + "\" is not in pack connectors");
        });
      }
    });
  }
  if (!Array.isArray(data.rooms) || data.rooms.length === 0) fail(file + ": rooms must be a non-empty array");
  else data.rooms.forEach((room, i) => {
    if (!isNonEmptyString(room?.name) || !Array.isArray(room?.members)) fail(file + ": rooms[" + i + "] needs name and members[]");
    else if (room.members.length < 2 || room.members.length > 6) fail(file + ": rooms[" + i + "] must have two to six Bots");
  });
  if (!Array.isArray(data.routines) || data.routines.length === 0) fail(file + ": routines must be a non-empty array");
  else data.routines.forEach((routine, i) => {
    if (!isNonEmptyString(routine?.name) || !isNonEmptyString(routine?.owner) || !isNonEmptyString(routine?.schedule) || !isNonEmptyString(routine?.prompt)) {
      fail(file + ": routines[" + i + "] needs name, owner, schedule, prompt");
    }
  });
  if (data.skills !== undefined && !Array.isArray(data.skills)) fail(file + ": skills must be an array when present");

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
        if (!packConnectors.has(name)) fail(file + ': integration_urls names "' + name + '" which is not a connector on this team');
        if (!/^https?:\/\//.test(String(href))) fail(file + ": integration_urls." + name + " must be an absolute URL");
      }
    }
  }
}

if (process.exitCode) process.exit(process.exitCode);
console.log("validate-packs: " + files.length + " packs ok");
