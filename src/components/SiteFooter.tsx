import Link from "next/link";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { GrokLogomark } from "@/components/icons/GrokLogomark";
import { en } from "@/lib/messages/en";
import { site } from "@/lib/site";

/*
 * One footer, every page. This is the company, not a signature.
 *
 * Four columns: what you can browse, what you can read against, the
 * company itself, and the rest of what Ellelion ships. The company
 * column carries About, the repo, Terms, Privacy and the address,
 * because that is what a footer is for.
 *
 * An older comment here said this footer links to nothing we do not
 * have, and used that to rule out Terms and Privacy. The rule was
 * right, the conclusion was not: the answer was to write the pages.
 *
 * The mark row is two marks with real space between them so they never
 * read as one lockup. Both are the owners' own artwork, unaltered:
 * GitHub's Invertocat in its published black or white, and xAI's Grok
 * logomark with the one approved phrase beside it. Neither sits next to
 * WingsMark, neither is recoloured, and the company artwork that
 * shipped alongside the Grok files is not used anywhere on this site.
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
    { label: en.footer.teams, href: "/#teams" },
    { label: en.footer.bots, href: "/?kind=bot#teams" },
    { label: en.footer.connectors, href: "/connectors" },
    { label: en.footer.sponsor, href: "/sponsor" },
  ];
  const docs: Item[] = [
    { label: en.footer.spec, href: "/docs" },
    { label: en.footer.api, href: "/api" },
    { label: en.footer.apiBots, href: "/api/bots" },
    { label: en.footer.openapi, href: "/openapi.json" },
  ];

  return (
    <footer className="site-foot" aria-label={en.footer.aria}>
      <div className="foot-inner">
        <div className="foot-cols">
          <Column title={en.footer.product} items={product} />
          <Column title={en.footer.docs} items={docs} />

          <div className="foot-col">
            <h2 className="foot-col-title">{en.footer.company}</h2>
            <ul>
              <li><Link className="foot-link" href="/about">{en.footer.about}</Link></li>
              <li>
                {/* Social-button use of the Invertocat, per github.com/logos:
                    the published mark beside the word, black on light and
                    white on dark, never recoloured and never locked up
                    with our own mark. */}
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
                  <a className="foot-link" href={product.href} rel="nofollow noopener noreferrer" target="_blank">
                    {product.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="foot-marks" aria-label={en.footer.marksAria}>
          <a className="foot-markline" href={site.github} rel="noopener noreferrer" target="_blank" aria-label={en.footer.repoAria}>
            <GitHubIcon className="foot-mark h-[18px] w-[18px]" />
          </a>
          {/* Clear space is the gap class, not padding baked into the
              artwork. The words sit beside the mark, never touching it. */}
          <a className="foot-markline" href={site.grokHome} rel="nofollow noopener noreferrer" target="_blank">
            <GrokLogomark className="foot-mark-grok" />
            <span className="foot-mark-text">{en.footer.createdWithGrok}</span>
          </a>
        </div>

        <p className="foot-legal">
          © {year} {site.company}. {en.footer.mit}. {en.footer.operated} {site.company}. {en.footer.notAffiliated}
        </p>
      </div>
    </footer>
  );
}
