import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { listingBullets } from "../src/lib/listing-lede";

describe("listingBullets", () => {
  it("uses the schema list when present", () => {
    assert.deepEqual(
      listingBullets({ kind: "team", tagline: "One line job.", bullets: ["Product holds the list", "Money reads Stripe"] }),
      ["Product holds the list", "Money reads Stripe"],
    );
  });

  it("falls back to a single tagline item for a solo Bot with no list", () => {
    assert.deepEqual(
      listingBullets({ kind: "bot", tagline: "Drafts the reply. Never sends.", bullets: [] }),
      ["Drafts the reply. Never sends."],
    );
  });
});
