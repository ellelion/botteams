import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { houseSlots, type SponsorSlot } from "../src/data/sponsors";
import {
  interleaveListingRows,
  isFilledSponsor,
  isHouseUpsellOnly,
  listingChromeSlots,
} from "../src/lib/listing-sponsors";
import { listBots, listTeams } from "../src/lib/teams";
import { en } from "../src/lib/messages/en";
import { MAIN_NAV } from "../src/lib/nav";

const paid: SponsorSlot = {
  id: "paid-acme",
  name: "Acme Tools",
  line: "A paid listing.",
  href: "https://example.com/acme",
};

describe("listing sponsor chrome", () => {
  it("treats nameless rows as unfilled", () => {
    assert.equal(isFilledSponsor({ id: "empty" }), false);
    assert.equal(isFilledSponsor(paid), true);
    assert.equal(isFilledSponsor(houseSlots[0]), true);
  });

  it("hides house-only inventory as upsell", () => {
    assert.equal(isHouseUpsellOnly([]), true);
    assert.equal(isHouseUpsellOnly(houseSlots), true);
    assert.deepEqual(listingChromeSlots([]), []);
    assert.deepEqual(listingChromeSlots(houseSlots), []);
  });

  it("keeps a paid filled slot, and house rows once a paid slot exists", () => {
    assert.deepEqual(listingChromeSlots([paid]), [paid]);
    const mixed = listingChromeSlots([...houseSlots, paid]);
    assert.equal(mixed.some((slot) => slot.id === paid.id), true);
    assert.equal(mixed.some((slot) => slot.id === "skillselion"), true);
  });

  it("lists 15 teams with no sponsor rows when nothing is filled", () => {
    const teams = listTeams();
    assert.equal(teams.length, 15);
    const rows = interleaveListingRows(teams, houseSlots);
    assert.equal(rows.length, 15);
    assert.equal(rows.every((row) => row.kind === "team"), true);
    assert.equal(
      rows.filter((row) => row.kind === "ad").length,
      0,
    );
  });

  it("lists 60 bots with no sponsor rows when nothing is filled", () => {
    const bots = listBots();
    assert.equal(bots.length, 60);
    const rows = interleaveListingRows(bots, []);
    assert.equal(rows.length, 60);
    assert.equal(rows.every((row) => row.kind === "team"), true);
  });

  it("interleaves a filled sponsor every 7 rows and never inserts an empty slot", () => {
    const teams = listTeams();
    const rows = interleaveListingRows(teams, [paid]);
    const ads = rows.filter((row) => row.kind === "ad");
    const names = rows.map((row) => (row.kind === "team" ? row.team.slug : row.slot.name));
    assert.equal(ads.length, 2);
    assert.equal(ads.every((row) => row.kind === "ad" && row.slot.id === paid.id), true);
    assert.equal(names.includes("Put your listing here"), false);
    assert.equal(names.includes(en.sponsor.putListing), false);
    assert.equal(rows[7]?.kind, "ad");
    assert.equal(rows[15]?.kind, "ad");
  });

  it("keeps the /sponsor buy page off public chrome", () => {
    assert.equal(existsSync("src/app/sponsor/page.tsx"), true);
    assert.equal(existsSync("src/app/sponsor/setup/page.tsx"), true);
    assert.equal(MAIN_NAV.some((item) => item.href === "/sponsor"), false);
    assert.equal(readFileSync("src/components/FooterNav.tsx", "utf8").includes('href: "/sponsor"'), false);
    assert.equal(en.nav.sponsor, "Sponsor");
  });
});
