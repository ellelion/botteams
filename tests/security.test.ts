import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { setBoundedCache } from "../src/lib/bounded-cache";
import { deterministicRejects, HREF_MAX, urlReject } from "../src/lib/rail-review";
import { detectMarkType } from "../src/lib/rail-upload";

describe("sponsor input security", () => {
  it("detects allowed image formats from bytes", () => {
    assert.deepEqual(
      detectMarkType(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
      { mediaType: "image/png", extension: "png" },
    );
    assert.deepEqual(detectMarkType(new Uint8Array([0xff, 0xd8, 0xff])), {
      mediaType: "image/jpeg",
      extension: "jpg",
    });
    assert.deepEqual(
      detectMarkType(new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50])),
      { mediaType: "image/webp", extension: "webp" },
    );
  });

  it("rejects SVG and executable-looking input regardless of filename", () => {
    assert.equal(detectMarkType(new TextEncoder().encode("<svg><script>alert(1)</script></svg>")), null);
  });

  it("rejects non-web and oversized destination URLs", () => {
    assert.equal(urlReject("file:///etc/passwd"), "bad_url");
    assert.equal(urlReject(`https://example.com/${"a".repeat(HREF_MAX)}`), "bad_url");
    assert.deepEqual(
      deterministicRejects(
        { title: "Tool", line: "Useful agent tool", href: `https://example.com/${"a".repeat(HREF_MAX)}` },
        true,
      ),
      ["bad_url"],
    );
  });
});

describe("bounded proxy cache", () => {
  it("evicts the oldest key when it reaches its limit", () => {
    const cache = new Map<string, number>();
    setBoundedCache(cache, "one", 1, 2);
    setBoundedCache(cache, "two", 2, 2);
    setBoundedCache(cache, "three", 3, 2);
    assert.deepEqual([...cache.entries()], [["two", 2], ["three", 3]]);
  });
});
