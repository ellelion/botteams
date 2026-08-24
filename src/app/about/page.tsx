import type { Metadata } from "next";
import Link from "next/link";
import { Block, PageJump, PageShell } from "@/components/PageShell";
import { en } from "@/lib/messages/en";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Grok Bot Teams is a public directory of teams and Bots for Grok Bot, operated by Ellelion LLC. Not affiliated with xAI.",
  alternates: { canonical: `${site.url}/about` },
};

export default function AboutPage() {
  return (
    <PageShell
      title="About"
      lead={`${site.company} operates ${site.name}, a public directory of teams and Bots for Grok Bot. Not affiliated with xAI.`}
    >
      <PageJump items={["What this is", "What it is not", "Who runs it", "Other Ellelion products"]} />
      <Block title="What this is">
        <p>
          A team here is one markdown file. It names the Bots, the group chat they share, the routines each Bot owns, and
          the connectors your account needs first. The site turns that file into one installer prompt you paste into Grok
          Bot. A one-Bot file is the same thing with a single Bot and no group chat.
        </p>
        <p>
          Every recipe is in the open at{" "}
          <a className="accent-hover underline" href={site.github} rel="noopener noreferrer" target="_blank" aria-label={`ellelion/botteams. ${en.nav.opensNew}`}>
            ellelion/botteams
          </a>
          . GitHub is the whole content system. If a recipe is wrong you can see why and send the fix.
        </p>
      </Block>

      <Block title="What it is not">
        <p>
          It is not an xAI product and xAI does not review, endorse, or operate anything here. Where a job came from
          xAI&apos;s published use cases we say <strong>From xAI</strong>, which is sourcing and nothing more.
        </p>
        <p>
          There is no account, no install button, and no connector API. Nothing on this site touches your Grok Bot
          account. You copy text and you paste it, which means you read it first and you stay in control of what runs.
        </p>
      </Block>

      <Block title="Who runs it">
        <p>
          {site.company}. Reach us at{" "}
          <a className="accent-hover underline" href={`mailto:${site.email}`}>{site.email}</a> for a correction, a
          contribution, or a{" "}
          <Link className="accent-hover underline" href="/sponsor">sponsor placement</Link>. We answer from that address, and it
          is the same address on{" "}
          <Link className="accent-hover underline" href="/terms">Terms</Link> and{" "}
          <Link className="accent-hover underline" href="/privacy">Privacy</Link>.
        </p>
      </Block>

      <Block title="Other Ellelion products">
        <p>
          The rest of what this company ships. They are separate products with separate terms, not mirrors of this one.
        </p>
        <ul className="mt-1">
          {site.ellelionSites.map((product) => (
            <li key={product.href} className="hairline-row py-3">
              <a className="accent-hover underline" href={product.href} rel="nofollow noopener noreferrer" target="_blank" aria-label={`${product.name}. ${en.nav.opensNew}`}>
                {product.name}
              </a>
            </li>
          ))}
        </ul>
      </Block>
    </PageShell>
  );
}
