import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const matter = require("gray-matter");

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const packsDir = path.join(root, "packs");
const REQUIRED = ["slug", "name", "tagline", "seats", "section", "status", "connectors", "agents", "rooms", "routines"];

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
  if (typeof data.seats !== "number") fail(file + ": seats must be a number");
  if (data.status !== "pack" && data.status !== "example") fail(file + ": status must be pack or example");
  if (!Array.isArray(data.connectors)) fail(file + ": connectors must be an array");
  if (!Array.isArray(data.agents) || data.agents.length === 0) fail(file + ": agents must be a non-empty array");
  else data.agents.forEach((agent, i) => {
    if (!isNonEmptyString(agent?.name) || !isNonEmptyString(agent?.persona)) fail(file + ": agents[" + i + "] needs name and persona");
  });
  if (!Array.isArray(data.rooms) || data.rooms.length === 0) fail(file + ": rooms must be a non-empty array");
  else data.rooms.forEach((room, i) => {
    if (!isNonEmptyString(room?.name) || !Array.isArray(room?.members)) fail(file + ": rooms[" + i + "] needs name and members[]");
    else if (room.members.length > 6) fail(file + ": rooms[" + i + "] exceeds the 6-seat cap");
  });
  if (!Array.isArray(data.routines) || data.routines.length === 0) fail(file + ": routines must be a non-empty array");
  else data.routines.forEach((routine, i) => {
    if (!isNonEmptyString(routine?.name) || !isNonEmptyString(routine?.owner) || !isNonEmptyString(routine?.schedule) || !isNonEmptyString(routine?.prompt)) {
      fail(file + ": routines[" + i + "] needs name, owner, schedule, prompt");
    }
  });
  if (data.skills !== undefined && !Array.isArray(data.skills)) fail(file + ": skills must be an array when present");
}

if (process.exitCode) process.exit(process.exitCode);
console.log("validate-packs: " + files.length + " packs ok");
