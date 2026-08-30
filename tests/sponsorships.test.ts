import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { houseSlots } from "../src/data/sponsors";
import { sponsorshipsEnabled } from "../src/lib/flags";
import { LISTING_AD_EVERY, LISTING_SLOT_EVERY, listingRows } from "../src/lib/listing-rows";
import { listBots, listTeams } from "../src/lib/teams";
import { en } from "../src/lib/messages/en";

function withSponsorshipsEnv<T>(value: string | undefined, run: () => T): T {
  const prev = process.env.NEXT_PUBLIC_SPONSORSHIPS;
  if (value === undefined) delete process.env.NEXT_PUBLIC_SPONSORSHIPS;
  else process.env.NEXT_PUBLIC_SPONSORSHIPS = value;
  try {
    return run();
  } finally {
    if (prev === undefined) delete process.env.NEXT_PUBLIC_SPONSORSHIPS;
    else process.env.NEXT_PUBLIC_SPONSORSHIPS = prev;
  }
}

describe("sponsorships flag", () => {
  it("defaults off when NEXT_PUBLIC_SPONSORSHIPS is unset", () => {
    withSponsorshipsEnv(undefined, () => {
      assert.equal(sponsorshipsEnabled(), false);
    });
  });

  it("turns on for 1 or true and stays off for other values", () => {
    withSponsorshipsEnv("1", () => assert.equal(sponsorshipsEnabled(), true));
    withSponsorshipsEnv("true", () => assert.equal(sponsorshipsEnabled(), true));
    withSponsorshipsEnv("TRUE", () => assert.equal(sponsorshipsEnabled(), true));
    withSponsorshipsEnv("0", () => assert.equal(sponsorshipsEnabled(), false));
    withSponsorshipsEnv("false", () => assert.equal(sponsorshipsEnabled(), false));
    withSponsorshipsEnv("", () => assert.equal(sponsorshipsEnabled(), false));
  });
});

describe("listing rows without sponsorship chrome", () => {
  it("keeps the catalog snapshot of 15 teams and 60 bots", () => {
    assert.equal(listTeams().length, 15);
    assert.equal(listBots().length, 60);
  });

  it("does not insert sponsor rows when the flag is off", () => {
    const teams = [...listTeams(), ...listBots()];
    const rows = listingRows(teams, houseSlots, false);
    assert.equal(rows.length, teams.length);
    assert.equal(rows.every((row) => row.kind === "team"), true);
    assert.deepEqual(
      rows.map((row) => (row.kind === "team" ? row.team.slug : "")),
      teams.map((team) => team.slug),
    );
    const serialized = JSON.stringify(rows);
    assert.doesNotMatch(serialized, new RegExp(en.sponsor.putListing));
    assert.doesNotMatch(serialized, new RegExp(en.sponsor.listingKicker));
    assert.doesNotMatch(serialized, /index-ad|idx-ad/);
  });

  it("restores in-list ads and open slots when the flag is on", () => {
    const teams = [...listTeams(), ...listBots()];
    const rows = listingRows(teams, houseSlots, true);
    assert.ok(rows.length > teams.length);
    assert.ok(rows.some((row) => row.kind === "ad"));
    assert.ok(rows.some((row) => row.kind === "slot"));
    const ads = rows.filter((row) => row.kind === "ad");
    const slots = rows.filter((row) => row.kind === "slot");
    const expectedSlots = Math.floor(teams.length / LISTING_SLOT_EVERY);
    const expectedAds = Math.floor(teams.length / LISTING_AD_EVERY) - expectedSlots;
    assert.equal(slots.length, expectedSlots);
    assert.equal(ads.length, expectedAds);
    assert.equal(rows.filter((row) => row.kind === "team").length, teams.length);
  });
});

describe("sponsorship render gates", () => {
  it("checks the flag before listing and rail chrome render", async () => {
    const teamIndex = await readFile("src/components/home/TeamIndex.tsx", "utf8");
    const rails = await readFile("src/components/PageWithRails.tsx", "utf8");
    const ticker = await readFile("src/components/SponsorTicker.tsx", "utf8");
    const rail = await readFile("src/components/SponsorRail.tsx", "utf8");
    assert.match(teamIndex, /SPONSORSHIPS/);
    assert.match(teamIndex, /listingRows/);
    assert.doesNotMatch(teamIndex, /interleaveAds\(/);
    assert.match(rails, /SPONSORSHIPS \?/);
    assert.match(ticker, /if \(!SPONSORSHIPS\) return null/);
    assert.match(rail, /if \(!SPONSORSHIPS\) return null/);
  });
});
