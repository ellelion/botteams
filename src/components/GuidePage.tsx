import type { ReactNode } from "react";
import Link from "next/link";
import { WingsHero, WingsSplit } from "@/components/WingsSplit";
import { ledger } from "@/lib/ledger-theme";
import type { Guide, GuideBlock } from "@/lib/guide-types";
import { guideUpdated, guideUrl, guidesIndexUrl } from "@/lib/guides";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="accent-hover underline underline-offset-2" href={href} rel="nofollow noopener noreferrer">
      {children}
    </a>
  );
}

function Quote({ text, source }: { text: string; source: string }) {
  return (
    <figure className="guide-quote">
      <blockquote>
        <p>{text}</p>
      </blockquote>
      <figcaption>Source: {source}</figcaption>
    </figure>
  );
}

function Rich({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (!match) return <span key={i}>{part}</span>;
        const [, label, href] = match;
        if (href.startsWith("/")) {
          return (
            <Link key={i} href={href} className="accent-hover underline underline-offset-2">
              {label}
            </Link>
          );
        }
        return (
          <Ext key={i} href={href}>
            {label}
          </Ext>
        );
      })}
    </>
  );
}

function Block({ block }: { block: GuideBlock }) {
  if (block.type === "p") {
    return (
      <p>
        <Rich text={block.text} />
      </p>
    );
  }
  if (block.type === "quote") {
    return <Quote text={block.text} source={block.source} />;
  }
  if (block.type === "ol") {
    return (
      <ol>
        {block.items.map((item) => (
          <li key={item}>
            <Rich text={item} />
          </li>
        ))}
      </ol>
    );
  }
  if (block.type === "ul") {
    return (
      <ul>
        {block.items.map((item) => (
          <li key={item}>
            <Rich text={item} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <table className="spec-table">
      <thead>
        <tr>
          {block.headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {block.rows.map((row) => (
          <tr key={row.join("|")}>
            {row.map((cell, i) =>
              i === 0 ? (
                <th key={cell}>{cell}</th>
              ) : (
                <td key={`${cell}-${i}`}>
                  <Rich text={cell} />
                </td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function GuidePage({ guide }: { guide: Guide }) {
  const canonical = guideUrl(guide.slug);
  const updated = guideUpdated();

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          url: canonical,
          headline: guide.headline,
          description: guide.description,
          datePublished: updated,
          dateModified: updated,
        })}
      />
      <JsonLd
        data={faqJsonLd(
          guide.faq.map((item) => ({
            q: item.q,
            a: item.a.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"),
          })),
        )}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Grok Bot teams", url: site.url },
          { name: "Guides", url: guidesIndexUrl() },
          { name: guide.headline, url: canonical },
        ])}
      />
      <WingsSplit
        hero={
          <WingsHero
            kicker={
              <Link href="/guides" className="accent-hover">
                Guides
              </Link>
            }
            title={guide.headline}
          >
            <p className="mt-5 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
              {guide.hero}
            </p>
            <p className="meta mt-3">
              Last updated <time dateTime={updated}>{updated}</time>
            </p>
          </WingsHero>
        }
      >
        <article className="guide-prose">
          <p>
            We run the{" "}
            <Link className="accent-hover underline underline-offset-2" href="/">
              Grok Bot teams directory
            </Link>
            . The product facts below are from vendor docs we read on {updated}. The recipes and the installer prompts
            are ours. Ellelion LLC is not affiliated with xAI.
          </p>
          <ol className="guide-toc">
            {guide.sections.map((section, i) => (
              <li key={section.id}>
                <a className="accent-hover underline underline-offset-2" href={`#${section.id}`}>
                  {i + 1}. {section.title}
                </a>
              </li>
            ))}
            <li>
              <a className="accent-hover underline underline-offset-2" href="#questions">
                {guide.sections.length + 1}. Questions people ask
              </a>
            </li>
          </ol>

          {guide.sections.map((section) => (
            <section key={section.id}>
              <h2 id={section.id}>{section.title}</h2>
              {section.blocks.map((block, i) => (
                <Block key={`${section.id}-${i}`} block={block} />
              ))}
            </section>
          ))}

          <h2 id="questions">Questions people ask</h2>
          <div className="guide-faq">
            {guide.faq.map((item) => (
              <section key={item.q}>
                <h3>{item.q}</h3>
                <p>
                  <Rich text={item.a} />
                </p>
              </section>
            ))}
          </div>

          {guide.related.length > 0 ? (
            <p>
              Related:{" "}
              {guide.related.map((item, i) => (
                <span key={item.href}>
                  {i > 0 ? ", " : null}
                  <Link className="accent-hover underline underline-offset-2" href={item.href}>
                    {item.label}
                  </Link>
                </span>
              ))}
              .
            </p>
          ) : null}

          <p className="guide-source">
            Verified on {updated} against{" "}
            {guide.sources.map((source, i) => (
              <span key={source.href}>
                {i > 0 ? ", " : null}
                <Ext href={source.href}>{source.label}</Ext>
              </span>
            ))}
            . Recheck the live pages before you change a plan or a vendor.
          </p>
        </article>
      </WingsSplit>
    </>
  );
}
