import type { Guide } from "@/lib/guide-types";
import { XAI_DOCS } from "@/lib/site";

export const jobGuides: Guide[] = [
  {
    slug: "grok-bot-for-seo",
    cluster: "job",
    title: "Grok Bot for SEO",
    headline: "Can Grok Bot do SEO and AEO?",
    description:
      "Grok Bot can draft SEO and AEO work that stops before publish. This directory has an SEO desk, a GEO/AEO desk, and an SEO/AEO Auditor. 24 August 2026.",
    hero: "Grok Bot can watch Search Console, draft a brief, and stop before anyone publishes. It is a poor choice for unsupervised site edits. This directory has an SEO desk, a GEO/AEO desk, an SEO/AEO Auditor, and an on-page fixer. All of them write the plan. None of them change the site.",
    sections: [
      {
        id: "what-the-job-owns",
        title: "What does the job own?",
        blocks: [
          {
            type: "p",
            text: "xAI's use-case gallery is the source for the Auditor write-up. The job is movement in search and in AI answers, plus a plan attached. The Bot reads. It drafts. It does not deploy.",
          },
          {
            type: "p",
            text: "On this directory the [SEO desk](/teams/content-seo) watches decaying pages before it asks for a new post. The [GEO / AEO desk](/teams/content-geo-aeo) watches who gets cited when someone asks a model. Those are different rooms. Do not merge them into one 'content' Bot and hope.",
          },
        ],
      },
      {
        id: "the-installers",
        title: "Which installers do you paste?",
        blocks: [
          {
            type: "ul",
            items: [
              "[SEO / AEO Auditor](/bots/xai-seo-aeo-auditor) for one Bot on rank and citation movement.",
              "[On-page SEO fixer](/bots/on-page-seo-fixer) for a draft fix, still not a publish.",
              "[SEO desk](/teams/content-seo) for four Bots on decay, gaps, briefs, and recap.",
              "[GEO / AEO desk](/teams/content-geo-aeo) for five Bots on citations, video, gaps, briefs, and recap.",
            ],
          },
          {
            type: "p",
            text: "Connect Search Console, and whatever draft tool you actually use, before you paste. See [Install a Grok Bot team](/guides/install-a-grok-bot-team).",
          },
        ],
      },
      {
        id: "the-stop-line",
        title: "Where does it stop?",
        blocks: [
          {
            type: "p",
            text: "Every one of those recipes says never change the site, never publish, cite the source for every claim. That is the point. A Bot that can sign into a CMS and also has a loose prompt is how a draft becomes a live page at 3am.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Will Grok Bot rank my site by itself?",
        a: "No. It can draft the brief and the fix. A person still publishes. This page exists so 'Grok Bot for SEO' does not turn into a promise we cannot source.",
      },
      {
        q: "Is the GEO/AEO desk the same as the SEO desk?",
        a: "No. SEO desk watches decaying pages. GEO/AEO desk watches who gets cited in answers. Use both if you care about both. Do not rename one Bot and call it a stack.",
      },
      {
        q: "Do you run these desks on botteams.ai?",
        a: "We write the recipes. We do not claim a secret ranking report from a Bot we ran overnight. The pages on this site are edited by people.",
      },
    ],
    sources: [
      { href: XAI_DOCS.useCases, label: "docs.x.ai/grok-bot/use-cases" },
    ],
    related: [
      { href: "/teams/content-seo", label: "SEO desk" },
      { href: "/teams/content-geo-aeo", label: "GEO / AEO desk" },
      { href: "/guides/install-a-grok-bot-team", label: "Install a team" },
    ],
  },
  {
    slug: "grok-bot-chief-of-staff",
    cluster: "job",
    title: "Grok Bot chief of staff",
    headline: "What is a Grok Bot chief of staff?",
    description:
      "xAI's Chief of Staff use case is a source-linked digest of what changed. This directory's installer drafts only. It never sends mail or accepts a meeting. 24 August 2026.",
    hero: "A Grok Bot chief of staff owns a source-linked digest of what changed and what needs a decision. xAI's use case says to return only items that map to your priorities, with a source on each line. This directory's installer never sends mail and never accepts a meeting.",
    sections: [
      {
        id: "what-xai-wrote",
        title: "What did xAI write?",
        blocks: [
          {
            type: "p",
            text: "The use-cases page, read on 24 August 2026, says this role owns a source-linked digest. Connect Slack, email, calendar, meeting notes, and planning documents. Start with activity since yesterday. Return only items that map to a priority document. For each item: the source, why it matters, the next step, and whether you owe a decision. Do not send messages. Do not change meetings.",
          },
        ],
      },
      {
        id: "the-installer",
        title: "What does the installer do?",
        blocks: [
          {
            type: "p",
            text: "Our [Chief of Staff](/bots/xai-chief-of-staff) Bot is a write-up of that job. From xAI means we sourced the title and the category. The connectors, the modes, and the stop lines are ours. xAI does not certify the file.",
          },
          {
            type: "p",
            text: "The persona scans mail, calendar, chat, and notes each morning and writes one short read-out. Suggest lines: never send mail, never accept or decline a meeting, review only until you approve. The routine is a weekday 08:00 pass.",
          },
        ],
      },
      {
        id: "how-to-tune-it",
        title: "How do you tune it?",
        blocks: [
          {
            type: "p",
            text: "xAI says to mark what was useful and what was noise, then schedule the digest for a time you can review it. Put the priority document in the description, not in a chat you will forget. See [Write a Grok Bot profile](/guides/write-a-grok-bot-profile).",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Will this Bot run my calendar?",
        a: "Not on this recipe. It drafts. You accept or decline. If you turn that suggest line off in Customize, you chose a louder Bot.",
      },
      {
        q: "Is this a company team?",
        a: "The listed installer is one Bot. If you want money and inbox in the same room, look at Founder OS on the [team index](/). That is a group chat, not this page.",
      },
      {
        q: "What connectors does it expect?",
        a: "Gmail, Calendar, Slack, and Notion, all marked draft. Connect them first. They are account-wide. See [connectors](/guides/grok-bot-connectors).",
      },
    ],
    sources: [
      { href: XAI_DOCS.useCases, label: "docs.x.ai/grok-bot/use-cases" },
    ],
    related: [
      { href: "/bots/xai-chief-of-staff", label: "Chief of Staff installer" },
      { href: "/guides/grok-bot-for-inbox", label: "Grok Bot for inbox" },
      { href: "/guides/install-a-grok-bot-team", label: "Install a team" },
    ],
  },
  {
    slug: "grok-bot-for-sales-outbound",
    cluster: "job",
    title: "Grok Bot for sales outbound",
    headline: "Can Grok Bot do sales outbound?",
    description:
      "xAI's Sales Outbound use case researches accounts and drafts outreach. This directory's installer never sends and never writes to the CRM. 24 August 2026.",
    hero: "Grok Bot can research accounts, score contacts, and draft outreach that stops before anyone hits send. xAI's use case says to return a review list and not enroll anyone. This directory's Sales Outbound installer never emails a prospect and never writes to the CRM.",
    sections: [
      {
        id: "what-xai-wrote",
        title: "What did xAI write?",
        blocks: [
          {
            type: "p",
            text: "The use case owns account research, contact prioritization, and review-ready outreach. Connect CRM, product-intent sources, company websites, email, and professional networks as their terms allow. The starter prompt researches 25 accounts, scores them, finds up to three contacts, drafts email and LinkedIn in the attached style, skips anyone already in sequence, and does not send.",
          },
          {
            type: "p",
            text: "After the output is reliable, xAI says to create a nightly research routine that still stops at the review list.",
          },
        ],
      },
      {
        id: "the-installers",
        title: "Which installers do you paste?",
        blocks: [
          {
            type: "p",
            text: "[Sales Outbound](/bots/xai-sales-outbound) is the one-Bot write-up. Outbound Desk researches overnight and drafts. Suggest lines: never email a prospect, never change the CRM. The [sales outbound team](/teams/sales-outbound) is the group-chat version if you want more than one seat in the room.",
          },
        ],
      },
      {
        id: "the-stop-line",
        title: "Where does it stop?",
        blocks: [
          {
            type: "p",
            text: "Send and enroll stay on you. A Bot that can see Gmail and also has send turned on will eventually send. Keep the first weeks on drafts. Watch two nights. Then decide.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Does this replace a sequencer?",
        a: "No. It builds the review list a sequencer would have received from a human. The use case says skip anyone already in an active sequence. Do not run both unsupervised.",
      },
      {
        q: "Can it write to Salesforce?",
        a: "The one-Bot recipe marks Salesforce as read. Propose the edit and wait. If you change that mode in Customize, you are asking it to write.",
      },
      {
        q: "Is LinkedIn outreach allowed?",
        a: "xAI says to connect professional networks as their terms permit. Read those terms. The installer drafts. You still click send.",
      },
    ],
    sources: [
      { href: XAI_DOCS.useCases, label: "docs.x.ai/grok-bot/use-cases" },
    ],
    related: [
      { href: "/bots/xai-sales-outbound", label: "Sales Outbound installer" },
      { href: "/teams/sales-outbound", label: "Sales outbound team" },
      { href: "/guides/install-a-grok-bot-team", label: "Install a team" },
    ],
  },
  {
    slug: "grok-bot-for-recruiting",
    cluster: "job",
    title: "Grok Bot for recruiting",
    headline: "Can Grok Bot help with recruiting?",
    description:
      "xAI's Talent Scout use case sources candidates and drafts outreach. This directory's installer never contacts anyone. 24 August 2026.",
    hero: "Grok Bot can source candidates, explain the match, and draft outreach that you still send. xAI's Talent Scout use case says to exclude anyone already in the ATS and not to contact anyone. This directory's installer follows that stop line.",
    sections: [
      {
        id: "what-xai-wrote",
        title: "What did xAI write?",
        blocks: [
          {
            type: "p",
            text: "Talent Scout owns sourcing, candidate research, outreach drafts, and scheduling preparation. Connect ATS, approved sourcing tools, email, and calendar. The starter prompt finds 20 people who meet the must-haves, excludes anyone already in the ATS, explains the evidence, drafts outreach in your voice, and does not contact anyone.",
          },
          {
            type: "p",
            text: "xAI adds approvals before external outreach, and tells the Bot to respect candidate privacy, regional requirements, and source terms. That is not decoration. A sourcing Bot with a loose send line is how you spam a market you cannot rehire from.",
          },
        ],
      },
      {
        id: "the-installer",
        title: "What does the installer do?",
        blocks: [
          {
            type: "p",
            text: "[Talent Scout](/bots/xai-talent-scout) is our write-up of that job. Hiring teams on the directory, such as [Hiring](/teams/hiring), are group chats around pipeline and offers. Start with the one Bot if you only want a nightly shortlist.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Will this Bot email candidates?",
        a: "Not on the stock recipe. It drafts. You send. Add approval before any external outreach, the way xAI wrote it.",
      },
      {
        q: "Can it skip people already in the ATS?",
        a: "That is the starter prompt xAI published. Connect the ATS first. If the plugin is missing, the installer will stop and tell you.",
      },
      {
        q: "Is this legal advice?",
        a: "No. Regional hiring rules are yours to know. The recipe says respect them. It does not interpret them.",
      },
    ],
    sources: [
      { href: XAI_DOCS.useCases, label: "docs.x.ai/grok-bot/use-cases" },
    ],
    related: [
      { href: "/bots/xai-talent-scout", label: "Talent Scout installer" },
      { href: "/teams/hiring", label: "Hiring team" },
      { href: "/guides/install-a-grok-bot-team", label: "Install a team" },
    ],
  },
  {
    slug: "grok-bot-for-inbox",
    cluster: "job",
    title: "Grok Bot for inbox",
    headline: "Can Grok Bot manage an inbox?",
    description:
      "A Grok Bot can draft replies and a daily read-out. This directory's Inbox Manager never sends. Pair it with Chief of Staff if you want priorities, not just mail. 24 August 2026.",
    hero: "Grok Bot can read an inbox and leave drafted replies or a short read-out. It should not send until you have watched the drafts. This directory's Inbox Manager stops at review. Pair it with Chief of Staff if you want the mail mapped to priorities, not just cleared.",
    sections: [
      {
        id: "what-the-job-owns",
        title: "What does the job own?",
        blocks: [
          {
            type: "p",
            text: "This directory marks [Inbox Manager](/bots/xai-inbox-manager) as From xAI via the use-case gallery. The docs.x.ai use-cases page we fetched on 24 August 2026 walked eight worked examples and did not use that heading. The recipe still exists, and it still stops at draft. Chief of Staff reads mail among other channels. This Bot stays with the queue.",
          },
          {
            type: "p",
            text: "That distinction matters. A chief of staff drops mail that does not map to priorities. An inbox Bot stays with the queue. Pick the one you actually want to read in the morning.",
          },
        ],
      },
      {
        id: "the-stop-line",
        title: "Where does it stop?",
        blocks: [
          {
            type: "p",
            text: "Never send is the line. Gmail on these recipes is draft. The shared computer will keep the mailbox session for every other Bot on the account. If that is too much access, do not connect Gmail. See [Grok Bot security](/guides/grok-bot-security).",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Is Inbox Manager an xAI use case?",
        a: "The recipe file marks it From xAI via the gallery. The docs.x.ai use-cases page we read the same day did not use that heading. We keep the chip the file already has, and we keep the stop line: never send, never delete.",
      },
      {
        q: "Can it archive or unsubscribe?",
        a: "Not on the stock suggest lines. Those are changes. Keep them behind a yes until you trust the drafts.",
      },
      {
        q: "Should I use this and Chief of Staff together?",
        a: "You can. They will both see Gmail, because connectors are account-wide. Give them different stop lines or you will get two drafts of the same thread.",
      },
    ],
    sources: [
      { href: XAI_DOCS.useCases, label: "docs.x.ai/grok-bot/use-cases" },
      { href: XAI_DOCS.approvals, label: "docs.x.ai/grok-bot/approvals-security-and-privacy" },
    ],
    related: [
      { href: "/bots/xai-inbox-manager", label: "Inbox Manager installer" },
      { href: "/guides/grok-bot-chief-of-staff", label: "Chief of Staff" },
      { href: "/guides/grok-bot-connectors", label: "Connectors" },
    ],
  },
  {
    slug: "grok-bot-for-bug-reproduction",
    cluster: "job",
    title: "Grok Bot for bug reproduction",
    headline: "Can Grok Bot reproduce bugs?",
    description:
      "xAI's Bug Reproduction use case turns a report into a staging pack with steps and screenshots. It does not merge a fix. 24 August 2026.",
    hero: "Grok Bot can turn a bug report into a staging pack: steps, expected and actual, screenshots, and a minimal case. xAI's use case says not to use production customer data. The fix still belongs to a coding agent and a human merge. This directory's installer never closes the issue.",
    sections: [
      {
        id: "what-xai-wrote",
        title: "What did xAI write?",
        blocks: [
          {
            type: "p",
            text: "Bug Reproduction owns turning reports into reliable packs. Connect issue tracker, staging, browser, and network tools. Read the report, reproduce it in staging with a fresh test account, and return exact steps, expected and actual behavior, screenshots, browser and OS, console or network notes, and a minimal case if possible.",
          },
          {
            type: "p",
            text: "xAI says to provide approved test credentials through a secure handoff, not chat. That matches [create a Bot](/guides/create-a-grok-bot): take over the computer for passwords. Do not paste them into the thread.",
          },
        ],
      },
      {
        id: "the-installer",
        title: "What does the installer do?",
        blocks: [
          {
            type: "p",
            text: "[Bug Reproduction](/bots/xai-bug-reproduction) is our write-up. The persona walks the same path in staging, files the pack, and stops. It never touches production and never closes the issue. If you want the code change, that is [Devin](/guides/grok-bot-vs-devin) or a [Cursor Cloud Agent](/guides/grok-bot-vs-cursor-agents).",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Can this Bot fix the bug?",
        a: "Not on this recipe. It reproduces. A coding agent changes the repo. A person merges. xAI's Product Performance use case is the same idea for latency: write-up with screenshots, no production changes.",
      },
      {
        q: "Can it use production customer data?",
        a: "The official starter prompt says no. Use a fresh test account in staging. If your tracker pasted customer data into the ticket, strip it before the Bot reads the ticket.",
      },
      {
        q: "Where do test passwords go?",
        a: "Onto the computer through takeover, not into chat. Remember the computer is shared. A password you type for this Bot is available to the rest of the roster.",
      },
    ],
    sources: [
      { href: XAI_DOCS.useCases, label: "docs.x.ai/grok-bot/use-cases" },
    ],
    related: [
      { href: "/bots/xai-bug-reproduction", label: "Bug Reproduction installer" },
      { href: "/guides/grok-bot-vs-devin", label: "vs Devin" },
      { href: "/guides/grok-bot-security", label: "Security" },
    ],
  },
];
