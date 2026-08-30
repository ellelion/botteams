import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const HREFS = [
  "https://findly.tools/botteams-ai?utm_source=botteams-ai",
  "https://acidtools.com/ai/botteams",
  "https://aitechviral.com/ai/botteams",
  "https://aibesttop.com",
  "https://newtool.site/item/botteamsai",
  "https://deeplaunch.io",
  "https://dododirectory.com",
  "https://devtool.io",
  "https://dofollow.tools",
  "https://marketingdb.live",
  "https://nicklaunches.com/products/botteams-ai/?utm_source=botteams.io&utm_medium=badge&utm_campaign=featured",
];

describe("footer directory badges", () => {
  const footer = readFileSync("src/components/SiteFooter.tsx", "utf8");
  const css = readFileSync("src/app/globals.css", "utf8");

  it("keeps every directory href in the footer markup", () => {
    for (const href of HREFS) {
      assert.equal(footer.includes(`href="${href}"`), true, href);
    }
    assert.equal((footer.match(/className="foot-badges"/g) ?? []).length, 1);
  });

  it("clips the strip instead of deleting it or using display:none", () => {
    const start = css.indexOf(".foot-badges {");
    assert.ok(start >= 0);
    const block = css.slice(start, start + 500);
    assert.match(block, /clip:\s*rect\(0,\s*0,\s*0,\s*0\)/);
    assert.equal(/display:\s*none/.test(block), false);
    assert.equal(/height:\s*20px/.test(block), false);
    assert.match(footer, /notAffiliated/);
    assert.match(footer, /createdWithGrok/);
  });
});
