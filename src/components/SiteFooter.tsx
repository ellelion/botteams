import Link from "next/link";
import { en } from "@/lib/messages/en";
import { site } from "@/lib/site";

/*
 * One footer, every page.
 *
 * It was three centred lines, which read as a signature rather than a way
 * out of a page. Three columns give the site its own map: what you can
 * browse, what you can read against, and who runs it.
 *
 * Nothing here links to a page we do not have. No newsletter, no social
 * row, no Privacy or Terms pointing at a 404.
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
  const company: Item[] = [
    { label: en.footer.github, href: site.github, external: true },
    { label: site.email, href: `mailto:${site.email}` },
  ];

  return (
    <footer className="site-foot" aria-label={en.footer.aria}>
      <div className="foot-inner">
        <div className="foot-cols">
          <Column title={en.footer.product} items={product} />
          <Column title={en.footer.docs} items={docs} />
          <Column title={en.footer.company} items={company} />
          <div className="foot-col">
            <h2 className="foot-col-title">{en.footer.sisters}</h2>
            <ul>
              {site.sisters.map((sister) => (
                <li key={sister.href}>
                  <a className="foot-link" href={sister.href} rel="nofollow noopener noreferrer" target="_blank">
                    {sister.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="foot-legal">
          © {year} {site.company}. {en.footer.mit}. {en.footer.operated} {site.company}. {en.footer.notAffiliated}
        </p>
      </div>
    </footer>
  );
}
