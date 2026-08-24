import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { WingsHero, WingsSplit } from "@/components/WingsSplit";
import { ledger } from "@/lib/ledger-theme";
import { CATALOG_CHECKED_ON, CONNECTOR_CATALOG } from "@/lib/connectors";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { GROK_BOT_GUIDE_UPDATED, XAI_DOCS, site } from "@/lib/site";
import { listBots, listTeams } from "@/lib/teams";

const TITLE = "What is Grok Bot? Setup, teams, and limits";
const DESCRIPTION =
  "Grok Bot is xAI's named AI teammate on a persistent cloud computer. Setup, skills, routines, who can use it, and how to install a team. 24 August 2026.";
const CANONICAL = `${site.url}/grok-bot`;
const HEADLINE = "What is Grok Bot?";

const SECTIONS = [
  { id: "how-is-grok-bot-different-from-the-grok-chatbot", title: "How is Grok Bot different from the Grok chatbot?" },
  { id: "how-do-you-set-up-grok-bot", title: "How do you set up Grok Bot?" },
  { id: "what-is-a-grok-bot-team", title: "What is a Grok Bot team?" },
  { id: "how-do-skills-and-routines-work", title: "How do skills and routines work?" },
  { id: "who-can-use-grok-bot-right-now", title: "Who can use Grok Bot right now?" },
  { id: "when-is-grok-bot-the-wrong-tool", title: "When is Grok Bot the wrong tool?" },
  { id: "how-does-grok-bot-compare-with-a-script-or-a-coding-agent", title: "How does Grok Bot compare with a script or a coding agent?" },
  { id: "questions-people-ask-about-grok-bot", title: "Questions people ask about Grok Bot" },
] as const;

const FAQ = [
  {
    q: "Is Grok Bot the same as Grok on X?",
    a: "Grok Bot is a separate xAI product from the Grok chatbot on grok.com and X. A Grok Bot is a named teammate with its own conversation, memory, and a persistent cloud computer. xAI launched it in beta on 11 August 2026. This directory is for Grok Bot teams.",
  },
  {
    q: "Does creating a second Bot isolate logins and files?",
    a: "Every Bot on an account uses the same cloud computer. Browser sessions, files, and command-line credentials are shared. A second Bot is a second conversation and job. Treat the roster as one trust zone. Put only credentials that every Bot on the account may use.",
  },
  {
    q: "Can you run Grok Bot on Linux?",
    a: "The get-started page, read on 24 August 2026, names macOS and Windows as the desktop clients and iOS for mobile. It has no Linux desktop app. The cloud computer your Bots share is a managed Linux environment, which is a different machine from the client you install.",
  },
  {
    q: "What happens to files when you delete a Bot?",
    a: "Deleting a Bot removes its profile, conversation, and routines. Files and signed-in sessions on the shared computer can remain. Sign out of sites, uninstall connectors, and remove project files under /workspace if that work should stop being available to the rest of the roster.",
  },
] as const;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    type: "article",
    publishedTime: GROK_BOT_GUIDE_UPDATED,
    modifiedTime: GROK_BOT_GUIDE_UPDATED,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

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

