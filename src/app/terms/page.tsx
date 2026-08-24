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
      lead={`Short, and in the same voice as the rest of the site. ${site.company} operates ${site.name}. Using the site means these terms apply to you. Paying for a rail slot is agreement to these terms and to the Privacy policy.`}
    >
      <PageJump
        items={[
          "Who you are dealing with",
          "You must be 18",
          "The recipes are MIT",
          "You paste them at your own risk",
          "Paid rail slots",
          "We do not sell labor",
          "We are not xAI",
          "Contributions and outbound links",
          "Acceptable use",
          "Changes and contact",
        ]}
      />
      <Block title="Who you are dealing with">
        <p>
          {site.company}, {site.address}. Email{" "}
          <a className="accent-hover underline" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          . Wyoming law governs these terms. Courts in Sheridan County, Wyoming hear disputes, except where consumer law
          in your country says you may sue at home.
        </p>
      </Block>

      <Block title="You must be 18">
        <p>
          The site is for people 18 or older. Do not use it, and do not buy a placement, if you are under 18.
        </p>
      </Block>

      <Block title="The recipes are MIT">
        <p>
          Every team and Bot file in{" "}
          <a className="accent-hover underline" href={site.github} rel="noopener noreferrer" target="_blank" aria-label={`ellelion/botteams. ${en.nav.opensNew}`}>
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
          liable for what a Bot does after you paste a prompt, including anything a routine sends, drafts, or changes, and
          not for lost profits or indirect loss. Where liability cannot be excluded, it is limited to the amount you paid
          us for a placement in the twelve months before the claim, or fifty US dollars if you paid nothing.
        </p>
      </Block>

      <Block title="Paid rail slots">
        <p>
          Buying a{" "}
          <Link className="accent-hover underline" href="/sponsor">
            sponsor placement
          </Link>{" "}
          buys a marked listing on the side rail and the listing row for the term you pay: $1,500 for one month, $4,000 for three months,
          $7,500 for six months, one-time, card on Stripe. It is advertising. It is not Verified, it is not a team, and it
          is not an endorsement. House listings count toward the twelve slots. We may edit the one-liner after it is live
          so it reads like the rest of the directory. We may refuse or remove a listing that breaks the rules on the
          sponsor page. Prepaid terms are not subscriptions. The term runs from the day you pay. There is no mid-term
          cancel. Clicking pay on /sponsor is acceptance of these terms and of the{" "}
          <Link className="accent-hover underline" href="/privacy">
            Privacy
          </Link>{" "}
          policy.
        </p>
      </Block>

      <Block title="We do not sell labor">
        <p>
          Nothing here is a service contract. We do not run your Bots, we do not monitor them, and a placement buys a
          placement and nothing else. No support hours are implied by anything on this site.
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
          <a
            className="accent-hover underline"
            href={site.brandGuidelines}
            rel="nofollow noopener noreferrer"
            target="_blank"
            aria-label={`xAI brand guidelines. ${en.nav.opensNew}`}
          >
            brand guidelines
          </a>
          , unaltered. Your use of Grok Bot itself is governed by xAI&apos;s terms, not ours.
        </p>
      </Block>

      <Block title="Contributions and outbound links">
        <p>
          Send a recipe as a pull request and you licence it under MIT along with everything else in the repository. Only
          send work you have the right to send. We may take down material we are told is unlawful. Repeat that notice to{" "}
          {site.email} with the URL and why it should come down. We have not registered a US DMCA agent.
        </p>
        <p>
          Links off this site are other people&apos;s sites, under their terms. Paid rail listings and marked affiliate
          links are how a click can earn us money. They are labelled.
        </p>
      </Block>

      <Block title="Acceptable use">
        <p>
          Do not use the site to break the law, to probe it, or to submit a listing that is not a digital tool a Bot
          could use. No crypto, no trading signals, no lead-generation, no competing Grok Bot team or Bot directory on
          the rail.
        </p>
      </Block>

      <Block title="Changes and contact">
        <p>
          We will change these terms as the site changes, and the date at the top is the honest record of when. Questions
          go to{" "}
          <a className="accent-hover underline" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          .
        </p>
      </Block>
    </PageShell>
  );
}
