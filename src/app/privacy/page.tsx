import type { Metadata } from "next";
import Link from "next/link";
import { Block, PageJump, PageShell } from "@/components/PageShell";
import { en } from "@/lib/messages/en";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What Grok Bot Teams does with data today: no account, no cookies, OpenPanel for first-party page counts, Stripe for rail payments. Operated by Ellelion LLC. Not affiliated with xAI.",
  alternates: { canonical: `${site.url}/privacy` },
};

export default function PrivacyPage() {
  return (
    <PageShell
      title="Privacy"
      lead={`What this site does with data today, not what a template says it might. ${site.company} is the operator. If any of this changes, this page changes with it.`}
    >
      <PageJump
        items={[
          "Who is responsible",
          "No account, no cookies, first-party analytics",
          "What your browser keeps",
          "What the server sees",
          "If you buy a rail slot",
          "Who else processes data",
          "How long we keep it",
          "Your rights",
          "Links off this site",
          "Children",
          "Contact",
        ]}
      />
      <Block title="Who is responsible">
        <p>
          {site.company} is the controller for the processing described here. Email{" "}
          <a className="accent-hover underline" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          . We have not appointed an EU or UK representative. That is an operator task, not something this page pretends
          is done.
        </p>
      </Block>

      <Block title="No account, no cookies, first-party analytics">
        <p>
          There is nothing to sign up for, so there is no profile, no password, and no mailing list. Visiting the
          directory does not require an account. Production responses on 23 August 2026 sent no Set-Cookie header. There
          is no tag manager, no session recording, and no advertising pixel. That is why there is no cookie banner.
        </p>
        <p>
          On production at{" "}
          <a className="accent-hover underline" href={site.url} rel="noopener noreferrer">
            {site.url}
          </a>
          , the site sends cookieless page-view and session-start events, plus outbound-link clicks, through{" "}
          <a
            className="accent-hover underline"
            href="https://openpanel.dev"
            rel="nofollow noopener noreferrer"
            target="_blank"
            aria-label={`OpenPanel. ${en.nav.opensNew}`}
          >
            OpenPanel
          </a>
          . OpenPanel is first-party analytics. A typical event stores the page path, referrer, device, browser, operating
          system, coarse geo (country and city), and timestamps. The host also sees an IP address in ordinary request
          logs. We use those counts to see what is used and to quote traffic honestly to sponsors. We do not sell the
          data and we do not use it to advertise to you.
        </p>
        <p>
          Lawful bases we rely on: operating the site and a paid placement (contract), keeping payment records (legal
          obligation), and first-party measurement of what pages are used (legitimate interests, with Global Privacy
          Control honored as an opt-out). If your browser sends Global Privacy Control, we do not load OpenPanel.
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
          Serving a page means our host (Vercel) receives the ordinary request data any web server receives: an IP
          address, a user agent, the page asked for, and the time. We use it to keep the site up. We do not build
          advertising profiles from it and we do not sell it.
        </p>
      </Block>

      <Block title="If you buy a rail slot">
        <p>
          Payment happens on Stripe&apos;s own hosted page, not on this site. Stripe is the processor and we never see or
          store a card number. Their handling of it is covered by{" "}
          <a
            className="accent-hover underline"
            href="https://stripe.com/privacy"
            rel="nofollow noopener noreferrer"
            target="_blank"
            aria-label={`Stripe privacy policy. ${en.nav.opensNew}`}
          >
            Stripe&apos;s privacy policy
          </a>
          . Card data stays in Stripe&apos;s PCI scope, not ours.
        </p>
        <p>
          What reaches us from that transaction is what we need to write your row and to reach you about it: the company
          name, the destination URL, the one line, the mark you upload, the email address you gave Stripe, and the amount
          and term. An automated review (via Vercel AI Gateway) reads the listing against a closed checklist. We keep
          those records as business records for the placement and for tax. We do not sell them and we do not use them to
          advertise to you.
        </p>
        <p>
          Buying still sets no cookie on this site. There is no pixel on the success page and no conversion script
          anywhere.
        </p>
      </Block>

      <Block title="Who else processes data">
        <p>Only the processors needed to run the site:</p>
        <ul>
          <li>Vercel, for hosting and logs.</li>
          <li>Neon, for rail payment and listing rows.</li>
          <li>Stripe, for checkout and receipts.</li>
          <li>OpenPanel, for cookieless page counts, unless Global Privacy Control is on.</li>
          <li>Vercel AI Gateway (OpenAI), for the listing review after you pay.</li>
        </ul>
        <p>
          Those companies may process data in the United States. Where a transfer leaves the EEA or UK we rely on the
          mechanisms those processors publish (Standard Contractual Clauses and, where they are certified, the EU-US Data
          Privacy Framework). We do not run a separate international-transfer program of our own.
        </p>
      </Block>

      <Block title="How long we keep it">
        <p>
          Page-count events until we no longer need them for the sponsor counts described above. Host logs on the
          host&apos;s rotation. Rail payment and listing rows for the placement term, then as long as tax and accounting
          rules require (we treat that as seven years for payment records). Theme and accent live only on your device.
          Customize edits live only in the URL you copy.
        </p>
      </Block>

      <Block title="Your rights">
        <p>
          Depending on where you are, you can ask for access, correction, deletion, a portable copy, restriction, or
          objection, and you can withdraw consent where we relied on it. Write to {site.email}. We respond within one
          month. We will ask enough to match you to a rail purchase (usually the email you used at Stripe). Browsing
          alone does not create a profile we can look up. You can also complain to a data-protection authority in your
          country. India: the same address is the grievance channel; you may nominate someone to act for you.
        </p>
      </Block>

      <Block title="Links off this site">
        <p>
          Connector marks, sponsor rows, and every link to xAI&apos;s docs point at other people&apos;s sites. Once you
          click, you are on their infrastructure and under their privacy policy, not this one. Outbound{" "}
          <Link className="accent-hover underline" href="/sponsor">
            sponsor rail
          </Link>{" "}
          links carry a plain campaign tag in the URL so we can tell where a click came from. That tag identifies the
          placement, not you.
        </p>
      </Block>

      <Block title="Children">
        <p>
          The site is for people 18 or older doing work in Grok Bot. It is not directed at children. If we learn we hold
          data about someone under 18, we delete what we are not required to keep.
        </p>
      </Block>

      <Block title="Contact">
        <p>
          {site.company}.{" "}
          <a className="accent-hover underline" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          . This site is not affiliated with xAI, and what Grok Bot does with your data is covered by xAI&apos;s policy,
          not ours.
        </p>
      </Block>
    </PageShell>
  );
}
