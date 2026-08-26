import { Suspense } from "react";
import Link from "next/link";
import { FooterNav, FooterNavFallback } from "@/components/FooterNav";
import { GrokLogomark } from "@/components/icons/GrokLogomark";
import { WingsMark } from "@/components/WingsMark";
import { en } from "@/lib/messages/en";
import { site } from "@/lib/site";

/*
 * Two panes. Who this is on the left, where to go on the right.
 *
 * The left pane is identity: the mark, the name, and the legal line that
 * has to travel with them. The Grok credit sits at the bottom of that
 * pane with real space above it, because it is a credit and not part of
 * our lockup. It is never beside the mark and never inside a badge.
 *
 * The right pane is the map: what you can browse, what you can read
 * against, the company, and the rest of what Ellelion ships.
 *
 * Both marks are the owners' own artwork, unaltered. GitHub's Invertocat
 * takes --ink, which is exactly black on the light theme and white on the
 * dark one, so it is their published mark rather than a recolour.
 */

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer id="site-footer" className="site-foot" aria-label={en.footer.aria}>
      <div className="foot-inner">
        <div className="foot-panes">
          <div className="foot-identity">
            <Link href="/" className="foot-id" aria-label={en.nav.homeAria}>
              <WingsMark size={40} layoutSize={22} />
              <span className="foot-id-name">{en.wordmark}</span>
            </Link>
            <p className="foot-legal">
              © {year} {site.company}. {en.footer.mit}. {en.footer.operated} {site.company}.
            </p>
          </div>

          <Suspense fallback={<FooterNavFallback />}>
            <FooterNav />
          </Suspense>
        </div>
        <div className="foot-meta">
          <p className="foot-meta-note">{en.footer.notAffiliated}</p>
          <div className="foot-badges" aria-label="Directory listings">
            {/* Findly verifies this listing-specific embed in the public footer. */}
            <a
              href="https://findly.tools/botteams-ai?utm_source=botteams-ai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Featured on Findly.tools. ${en.nav.opensNew}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- the directory verifier requires its exact remote badge image */}
              <img
                src="https://findly.tools/badges/findly-tools-badge-light.svg"
                alt="Featured on Findly.tools"
                width="175"
                height="55"
              />
            </a>
            {/* Acid Tools verifies this exact listing link and remote badge image. */}
            <a
              href="https://acidtools.com/ai/botteams"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Listed on Acid Tools. ${en.nav.opensNew}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- the directory verifier requires its exact remote badge image */}
              <img
                src="https://acidtools.com/assets/images/badge.png"
                alt="Acid Tools"
                width="175"
                height="54"
                loading="lazy"
              />
            </a>
            {/* AI Tech Viral verifies this exact listing link and remote badge image. */}
            <a
              href="https://aitechviral.com/ai/botteams"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Listed on AI Tech Viral. ${en.nav.opensNew}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- the directory verifier requires its exact remote badge image */}
              <img
                src="https://aitechviral.com/assets/images/badge.png"
                alt="AI Tech Viral"
                width="192"
                height="54"
                loading="lazy"
              />
            </a>
            {/* AIBestTop verifies this exact homepage backlink for its free listing. */}
            <a
              href="https://aibesttop.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Listed on AIBestTop. ${en.nav.opensNew}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- the directory verifier requires its exact remote badge image */}
              <img
                src="https://aibesttop.com/badges/light.svg"
                alt="Listed on AIBestTop"
                width="120"
                height="40"
                loading="lazy"
              />
            </a>
            {/* NewTool verifies this listing-specific backlink for its free plan. */}
            <a
              href="https://newtool.site/item/botteamsai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Featured on NewTool.site. ${en.nav.opensNew}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- the directory verifier requires its exact remote badge image */}
              <img
                src="https://newtool.site/badges/newtool-light.svg"
                alt="Featured on NewTool.site"
                height="54"
                loading="lazy"
              />
            </a>
            {/* DeepLaunch verifies this exact static footer backlink for free listings. */}
            <a
              href="https://deeplaunch.io"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Featured on DeepLaunch.io. ${en.nav.opensNew}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- the directory verifier requires its exact remote badge image */}
              <img
                src="https://deeplaunch.io/badge/badge_transparent.svg"
                alt="Featured on DeepLaunch.io"
                width="200"
                height="54"
                loading="lazy"
              />
            </a>
            {/* DodoDirectory requires this exact static badge for its free listing. */}
            <a
              href="https://dododirectory.com"
              target="_blank"
              rel="dofollow"
              aria-label={`Featured on DodoDirectory. ${en.nav.opensNew}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- the directory verifier requires its exact remote badge image */}
              <img
                src="https://dododirectory.com/badge-light.png"
                alt="Featured on DodoDirectory"
                width="200"
                height="54"
                loading="lazy"
              />
            </a>
            {/* DevTool.io verifies this exact static linked badge for free listings. */}
            <a
              href="https://devtool.io"
              target="_blank"
              rel="noopener"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                background: "#10b981",
                color: "#fff",
                borderRadius: "6px",
                textDecoration: "none",
                fontFamily: "sans-serif",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Listed on DevTool.io
            </a>
            {/* Dofollow.Tools verifies this exact static footer badge for free submissions. */}
            <a
              href="https://dofollow.tools"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Featured on Dofollow.Tools. ${en.nav.opensNew}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- the directory verifier requires its exact remote badge image */}
              <img
                src="https://dofollow.tools/badge/badge_dark.svg"
                alt="Featured on Dofollow.Tools"
                width="200"
                height="54"
                loading="lazy"
              />
            </a>
            {/* MarketingDB requires this exact static linked badge for its free listing. */}
            <a
              href="https://marketingdb.live"
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- the directory verifier requires its exact remote badge image */}
              <img
                src="https://marketingdb.live/badge.svg"
                alt="Listed on MarketingDB"
                width="190"
                height="44"
              />
            </a>
          </div>
          {/* Credit at the bottom of the footer, well clear of the mark. */}
          <a
            className="foot-grok"
            href={site.grokHome}
            rel="nofollow noopener noreferrer"
            target="_blank"
            aria-label={`${en.footer.createdWithGrok}. ${en.nav.opensNew}`}
          >
            <GrokLogomark className="foot-mark-grok" />
            <span className="foot-mark-text">{en.footer.createdWithGrok}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
