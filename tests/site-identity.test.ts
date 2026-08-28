import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SCHEMA_URL, site } from "@/lib/site";

describe("public site identity", () => {
  it("uses botteams.io as the canonical name and URL", () => {
    assert.equal(site.name, "botteams.io");
    assert.equal(site.url, "https://botteams.io");
    assert.equal(SCHEMA_URL, "https://botteams.io/schema/team.schema.json");
    assert.match(site.title, /botteams\.io/);
    assert.match(site.entity, /botteams\.io/);
    assert.doesNotMatch(site.name, /botteams\.ai/);
    assert.doesNotMatch(site.url, /botteams\.ai/);
  });

  it("uses the public X handle @botteams_bot", () => {
    assert.equal(site.xHandle, "@botteams_bot");
    assert.equal(site.xUrl, "https://x.com/botteams_bot");
    assert.doesNotMatch(site.xHandle, /Botteams_ai/i);
    assert.doesNotMatch(site.xUrl, /Botteams_ai/i);
  });

  it("does not introduce a Grok-in-domain public name", () => {
    assert.doesNotMatch(site.name, /grok/i);
    assert.doesNotMatch(site.url, /grok/i);
  });
});