export default function GrokBotGuidePage() {
  const teams = listTeams();
  const bots = listBots();
  const teamCount = teams.length;
  const botCount = bots.length;
  const fromXaiCount = bots.filter((bot) => bot.fromXai).length;
  const connectorCount = CONNECTOR_CATALOG.length;

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          url: CANONICAL,
          headline: HEADLINE,
          description: DESCRIPTION,
          datePublished: GROK_BOT_GUIDE_UPDATED,
          dateModified: GROK_BOT_GUIDE_UPDATED,
        })}
      />
      <JsonLd data={faqJsonLd(FAQ.map((item) => ({ q: item.q, a: item.a })))} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Grok Bot teams", url: site.url },
          { name: HEADLINE, url: CANONICAL },
        ])}
      />
      <WingsSplit
        hero={
          <WingsHero
            kicker={
              <Link href="/" className="accent-hover">
                Grok Bot teams
              </Link>
            }
            title={HEADLINE}
          >
            <p className="mt-5 text-[0.95rem] leading-relaxed" style={{ color: ledger.inkSoft }}>
              Grok Bot is xAI&apos;s named AI teammate product, launched in beta on 11 August 2026. Each Bot has a job
              and a persistent cloud computer with a browser, files, and a terminal. All Bots on an account share that
              computer. You message one, save a working method as a skill, then schedule it as a routine.
            </p>
            <p className="meta mt-3">
              Last updated <time dateTime={GROK_BOT_GUIDE_UPDATED}>{GROK_BOT_GUIDE_UPDATED}</time>
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
            . The product below is xAI&apos;s. The recipes, the installer prompts, and the counts are ours. Ellelion LLC
            is not affiliated with xAI.
          </p>
          <ol className="guide-toc">
            {SECTIONS.map((section, i) => (
              <li key={section.id}>
                <a className="accent-hover underline underline-offset-2" href={`#${section.id}`}>
                  {i + 1}. {section.title}
                </a>
              </li>
            ))}
          </ol>

          <h2 id={SECTIONS[0].id}>{SECTIONS[0].title}</h2>
          <p>
            Grok on grok.com and X answers a message and stops. Grok Bot keeps a named teammate around: a job, a
            conversation, memory, and a cloud computer that keeps working after you close the laptop.
          </p>
          <Quote
            text="Grok Bot is your team of always-on agents. They have their own computer, work inside tools and apps like you do, and keep working 24/7."
            source='x.ai/news/introducing-grok-bot, "Introducing Grok Bot"'
          />
          <p>
            The official overview names the unit of work.
          </p>
          <Quote
            text="In the Docs and in the Grok Bot app, a Bot = a single persistent, named agent or one AI teammate."
            source='docs.x.ai/grok-bot/overview, "Grok Bot"'
          />
          <p>
            That computer is the whole product. A Bot can use a browser, a filesystem, a terminal, and connectors (the
            app currently labels those Plugins). Work can land in the actual tool. xAI said
            as much on{" "}
            <Ext href={XAI_DOCS.launch}>11 August 2026</Ext>
            , when it opened the beta.
          </p>
          <p>
            The catch, which we keep repeating because the UI still presents each Bot as a separate teammate, is that
            the computer belongs to the account.
            Every Bot you create shares files, cookies, and logins. A second Bot is a second job. Treat the computer as
            a shared desk.
          </p>
          <Quote
            text="The computer is isolated to your account, not to an individual Bot. Treat a login or file placed on the computer as available to all of your Bots."
            source='docs.x.ai/grok-bot/overview, "Bots share one computer"'
          />

          <h2 id={SECTIONS[1].id}>{SECTIONS[1].title}</h2>
          <p>
            We read{" "}
            <Ext href={XAI_DOCS.getStarted}>Get started</Ext> on 24 August 2026. The path it documents is:
          </p>
          <ol>
            <li>Open the Grok Bot access page and install the macOS or Windows app.</li>
            <li>Sign in with the Cursor account that has an eligible plan.</li>
            <li>Create one Bot with a short name, one primary job, and a description of how it should work.</li>
            <li>Give it a first task that names the outcome, the sources, the constraints, and the deliverable.</li>
            <li>Take over the computer for passwords, passkeys, two-factor codes, and CAPTCHAs. Do not paste those into chat.</li>
            <li>Correct the process. Save a skill only after the job works twice. Create a routine after that.</li>
          </ol>
          <p>
            xAI&apos;s own first-Bot example is a product-performance investigator called Piper. The useful part of that
            prompt is the stopping rule: preserve links and screenshots, separate evidence from hypotheses, never change
            production. Personality words do none of that work.
          </p>
          <p>
            If you already know the job, skip the blank Bot. Copy an installer from this directory, paste it into Grok
            Bot, and you get named Bots plus a group chat. Connectors still have to be on the account first. Nothing
            here signs in for you.
          </p>

          <h2 id={SECTIONS[2].id}>{SECTIONS[2].title}</h2>
          <p>
            On this site a team is two to six Bots in one group chat, with standing routines. A bot is one Bot doing
            one job and no group chat. We keep those on different URLs because adding them into one number is how the
            count starts lying.
          </p>
          <p>
            On 24 August 2026 this repo listed <strong>{teamCount} teams</strong> and <strong>{botCount} bots</strong>.{" "}
            {fromXaiCount} of the bots are our write-ups of jobs xAI publishes in its use-case gallery. That chip is
            sourcing. The{" "}
            <Link className="accent-hover underline underline-offset-2" href="/docs">
              team spec
            </Link>{" "}
            is the recipe format those files follow.
          </p>
          <p>
            xAI documents the group itself. Start a group chat by choosing New, then picking two to six Bots. An
            account can have up to 50 Bots and group chats combined. One Bot can own up to 50 routines. The app keeps
            the 20 most recent runs of each.
          </p>
          <p>
            Connectors are account-wide too. Modes such as read or draft on a team page are wording in the installer
            prompt. The real switch is Grok Bot Settings, then Plugins. We keep a{" "}
            <Link className="accent-hover underline underline-offset-2" href="/connectors">
              connectors catalog
            </Link>{" "}
            of {connectorCount} rows, last checked {CATALOG_CHECKED_ON}. Prefer a plugin when one exists. Use the
            browser when the job is visual or the service has no connector.
          </p>
          <p>
            If you want a desk that already knows the difference between a decaying page and a citation gap, start with
            the{" "}
            <Link className="accent-hover underline underline-offset-2" href="/teams/content-seo">
              SEO desk
            </Link>{" "}
            or the{" "}
            <Link className="accent-hover underline underline-offset-2" href="/teams/content-geo-aeo">
              GEO / AEO desk
            </Link>
            . For a single job, the{" "}
            <Link className="accent-hover underline underline-offset-2" href="/bots/xai-seo-aeo-auditor">
              SEO / AEO Auditor
            </Link>{" "}
            reports and the{" "}
            <Link className="accent-hover underline underline-offset-2" href="/bots/on-page-seo-fixer">
              On-page SEO fixer
            </Link>{" "}
            drafts the change. Both stop before publish.
          </p>

          <h2 id={SECTIONS[3].id}>{SECTIONS[3].title}</h2>
          <Quote
            text="A skill is a reusable set of instructions for how to do a task."
            source='docs.x.ai/grok-bot/skills-routines-and-automations, "Skills and routines"'
          />
          <Quote
            text="A routine tells one Bot when to run a workflow—on a schedule or, where supported, after an event."
            source='docs.x.ai/grok-bot/skills-routines-and-automations, "Skills and routines"'
          />
          <p>
            The order that holds up is one-time task, corrected task, saved skill, tested routine. Saving the first
            lucky run preserves a conversation. You want a method: sources, steps, validation, output, failure
            behavior, approval boundary.
          </p>
          <p>
            Type <code>/</code> in the desktop composer to reference a saved skill. Type <code>@</code> for Bots,
            groups, routines, and connectors. Teach a task can draft a skill from a browser demonstration up to ten
            minutes. Audio is not recorded. xAI says the control may roll out gradually. Treat that draft as a happy
            path. Write the failure cases yourself.
          </p>
          <p>
            A test run performs real work. It can change files and call tools. Keep writes behind approval until you
            have watched it twice. Background routines can run while the laptop is closed. Deleting a routine has no
            undo. Deleting a Bot removes the routines it owned.
          </p>

          <h2 id={SECTIONS[4].id}>{SECTIONS[4].title}</h2>
          <p>
            Access is a moving beta. We are quoting the get-started page as we found it on 24 August 2026. That page
            lists plans. It omits a dollar figure, so we do not invent one.
          </p>
          <Quote
            text="An eligible plan: SuperGrok Plus, SuperGrok Heavy, Cursor Pro+, Cursor Ultra, or Cursor Teams Standard or Premium (sign in with your Cursor account)"
            source='docs.x.ai/grok-bot/get-started, "Before you begin"'
          />
          <p>
            Cursor Pro without the plus is not on that list. The launch post also says enterprise users can join a
            waitlist. Desktop is macOS and Windows. Mobile, per get-started, is iOS. Legacy Privacy Mode is
            incompatible; Grok Bot requires cloud data storage.
          </p>
          <p>
            Check the live Grok Bot page and the current docs before you pay. We re-read the docs for this page. We
            did not re-price anyone&apos;s subscription.
          </p>

          <h2 id={SECTIONS[5].id}>{SECTIONS[5].title}</h2>
          <p>
            Use a script when the input, the rule, and the output are fixed. Copying form submissions into a database,
            resizing an upload, sending a receipt after a webhook: those jobs are cheaper and easier to audit as code.
            Grok Bot is for work that still needs a judgment call across a few apps, and that can stop at a reviewable
            artifact.
          </p>
          <p>
            Do not put a Bot between a payment and a required response, or inside a health check that must finish in
            milliseconds. Do not staff two Bots as separate trust zones. The approvals doc is blunt about that.
          </p>
          <Quote
            text="Do not use separate Bots as a security boundary."
            source='docs.x.ai/grok-bot/approvals-security-and-privacy, "Understand the shared-computer boundary"'
          />
          <p>
            Keep sending, publishing, purchasing, deletion, and production changes on approval. Always-allow rules
            belong to a named action after you can describe the exact scope. A broad always-allow for browser actions is a
            hole, because the browser is a route to every signed-in session on that computer.
          </p>
          <p>
            xAI&apos;s use-cases page puts the same idea in one line we wish more first-run prompts copied.
          </p>
          <Quote
            text="The best Grok Bot roles own a repeatable outcome, not a loose category of questions."
            source='docs.x.ai/grok-bot/use-cases, "Use cases"'
          />

          <h2 id={SECTIONS[6].id}>{SECTIONS[6].title}</h2>
          <p>
            We compared the jobs we catalog. ChatGPT, Claude Code, and self-hosted
            agents each have their own computer story. We did not re-verify those products for this page, so they stay
            off the table.
          </p>
          <table className="spec-table">
            <thead>
              <tr>
                <th>Job</th>
                <th>Use</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Named teammate that signs into apps and keeps a computer</th>
                <td>Grok Bot</td>
              </tr>
              <tr>
                <th>Two to six Bots, one group chat, standing routines</th>
                <td>A Grok Bot team from this directory</td>
              </tr>
              <tr>
                <th>Fixed input, fixed rule, fixed output</th>
                <td>A script or an automation tool</td>
              </tr>
              <tr>
                <th>Deep work inside one repository</th>
                <td>A coding agent in that repo</td>
              </tr>
            </tbody>
          </table>
          <p>
            The combination we like: a Bot gathers evidence across dashboards and the browser, a coding agent changes
            the repo, a person merges. That matches how we write recipes. Drafts first. Approval on the irreversible
            step.
          </p>

          <h2 id={SECTIONS[7].id}>{SECTIONS[7].title}</h2>
          <div className="guide-faq">
            {FAQ.map((item) => (
              <section key={item.q}>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </section>
            ))}
          </div>

          <p className="guide-source">
            Verified against{" "}
            <Ext href={XAI_DOCS.overview}>docs.x.ai/grok-bot/overview</Ext>
            ,{" "}
            <Ext href={XAI_DOCS.getStarted}>get-started</Ext>
            , and{" "}
            <Ext href={XAI_DOCS.launch}>x.ai/news/introducing-grok-bot</Ext>{" "}
            on {GROK_BOT_GUIDE_UPDATED}. Team and bot counts are from this repository on the same day. Grok Bot remains
            a beta. Recheck the live docs before you change a plan.
          </p>
        </article>
      </WingsSplit>
    </>
  );
}
