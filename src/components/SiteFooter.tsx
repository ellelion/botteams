import Link from "next/link";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
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
 * takes --ink, which is exactly black on the light theme and white on
 * the dark one, so it is their published mark rather than a recolour.
 */

type Item = { label: string; href: string; external?: boolean };

function Column({ title, items }: { title: string; items: Item[] }) {
  return (
    <div className="foot-col">
      <h2 className="foot-col-title">{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            {item.external ? (
              <a className="foot-link" href={item.href} rel="nofollow noopener noreferrer" target="_blank">
                {item.label}
              </a>
            ) : (
              <Link className="foot-link" href={item.href}>{item.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  const product: Item[] = [
    { label: en.footer.teams, href: "/" },
    { label: en.footer.bots, href: "/?kind=bot" },
    { label: en.footer.connectors, href: "/connectors" },
    { label: en.footer.sponsor, href: "/sponsor" },
  ];
  const docs: Item[] = [
    { label: en.footer.guide, href: "/grok-bot" },
    { label: en.footer.guides, href: "/guides" },
    { label: en.footer.spec, href: "/docs" },
    { label: en.footer.api, href: "/api" },
    { label: en.footer.apiBots, href: "/api/bots" },
    { label: en.footer.openapi, href: "/openapi.json" },
  ];

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

          <div className="foot-cols">
            <Column title={en.footer.product} items={product} />
            <Column title={en.footer.docs} items={docs} />

            <div className="foot-col">
              <h2 className="foot-col-title">{en.footer.company}</h2>
              <ul>
                <li><Link className="foot-link" href="/about">{en.footer.about}</Link></li>
                <li>
                  {/* Social-button use of the Invertocat, per github.com/logos:
                      the published mark beside the word, never recoloured
                      and never locked up with our own mark. */}
                  <a className="foot-link" href={site.github} rel="noopener noreferrer" target="_blank">
                    <GitHubIcon className="foot-mark h-4 w-4" />
                    {en.footer.github}
                  </a>
                </li>
                <li><Link className="foot-link" href="/terms">{en.footer.terms}</Link></li>
                <li><Link className="foot-link" href="/privacy">{en.footer.privacy}</Link></li>
                <li><a className="foot-link" href={`mailto:${site.email}`}>{site.email}</a></li>
              </ul>
            </div>

            <div className="foot-col">
              <h2 className="foot-col-title">{en.footer.ellelion}</h2>
              <ul>
                {site.ellelionSites.map((product) => (
                  <li key={product.href}>
                    {/* One icon, the same on all three. These are other
                        sites, not other brands to display. */}
                    <a className="foot-link" href={product.href} rel="nofollow noopener noreferrer" target="_blank">
                      {product.name}
                      <ExternalLinkIcon className="foot-out" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="foot-meta">
          <p className="foot-meta-note">{en.footer.notAffiliated}</p>
          {/* Credit at the bottom of the footer, well clear of the mark. */}
          <a
            className="foot-grok"
            href={site.grokHome}
            rel="nofollow noopener noreferrer"
            target="_blank"
          >
            <GrokLogomark className="foot-mark-grok" />
            <span className="foot-mark-text">{en.footer.createdWithGrok}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
