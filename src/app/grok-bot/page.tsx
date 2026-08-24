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
  { id: "questions-people-ask-about-grok-bot", title: "Questions people ask about Grok Bot" },
] as const;

const FAQ = [
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
  {
    q: "Does Cursor Pro include Grok Bot?",
    a: "The get-started page we read on 24 August 2026 lists Cursor Pro+, Cursor Ultra, and Cursor Teams Standard or Premium. Cursor Pro without the plus is absent from that list. SuperGrok Plus and SuperGrok Heavy are listed too. Recheck the live docs before you change a plan.",
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
            Grok on grok.com and X is a chatbot: it answers a message and stops. Grok Bot is a named teammate with a
            job, a conversation, memory, and a cloud computer that keeps working after you close the laptop. xAI opened
            that product in beta on 11 August 2026. The unit of work is one Bot.
          </p>
          <Quote
            text="Grok Bot is your team of always-on agents. They have their own computer, work inside tools and apps like you do, and keep working 24/7."
            source='x.ai/news/introducing-grok-bot, "Introducing Grok Bot"'
          />
          <Quote
            text="In the Docs and in the Grok Bot app, a Bot = a single persistent, named agent or one AI teammate."
            source='docs.x.ai/grok-bot/overview, "Grok Bot"'
          />
          <p>
            That computer is the whole product. A Bot can use a browser, a filesystem, a terminal, and connectors (the
            app currently labels those Plugins). Work can land in the actual tool. The UI still presents each Bot as a
            separate teammate. The isolation boundary is the account.
          </p>
          <Quote
            text="The computer is isolated to your account, not to an individual Bot. Treat a login or file placed on the computer as available to all of your Bots."
            source='docs.x.ai/grok-bot/overview, "Bots share one computer"'
          />

          <h2 id={SECTIONS[1].id}>{SECTIONS[1].title}</h2>
          <p>
            Install the macOS or Windows app, sign in with an eligible Cursor or SuperGrok plan, and create one Bot
            with a single job. Give it a task that names the outcome, the sources, the stop line, and the deliverable.
            Take over the computer for passwords and codes. Save a skill only after the job works twice, then put that
            skill on a routine.
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
            xAI&apos;s first-Bot example is a product-performance investigator called Piper. The useful part of that
            prompt is the stopping rule: preserve links and screenshots, separate evidence from hypotheses, never change
            production. If the job is already a roster, copy an installer from this directory. Nothing here signs in for
            you. The click path is on{" "}
            <Link className="accent-hover underline underline-offset-2" href="/guides/create-a-grok-bot">
              How do you create a Grok Bot?
            </Link>
            . The paste path is on{" "}
            <Link className="accent-hover underline underline-offset-2" href="/guides/install-a-grok-bot-team">
              How do you install a Grok Bot team?
            </Link>
            .
          </p>

          <h2 id={SECTIONS[2].id}>{SECTIONS[2].title}</h2>
          <p>
            On this directory a Grok Bot team is two to six named Bots in one group chat, with standing routines. A
            bot is one Bot and no group chat. On 24 August 2026 this repo listed{" "}
            <strong>{teamCount} teams</strong> and <strong>{botCount} bots</strong>. {fromXaiCount} of those bots are
            write-ups of jobs xAI publishes. The{" "}
            <Link className="accent-hover underline underline-offset-2" href="/docs">
              team spec
            </Link>{" "}
            holds the file format and the published caps (50 Bots and group chats combined, 50 routines per Bot, 20
            stored runs).
          </p>
          <p>
            Connectors are account-wide. Read or draft on a team page is wording in the installer. The switch is
            Settings, then Plugins. We keep a{" "}
            <Link className="accent-hover underline underline-offset-2" href="/connectors">
              connectors catalog
            </Link>{" "}
            of {connectorCount} rows, last checked {CATALOG_CHECKED_ON}. Prefer a plugin when one exists. The account-wide
            rule is on{" "}
            <Link className="accent-hover underline underline-offset-2" href="/guides/grok-bot-connectors">
              How do Grok Bot connectors work?
            </Link>
            . The group-chat cap is on{" "}
            <Link className="accent-hover underline underline-offset-2" href="/guides/grok-bot-group-chat">
              What is a Grok Bot group chat?
            </Link>
            .
          </p>

          <h2 id={SECTIONS[3].id}>{SECTIONS[3].title}</h2>
          <p>
            A skill is the written method. A routine is the schedule or event that runs it. The order that holds up is
            one-time task, corrected task, saved skill, tested routine. Type <code>/</code> for a skill and{" "}
            <code>@</code> for Bots, groups, routines, and connectors. A test run performs real work, so keep writes
            behind approval until you have watched it twice.
          </p>
          <Quote
            text="A skill is a reusable set of instructions for how to do a task."
            source='docs.x.ai/grok-bot/skills-routines-and-automations, "Skills and routines"'
          />
          <Quote
            text="A routine tells one Bot when to run a workflow—on a schedule or, where supported, after an event."
            source='docs.x.ai/grok-bot/skills-routines-and-automations, "Skills and routines"'
          />
          <p>
            Teach a task can draft a skill from a browser demonstration up to ten minutes. Audio is not recorded. Treat
            that draft as a happy path and write the failure cases yourself. Deleting a routine has no undo. Deleting a
            Bot removes the routines it owned. The longer order is on{" "}
            <Link className="accent-hover underline underline-offset-2" href="/guides/grok-bot-skills-and-routines">
              How do Grok Bot skills and routines work?
            </Link>
            .
          </p>

          <h2 id={SECTIONS[4].id}>{SECTIONS[4].title}</h2>
          <p>
            On 24 August 2026 the get-started page listed SuperGrok Plus, SuperGrok Heavy, Cursor Pro+, Cursor Ultra,
            and Cursor Teams Standard or Premium. Cursor Pro without the plus is absent from that list. Desktop clients
            are macOS and Windows. Mobile is iOS. That page lists plans, not a dollar figure.
          </p>
          <Quote
            text="An eligible plan: SuperGrok Plus, SuperGrok Heavy, Cursor Pro+, Cursor Ultra, or Cursor Teams Standard or Premium (sign in with your Cursor account)"
            source='docs.x.ai/grok-bot/get-started, "Before you begin"'
          />
          <p>
            The launch post also says enterprise users can join a waitlist. Legacy Privacy Mode is incompatible; Grok
            Bot requires cloud data storage. Recheck the live docs before you change a plan. Plan names without dollar
            figures are on{" "}
            <Link className="accent-hover underline underline-offset-2" href="/guides/who-can-use-grok-bot">
              Who can use Grok Bot right now?
            </Link>
            .
          </p>

          <h2 id={SECTIONS[5].id}>{SECTIONS[5].title}</h2>
          <p>
            Use Grok Bot when the job still needs a judgment call across a few apps and can stop at a reviewable
            artifact. Use a script when the input, the rule, and the output are fixed. Keep sending, publishing,
            purchasing, deletion, and production changes on approval.
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
          <Quote
            text="Do not use separate Bots as a security boundary."
            source='docs.x.ai/grok-bot/approvals-security-and-privacy, "Understand the shared-computer boundary"'
          />
          <p>
            The combination we like: a Bot gathers evidence, a coding agent changes the repo, a person merges. Drafts
            first. Approval on the irreversible step. Named 1:1 pages start at{" "}
            <Link className="accent-hover underline underline-offset-2" href="/guides/grok-bot-alternatives">
              Grok Bot alternatives
            </Link>
            . The shared-computer rule is on{" "}
            <Link className="accent-hover underline underline-offset-2" href="/guides/grok-bot-security">
              How does Grok Bot security work?
            </Link>
            .
          </p>

          <h2 id={SECTIONS[6].id}>{SECTIONS[6].title}</h2>
          <div className="guide-faq">
            {FAQ.map((item) => (
              <section key={item.q}>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </section>
            ))}
          </div>
          <p>
            More how-to and comparison pages sit under{" "}
            <Link className="accent-hover underline underline-offset-2" href="/guides">
              Guides
            </Link>
            . Related recipes on this directory: the{" "}
            <Link className="accent-hover underline underline-offset-2" href="/teams/content-seo">
              SEO desk
            </Link>
            , the{" "}
            <Link className="accent-hover underline underline-offset-2" href="/teams/content-geo-aeo">
              GEO / AEO desk
            </Link>
            , the{" "}
            <Link className="accent-hover underline underline-offset-2" href="/bots/xai-seo-aeo-auditor">
              SEO / AEO Auditor
            </Link>
            , and the{" "}
            <Link className="accent-hover underline underline-offset-2" href="/bots/on-page-seo-fixer">
              On-page SEO fixer
            </Link>
            . All of them stop before publish.
          </p>

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
