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
      eyebrow="Legal"
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
          The site is for people doing work in Grok Bot and is not directed at children. Since we collect nothing, there
          is nothing here to request, correct, or delete. If you believe otherwise, write to us and we will look.
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
