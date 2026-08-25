"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { en } from "@/lib/messages/en";
import { isFooterCurrent } from "@/lib/nav";
import { site } from "@/lib/site";

type Item = { label: string; href: string; external?: boolean };

function Column({
  title,
  items,
  pathname,
  kind,
}: {
  title: string;
  items: Item[];
  pathname?: string | null;
  kind?: string | null;
}) {
  return (
    <div className="foot-col">
      <h2 className="foot-col-title">{title}</h2>
      <ul>
        {items.map((item) => {
          if (item.external) {
            return (
              <li key={item.href}>
                <a className="foot-link" href={item.href} rel="nofollow noopener noreferrer" target="_blank" aria-label={`${item.label}. ${en.nav.opensNew}`}>
                  {item.label}
                </a>
              </li>
            );
          }
          const current = pathname != null && isFooterCurrent(item.href, pathname, kind ?? null);
          return (
            <li key={item.href}>
              <Link className="foot-link" href={item.href} aria-current={current ? "page" : undefined}>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function FooterNavInner({
  pathname,
  kind,
}: {
  pathname?: string | null;
  kind?: string | null;
}) {
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
  const aboutCurrent = pathname != null && isFooterCurrent("/about", pathname, kind ?? null);
  const termsCurrent = pathname != null && isFooterCurrent("/terms", pathname, kind ?? null);
  const privacyCurrent = pathname != null && isFooterCurrent("/privacy", pathname, kind ?? null);

  return (
    <div className="foot-cols">
      <Column title={en.footer.product} items={product} pathname={pathname} kind={kind} />
      <Column title={en.footer.docs} items={docs} pathname={pathname} kind={kind} />

      <div className="foot-col">
        <h2 className="foot-col-title">{en.footer.company}</h2>
        <ul>
          <li>
            <Link className="foot-link" href="/about" aria-current={aboutCurrent ? "page" : undefined}>
              {en.footer.about}
            </Link>
          </li>
          <li>
            {/* Social-button use of the Invertocat, per github.com/logos:
                the published mark beside the word, never recoloured
                and never locked up with our own mark. */}
            <a className="foot-link" href={site.github} rel="noopener noreferrer" target="_blank" aria-label={`${en.footer.github}. ${en.nav.opensNew}`}>
              <GitHubIcon className="foot-mark h-4 w-4" />
              {en.footer.github}
            </a>
          </li>
          <li>
            <Link className="foot-link" href="/terms" aria-current={termsCurrent ? "page" : undefined}>
              {en.footer.terms}
            </Link>
          </li>
          <li>
            <Link className="foot-link" href="/privacy" aria-current={privacyCurrent ? "page" : undefined}>
              {en.footer.privacy}
            </Link>
          </li>
          <li><a className="foot-link" href={`mailto:${site.email}`}>{site.email}</a></li>
        </ul>
      </div>

      <div className="foot-col">
        <h2 className="foot-col-title">{en.footer.ellelion}</h2>
        <ul>
          {site.ellelionSites.map((product) => (
            <li key={product.href}>
              <a className="foot-link" href={product.href} rel="nofollow noopener noreferrer" target="_blank" aria-label={`${product.name}. ${en.nav.opensNew}`}>
                {product.name}
                <ExternalLinkIcon className="foot-out" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function FooterNavFallback() {
  return <FooterNavInner />;
}

export function FooterNav() {
  const pathname = usePathname();
  const kind = useSearchParams().get("kind");
  return <FooterNavInner pathname={pathname} kind={kind} />;
}
