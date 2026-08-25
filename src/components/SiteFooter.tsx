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
    <footer className="site-foot" aria-label={en.footer.aria}>
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
