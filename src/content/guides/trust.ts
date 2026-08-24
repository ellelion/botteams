import type { Guide } from "@/lib/guide-types";
import { XAI_DOCS } from "@/lib/site";

export const trustGuides: Guide[] = [
  {
    slug: "who-can-use-grok-bot",
    cluster: "trust",
    title: "Who can use Grok Bot",
    headline: "Who can use Grok Bot right now?",
    description:
      "Eligible plans on 24 August 2026: SuperGrok Plus, SuperGrok Heavy, Cursor Pro+, Cursor Ultra, and Cursor Teams Standard or Premium. No dollar figures. Cursor Pro without plus is absent.",
    hero: "On 24 August 2026 xAI's get-started page listed SuperGrok Plus, SuperGrok Heavy, Cursor Pro+, Cursor Ultra, and Cursor Teams Standard or Premium. Cursor Pro without the plus is missing from that list. The page names plans, not prices. Desktop is macOS and Windows. Mobile is iOS.",
    sections: [
      {
        id: "the-list",
        title: "Which plans are listed?",
        blocks: [
          {
            type: "quote",
            text: "An eligible plan: SuperGrok Plus, SuperGrok Heavy, Cursor Pro+, Cursor Ultra, or Cursor Teams Standard or Premium (sign in with your Cursor account)",
            source: 'docs.x.ai/grok-bot/get-started, "Before you begin"',
          },
          {
            type: "p",
            text: "That is the whole list we will repeat. Third-party posts print dollar amounts for Heavy. xAI did not print one on the pages we fetched. We will not complete their sentence for them.",
          },
          {
            type: "p",
            text: "The launch post says enterprise users can join a waitlist. Legacy Privacy Mode is incompatible. Grok Bot requires cloud data storage. Recheck the live docs before you change a plan.",
          },
        ],
      },
      {
        id: "which-clients",
        title: "Which clients exist?",
        blocks: [
          {
            type: "p",
            text: "Get-started names macOS and Windows as the desktop clients and iOS for mobile. It has no Linux desktop app. The cloud computer your Bots share is a managed Linux environment. That is a different machine from the client you install.",
          },
        ],
      },
      {
        id: "cursor-pro",
        title: "Does Cursor Pro include Grok Bot?",
        blocks: [
          {
            type: "p",
            text: "Cursor Pro without the plus is absent from the get-started list we read on 24 August 2026. Cursor Pro+, Cursor Ultra, and Cursor Teams Standard or Premium are present. The short FAQ on [What is Grok Bot?](/grok-bot) says the same. This page exists so that query does not have to live only in a FAQ.",
          },
          {
            type: "p",
            text: "Having an eligible Cursor plan is not the same as having [Cursor Cloud Agents](/guides/grok-bot-vs-cursor-agents) set up. Cloud Agents still need source control connected.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "How much does SuperGrok Heavy cost?",
        a: "We do not know a public number we can cite. The get-started page lists the plan name. It does not list a price. If a blog prints $200 or $300, that is their figure, not xAI's page.",
      },
      {
        q: "Can I use Grok Bot on Android?",
        a: "The get-started page we read names iOS for mobile, not Android. Recheck the live page before you buy a phone around this product.",
      },
      {
        q: "Does an eligible plan include a team from this directory?",
        a: "No. The plan opens the product. The team is a prompt you paste. See [Install a Grok Bot team](/guides/install-a-grok-bot-team).",
      },
    ],
    sources: [
      { href: XAI_DOCS.getStarted, label: "docs.x.ai/grok-bot/get-started" },
      { href: XAI_DOCS.launch, label: "x.ai/news/introducing-grok-bot" },
    ],
    related: [
      { href: "/grok-bot", label: "What is Grok Bot?" },
      { href: "/guides/create-a-grok-bot", label: "Create a Grok Bot" },
      { href: "/guides/grok-bot-vs-cursor-agents", label: "vs Cursor Cloud Agents" },
    ],
  },
  {
    slug: "grok-bot-security",
    cluster: "trust",
    title: "Grok Bot security",
    headline: "How does Grok Bot security work?",
    description:
      "Grok Bot's cloud computer is account-scoped. A second Bot is not a vault. Deleting a Bot can leave files and sessions. Sourced 24 August 2026.",
    hero: "Every Grok Bot on an account shares one cloud computer. Browser sessions, files, and command-line credentials are available to the whole roster. A second Bot is a second job, not a vault. Deleting a Bot removes its profile, conversation, and routines. Files and signed-in sessions can remain.",
    sections: [
      {
        id: "the-shared-computer",
        title: "What is the shared-computer boundary?",
        blocks: [
          {
            type: "quote",
            text: "The computer is isolated to your account, not to an individual Bot. Treat a login or file placed on the computer as available to all of your Bots.",
            source: 'docs.x.ai/grok-bot/overview, "Bots share one computer"',
          },
          {
            type: "quote",
            text: "Do not use separate Bots as a security boundary.",
            source: 'docs.x.ai/grok-bot/approvals-security-and-privacy, "Understand the shared-computer boundary"',
          },
          {
            type: "p",
            text: "That pair of sentences is the whole security model most people miss. Connectors are the same story: [account-wide plugins](/guides/grok-bot-connectors). Read or draft in an installer is a sentence, not a lock.",
          },
        ],
      },
      {
        id: "when-you-delete-a-bot",
        title: "What happens when you delete a Bot?",
        blocks: [
          {
            type: "p",
            text: "Deleting a Bot removes its profile, conversation, and the routines it owned. Files and signed-in sessions on the shared computer can remain. Sign out of sites, uninstall connectors you no longer want, and remove project files under /workspace if that work should stop being available to the rest of the roster.",
          },
        ],
      },
      {
        id: "what-to-keep-behind-approval",
        title: "What should stay behind approval?",
        blocks: [
          {
            type: "p",
            text: "Keep sending, publishing, purchasing, deletion, and production changes on a human yes. Take over the computer for passwords, passkeys, two-factor codes, and CAPTCHAs. Do not paste those into chat. xAI's use-cases page repeats the same stop line on every role.",
          },
          {
            type: "p",
            text: "The recipes on this directory ship that stop line in the prompt. They cannot enforce it. You still confirm the routine card.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Does creating a second Bot isolate logins and files?",
        a: "No. Every Bot on an account uses the same cloud computer. A second Bot is a second conversation and job. Treat the roster as one trust zone. Put only credentials that every Bot on the account may use.",
      },
      {
        q: "Is the shared computer the same as my laptop?",
        a: "No. The client is macOS, Windows, or iOS. The computer the Bots share is a managed cloud environment. Local-file products such as [Claude Cowork](/guides/grok-bot-vs-claude-cowork) are a different machine: the one on your desk.",
      },
      {
        q: "Can a routine spend money?",
        a: "If the connected app can spend, a loose prompt can spend. Keep purchases behind approval. The [Expense Manager](/bots/xai-expense-manager) recipe drafts follow-ups and does not change reimbursements.",
      },
    ],
    sources: [
      { href: XAI_DOCS.overview, label: "docs.x.ai/grok-bot/overview" },
      { href: XAI_DOCS.approvals, label: "docs.x.ai/grok-bot/approvals-security-and-privacy" },
      { href: XAI_DOCS.useCases, label: "docs.x.ai/grok-bot/use-cases" },
    ],
    related: [
      { href: "/grok-bot", label: "What is Grok Bot?" },
      { href: "/guides/grok-bot-connectors", label: "Connectors" },
      { href: "/guides/write-a-grok-bot-profile", label: "Write a profile" },
    ],
  },
];
