import type { Metadata } from "next";
import Link from "next/link";
import { Block, PageShell } from "@/components/PageShell";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What Grok Bot Teams does with data today: no account, no analytics, no cookies. Operated by Ellelion LLC. Not affiliated with xAI.",
  alternates: { canonical: `${site.url}/privacy` },
};

export default function PrivacyPage() {
  return (
    <PageShell
      title="Privacy"
      lead={`What this site does with data today, not what a template says it might. ${site.company} is the operator. If any of this changes, this page changes with it.`}
    >
      <Block title="No account, no analytics, no cookies">
        <p>
          There is nothing to sign up for, so there is no profile, no password, and no mailing list. We set no cookies
          and we run no analytics: no page-view script, no tag manager, no session recording, no advertising pixel. That
          is why you are not being asked to accept anything.
        </p>
        <p>
          We expect to add basic traffic counts later, because we tell sponsors we will quote against real numbers. When
          that lands, this page says which tool, what it stores, and how long, before it is switched on.
        </p>
      </Block>

      <Block title="What your browser keeps">
        <p>
          Two settings, stored locally by your browser and never sent to us: your theme, light or dark, and your accent
          colour. Clearing site data removes both and nothing breaks.
        </p>
        <p>
          When you edit a recipe with Customize, the edits live in the address bar, so the link you copy carries them.
          Nothing you type there is saved to this site or sent to Grok Bot. Copy and paste is still how it installs.
        </p>
      </Block>

      <Block title="What the server sees">
        <p>
          Serving a page means our host receives the ordinary request data any web server receives: an IP address, a user
          agent, the page asked for, and the time. We use it to keep the site up and we do not build profiles from it, do
          not sell it, and do not join it to anything else.
        </p>
      </Block>

      <Block title="If you buy a rail slot">
        <p>
          Payment happens on Stripe&apos;s own hosted page, not on this site. Stripe is the processor and we never see or
          store a card number. Their handling of it is covered by{" "}
          <a className="accent-hover underline" href="https://stripe.com/privacy" rel="nofollow noopener noreferrer" target="_blank">
            Stripe&apos;s privacy policy
          </a>
          .
        </p>
        <p>
          What reaches us from that transaction is what we need to write your row and to reach you about it: the company
          name, the destination URL, the one line, the email address you gave Stripe, and the amount and term. We keep it
          as business records for the placement. We do not sell it and we do not use it to advertise to you.
        </p>
        <p>
          Buying still sets no cookie on this site and adds no tracking to it. There is no pixel on the success page and
          no conversion script anywhere.
        </p>
      </Block>

      <Block title="Links off this site">
        <p>
          Connector marks, sponsor rows, and every link to xAI&apos;s docs point at other people&apos;s sites. Once you
          click, you are on their infrastructure and under their privacy policy, not this one. Outbound{" "}
          <Link className="accent-hover underline" href="/sponsor">rail</Link> links carry a plain campaign tag in the
          URL so we can tell where a click came from. That tag identifies the placement, not you.
        </p>
      </Block>

      <Block title="Children and jurisdiction">
        <p>
          The site is for people doing work in Grok Bot and is not directed at children. Browsing collects nothing, so
          for a reader there is nothing to request, correct, or delete. If you have bought a placement, write to us and
          we will show you what we hold, correct it, or delete what we are not required to keep for accounting.
        </p>
      </Block>

      <Block title="Contact">
        <p>
          {site.company}, <a className="accent-hover underline" href={`mailto:${site.email}`}>{site.email}</a>. This site
          is not affiliated with xAI, and what Grok Bot does with your data is covered by xAI&apos;s policy, not ours.
        </p>
      </Block>
    </PageShell>
  );
}
