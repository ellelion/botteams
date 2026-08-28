import type { Metadata } from "next";
import Link from "next/link";
import { Block, PageJump, PageShell } from "@/components/PageShell";
import { en } from "@/lib/messages/en";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Terms of use for Grok Bot Teams. Recipes are MIT. You paste them into Grok Bot at your own risk. Rail slots are paid placements. Operated by Ellelion LLC. Not affiliated with xAI.",
  alternates: { canonical: `${site.url}/terms` },
};

export default function TermsPage() {
  return (
    <PageShell
      title="Terms"
      lead="These terms are an agreement between you and Ellelion LLC for using botteams.io. Using the site, or paying for a rail slot, means you agree. If you do not, do not use the site and do not pay."
    >
      <PageJump
        items={[
          "Who you are dealing with",
          "You must be 18",
          "The directory",
          "Paid rail slots",
          "What we do not sell",
          "Acceptable use",
          "As is",
          "Changes",
          "Law",
          "Contact",
        ]}
      />
      <Block title="Who you are dealing with">
        <p>
          {site.company} operates {site.name}. Email{" "}
          <a className="accent-hover underline" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          . We are not xAI. Grok, Grok Bot, and xAI are their marks. We use those names only to say what these recipes
          are for.
        </p>
      </Block>

      <Block title="You must be 18">
        <p>The site is for people 18 or older. Do not use it, and do not buy a slot, if you are under 18.</p>
      </Block>

      <Block title="The directory">
        <p>
          This is a public directory of Grok Bot teams and Bots. Every recipe in{" "}
          <a className="accent-hover underline" href={site.github} rel="noopener noreferrer" target="_blank" aria-label={`ellelion/botteams. ${en.nav.opensNew}`}>
            ellelion/botteams
          </a>{" "}
          is MIT licensed. Copy it, change it, ship it. Keep the copyright notice. You do not need our permission.
        </p>
        <p>
          A recipe is text. When you paste it into Grok Bot, it runs on an account we cannot see. Read it first. Connector
          modes in a recipe are wording, not a lock. The real switch is in Grok Bot, under Settings, then Plugins. Your
          use of Grok Bot is under xAI&apos;s terms, not these.
        </p>
        <p>
          Send a pull request and you license that work under MIT with the rest of the repo. Only send work you have the
          right to send. We may take down material we are told is unlawful. Write to {site.email} with the URL and why.
          We have not registered a US DMCA agent.
        </p>
      </Block>

      <Block title="Paid rail slots">
        <p>
          Paying on{" "}
          <Link className="accent-hover underline" href="/sponsor">
            sponsor placement
          </Link>{" "}
          buys a marked listing on the side rail and the listing row for the term you choose: $1,500 for one month, $4,000
          for three months, $7,500 for six months. One-time. Card on Stripe. It is advertising. It is not Verified, not a
          team, and not an endorsement.
        </p>
        <p>
          Twelve slots, including house listings. Prepaid, not a subscription. The term starts the day you pay. No
          mid-term cancel. We may edit the one-liner so it reads like the rest of the directory. We may refuse or remove a
          listing that breaks the rules on the sponsor page. Clicking pay is also agreement to the{" "}
          <Link className="accent-hover underline" href="/privacy">
            Privacy
          </Link>{" "}
          policy.
        </p>
      </Block>

      <Block title="What we do not sell">
        <p>
          Nothing here is a service contract. We do not run your Bots and we do not watch them. A slot buys a slot. No
          support hours come with the site or with a payment.
        </p>
      </Block>

      <Block title="Acceptable use">
        <p>
          Do not use the site to break the law, to probe it, or to submit a listing that is not a digital tool a Bot
          could use. No crypto, no trading signals, no lead-generation, no competing Grok Bot team or Bot directory on
          the rail.
        </p>
        <p>
          Links off this site are other people&apos;s sites. Paid rail listings and marked affiliate links can earn us
          money. They are labelled.
        </p>
      </Block>

      <Block title="As is">
        <p>
          The site is provided as is, with no warranty of any kind. To the extent the law allows it, {site.company} is
          not liable for what a Bot does after you paste a prompt, including anything a routine sends, drafts, or
          changes, and not for lost profits or indirect loss. Where liability cannot be excluded, it is limited to what
          you paid us for a placement in the twelve months before the claim, or fifty US dollars if you paid nothing.
        </p>
      </Block>

      <Block title="Changes">
        <p>
          We may change these terms. The date at the top of this page is the record of the current version. If you keep
          using the site after a change, you accept the new terms. If you do not accept them, stop using the site. A new
          payment is acceptance of the terms on this page that day.
        </p>
      </Block>

      <Block title="Law">
        <p>
          Wyoming law governs these terms. Courts in Sheridan County, Wyoming hear disputes, except where consumer law in
          your country says you may sue at home.
        </p>
      </Block>

      <Block title="Contact">
        <p>
          Questions:{" "}
          <a className="accent-hover underline" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          .
        </p>
      </Block>
    </PageShell>
  );
}
