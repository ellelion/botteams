import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveConnector } from "../src/lib/connectors";
import {
  RETIRED_TEAM_SLUGS,
  RETIRED_TEAM_SUCCESSORS,
  TEAM_CATALOG_KEEPERS,
  retiredTeamDestination,
  retiredTeamRedirects,
} from "../src/data/retired-teams";
import { allApiBots, allApiTeams } from "../src/lib/api-teams";
import { listBots, listTeams } from "../src/lib/teams";

describe("catalog cut", () => {
  it("keeps exactly the 15 surviving team slugs", () => {
    const slugs = listTeams().map((team) => team.slug).sort();
    assert.deepEqual(slugs, [...TEAM_CATALOG_KEEPERS]);
    assert.equal(slugs.length, 15);
  });

  it("leaves the 60 solo Bots in place", () => {
    assert.equal(listBots().length, 60);
  });

  it("gives every team one listing bullet per Bot", () => {
    for (const team of listTeams()) {
      assert.equal(team.bullets.length, team.botRoster.length, team.slug);
      for (const line of team.bullets) {
        assert.match(line, /\S/, `${team.slug} empty bullet`);
        assert.equal(line.includes("\u2014") || line.includes("\u2013"), false, `${team.slug} dash in "${line}"`);
      }
    }
  });

  it("exposes those bullets on the public team API", () => {
    const company = allApiTeams().find((team) => team.slug === "company");
    assert.ok(company);
    assert.equal(company.bullets.length, 6);
    assert.equal(company.tagline, "Six Bots run a solo company week.");
    const bots = allApiBots();
    assert.equal(bots.length, 60);
    for (const bot of bots) {
      assert.ok(bot.bullets.length >= 1, bot.slug);
      assert.ok(bot.bullets.length <= 1, bot.slug);
    }
  });

  it("snapshots API collection sizes to the same counts", () => {
    assert.equal(allApiTeams().length, 15);
    assert.equal(allApiBots().length, 60);
  });

  it("gives every team room a name ending in group chat", () => {
    for (const team of listTeams()) {
      for (const room of team.rooms) {
        assert.match(room.name, /group chat$/, `${team.slug} room "${room.name}"`);
      }
    }
  });

  it("redirects every retired slug and never a keeper", () => {
    const keepers = new Set<string>(TEAM_CATALOG_KEEPERS);
    const retired = new Set<string>(RETIRED_TEAM_SLUGS);
    assert.equal(retired.size, 125);
    for (const slug of keepers) {
      assert.equal(retired.has(slug), false, `keeper ${slug} is also retired`);
    }
    for (const [slug, dest] of Object.entries(RETIRED_TEAM_SUCCESSORS)) {
      assert.equal(retired.has(slug), true, `successor map has unknown slug ${slug}`);
      assert.match(dest, /^\/teams\/[a-z0-9-]+$/);
      const destSlug = dest.slice("/teams/".length);
      assert.equal(keepers.has(destSlug), true, `successor ${dest} is not a keeper`);
    }
    const redirects = retiredTeamRedirects();
    assert.equal(redirects.length, 125);
    assert.equal(retiredTeamDestination("content-seo"), "/teams/content-rank-desk");
    assert.equal(retiredTeamDestination("engineering-oncall"), "/teams/engineering-release");
    assert.equal(retiredTeamDestination("agency"), "/");
    assert.deepEqual(
      redirects.find((row) => row.source === "/teams/content-seo"),
      { source: "/teams/content-seo", destination: "/teams/content-rank-desk", permanent: true },
    );
  });

  it("resolves X to the X connector, not X Ads", () => {
    assert.equal(resolveConnector("X").slug, "x");
    assert.equal(resolveConnector("X Ads").slug, "x-ads");
  });
});
