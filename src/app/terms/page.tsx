import type { Metadata } from "next";
import Link from "next/link";
import { Block, PageShell } from "@/components/PageShell";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Terms of use for Grok Bot Teams. Recipes are MIT. You paste them into Grok Bot at your own risk. Operated by Ellelion LLC. Not affiliated with xAI.",
  alternates: { canonical: `${site.url}/terms` },
};

export default function TermsPage() {
  return (
    <PageShell
      title="Terms"
      lead={`Short, and in the same voice as the rest of the site. ${site.company} operates ${site.name}. Using the site means these terms apply to you.`}
    >
      <Block title="The recipes are MIT">
        <p>
          Every team and bot file in{" "}
          <a className="accent-hover underline" href={site.github} rel="noopener noreferrer" target="_blank">
            ellelion/botteams
          </a>{" "}
          is MIT licensed. Copy them, change them, ship them commercially, keep the copyright notice. You do not need our
          permission and you do not owe us attribution on screen.
        </p>
      </Block>

      <Block title="You paste them at your own risk">
        <p>
          A recipe is text. When you paste it into Grok Bot, that text tells a Bot what to do with connectors you already
          connected, on an account we cannot see and do not control. Read it before you paste it.
        </p>
        <p>
          Connector modes in a recipe are wording, not a lock. Writing Read only in a prompt asks a Bot to behave; it does
          not remove a tool from the account. The real switch is in Grok Bot, under Settings, then Plugins. We say this on
          the pages themselves for the same reason we say it here.
        </p>
        <p>
          The site is provided as is, with no warranty of any kind. To the extent the law allows it, {site.company} is not
          liable for what a Bot does after you paste a prompt, including anything a routine sends, drafts, or changes.
        </p>
      </Block>

      <Block title="We do not sell labor">
        <p>
          Nothing here is a service contract. We do not run your Bots, we do not monitor them, and buying a{" "}
          <Link className="accent-hover underline" href="/sponsor">placement</Link> buys a placement and nothing else. No
          support hours are implied by anything on this site.
        </p>
      </Block>

      <Block title="We are not xAI">
        <p>
          {site.name} is not an official Grok Bot product and is not affiliated with xAI. Grok, Grok Bot, and xAI are
          trademarks of their owner and are used here only to name the product these recipes are for. xAI does not
          review, endorse, or operate this site.
        </p>
        <p>
          Grok artwork on this site is used under xAI&apos;s{" "}
          <a className="accent-hover underline" href={site.brandGuidelines} rel="nofollow noopener noreferrer" target="_blank">
            brand guidelines
          </a>
          , unaltered. Your use of Grok Bot itself is governed by xAI&apos;s terms, not ours.
        </p>
      </Block>

      <Block title="Contributions and outbound links">
        <p>
          Send a recipe as a pull request and you licence it under MIT along with everything else in the repository. Only
          send work you have the right to send.
        </p>
        <p>
          Links off this site are other people&apos;s sites, under their terms. Anywhere we would earn on a click is
          marked, and today nothing on the rail earns us anything.
        </p>
      </Block>

      <Block title="Changes and contact">
        <p>
          We will change these terms as the site changes, and the date at the top is the honest record of when. Questions
          go to <a className="accent-hover underline" href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </Block>
    </PageShell>
  );
}
