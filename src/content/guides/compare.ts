import type { Guide } from "@/lib/guide-types";
import { COMPARE_DOCS, XAI_DOCS } from "@/lib/site";

export const compareGuides: Guide[] = [
  {
    slug: "grok-bot-vs-claude-cowork",
    cluster: "compare",
    title: "Grok Bot vs Claude Cowork",
    headline: "Grok Bot vs Claude Cowork",
    description:
      "Grok Bot is a named teammate on one account-scoped cloud computer. Claude Cowork is Anthropic's agentic workspace with local files and cloud sessions. Sourced 24 August 2026.",
    hero: "Grok Bot is a named teammate on one account-scoped cloud computer. Claude Cowork is Anthropic's agentic workspace. It reads and writes local files from the Claude desktop app, and it can run sessions in Anthropic's cloud. Use Grok Bot when work should land in signed-in apps. Use Cowork when the files already sit on your machine.",
    sections: [
      {
        id: "what-is-each-product",
        title: "What is each product?",
        blocks: [
          {
            type: "p",
            text: "Grok Bot is xAI's named AI teammate. Each Bot has a job, a conversation, and a persistent cloud computer with a browser, files, and a terminal. All Bots on an account share that computer. xAI opened the product in beta on 11 August 2026.",
          },
          {
            type: "quote",
            text: "Grok Bot is your team of always-on agents. They have their own computer, work inside tools and apps like you do, and keep working 24/7.",
            source: 'x.ai/news/introducing-grok-bot, "Introducing Grok Bot"',
          },
          {
            type: "p",
            text: "Claude Cowork is Anthropic's agentic workspace. The overview we read on 24 August 2026 says it uses the same agentic architecture as Claude Code, inside Claude Desktop, without opening a terminal. You describe an outcome and come back to finished documents, organized files, or research.",
          },
          {
            type: "quote",
            text: "Cowork uses the same agentic architecture that powers Claude Code, accessible within Claude Desktop without opening the terminal.",
            source: 'claude.com/docs/cowork/overview, "Overview"',
          },
        ],
      },
      {
        id: "where-does-the-work-run",
        title: "Where does the work run?",
        blocks: [
          {
            type: "p",
            text: "Grok Bot's computer is isolated to the account, not to one Bot. A login or file on that computer is available to every Bot on the roster. That is why this directory treats connectors as account-wide.",
          },
          {
            type: "quote",
            text: "The computer is isolated to your account, not to an individual Bot. Treat a login or file placed on the computer as available to all of your Bots.",
            source: 'docs.x.ai/grok-bot/overview, "Bots share one computer"',
          },
          {
            type: "p",
            text: "Cowork's get-started page, read the same day, says sessions run remotely in Anthropic's cloud, in beta, so the session can follow you across desktop, web, and mobile. Local file access, browser use, and computer use still need the Claude Desktop app for macOS or Windows, open and connected.",
          },
          {
            type: "quote",
            text: "Works directly on your computer — Claude reads and writes local files without requiring manual uploads or downloads.",
            source: 'claude.com/docs/cowork/overview, "Key capabilities"',
          },
        ],
      },
      {
        id: "which-one-fits",
        title: "Which one fits?",
        blocks: [
          {
            type: "table",
            headers: ["Criterion", "Grok Bot", "Claude Cowork"],
            rows: [
              ["Unit of work", "A named Bot, or two to six in a group chat", "A Cowork session from the same message box as chat"],
              ["Computer", "One cloud computer per account", "Cloud session, plus local files through Desktop"],
              ["Local files", "Not the documented default", "Reads and writes local files"],
              ["Eligible plans named", "SuperGrok Plus or Heavy; Cursor Pro+, Ultra, or Teams Standard or Premium", "Paid Claude plans: Pro, Max, Team, Enterprise"],
              ["Best when", "Work should land in signed-in apps on a standing roster", "The files already live on the desktop in front of you"],
            ],
          },
          {
            type: "p",
            text: "Grok Bot suits a standing roster with routines. Cowork suits a person who already works in local folders and wants Claude to finish a document there. Neither page we read prints a dollar price for the top Grok Bot tier, so this table names plans, not invoices.",
          },
        ],
      },
      {
        id: "what-we-would-not-claim",
        title: "What we would not claim",
        blocks: [
          {
            type: "p",
            text: "We did not run a bake-off. We did not time the same task in both products. Third-party posts already do that. This page only repeats what each vendor wrote, plus the catalog counts on [What is Grok Bot?](/grok-bot).",
          },
          {
            type: "p",
            text: "If you need a named team on Grok Bot, copy an installer from this directory. Nothing here signs into Claude or xAI for you.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Does Claude Cowork run without the desktop app?",
        a: "Anthropic's get-started page, read on 24 August 2026, lists web, desktop, and mobile for paid plans. Local file access, browser use, and computer use still need the Claude Desktop app open and connected. Cloud sessions can continue when you change devices.",
      },
      {
        q: "Does a second Grok Bot isolate files from Cowork-style local work?",
        a: "No. Grok Bot does not use your laptop folder as the default workspace. Its computer is account-scoped. A second Bot is a second job, not a vault. Cowork's local-file claim is a different machine: the one on your desk.",
      },
      {
        q: "Can you run both?",
        a: "Yes. The pairing we like is Cowork on local drafts and Grok Bot on signed-in apps that need a standing routine. Keep send, publish, and production changes on approval in both places.",
      },
    ],
    sources: [
      { href: XAI_DOCS.overview, label: "docs.x.ai/grok-bot/overview" },
      { href: XAI_DOCS.launch, label: "x.ai/news/introducing-grok-bot" },
      { href: COMPARE_DOCS.coworkOverview, label: "claude.com/docs/cowork/overview" },
      { href: COMPARE_DOCS.coworkGetStarted, label: "Claude Cowork get-started" },
    ],
    related: [
      { href: "/grok-bot", label: "What is Grok Bot?" },
      { href: "/guides/grok-bot-vs-chatgpt-work", label: "Grok Bot vs ChatGPT Work" },
      { href: "/guides/grok-bot-alternatives", label: "Grok Bot alternatives" },
      { href: "/guides/install-a-grok-bot-team", label: "Install a Grok Bot team" },
    ],
  },
  {
    slug: "grok-bot-vs-chatgpt-work",
    cluster: "compare",
    title: "Grok Bot vs ChatGPT Work",
    headline: "Grok Bot vs ChatGPT Work",
    description:
      "Grok Bot is a named teammate on one shared cloud computer. ChatGPT Work is OpenAI's longer-task agent inside ChatGPT. Sourced 24 August 2026.",
    hero: "Grok Bot is a named teammate on one account-scoped cloud computer. ChatGPT Work is OpenAI's agent for longer tasks that should end as a document, sheet, deck, or Site. Use Grok Bot when you want a standing roster with routines. Use Work when the job is one ambitious pass inside ChatGPT.",
    sections: [
      {
        id: "what-is-each-product",
        title: "What is each product?",
        blocks: [
          {
            type: "p",
            text: "Grok Bot is one persistent named agent, or a group chat of two to six. The computer under those Bots is shared across the account. xAI launched it in beta on 11 August 2026.",
          },
          {
            type: "quote",
            text: "In the Docs and in the Grok Bot app, a Bot = a single persistent, named agent or one AI teammate.",
            source: 'docs.x.ai/grok-bot/overview, "Grok Bot"',
          },
          {
            type: "p",
            text: "OpenAI's help article on ChatGPT Work and Codex, read on 24 August 2026, splits ChatGPT into Chat for fast questions and Work for longer, multi-step jobs that should end as a deliverable. Codex stays a separate view in the desktop app for software work.",
          },
          {
            type: "quote",
            text: "ChatGPT Work is an agent that can take action across your apps and files, stay with a project for hours if needed, and turn a goal into finished work.",
            source: 'openai.com/index/chatgpt-for-your-most-ambitious-work, "ChatGPT is now a partner for your most ambitious work"',
          },
        ],
      },
      {
        id: "where-does-work-live",
        title: "Where does the work live?",
        blocks: [
          {
            type: "p",
            text: "Grok Bot keeps files and signed-in sessions on the shared cloud computer. Deleting a Bot does not reliably wipe that computer. See [Grok Bot security](/guides/grok-bot-security).",
          },
          {
            type: "p",
            text: "The same OpenAI help article says Work on web and mobile runs in the cloud. Cloud Work chats sync across web, mobile, and desktop. Work chats started as local chats on the desktop app stay on that computer. Desktop Work can use local files and desktop apps when the plan and workspace allow it.",
          },
        ],
      },
      {
        id: "which-one-fits",
        title: "Which one fits?",
        blocks: [
          {
            type: "table",
            headers: ["Criterion", "Grok Bot", "ChatGPT Work"],
            rows: [
              ["Unit of work", "A named Bot, plus optional group chat and routines", "A Work chat that can run for hours"],
              ["Coding sibling", "A coding agent in the repo, not Grok Bot itself", "Codex, a separate desktop view"],
              ["Desktop access named", "macOS and Windows; iOS for mobile; no Linux desktop app", "macOS and Windows desktop; web and mobile for eligible paid plans"],
              ["Free-plan note", "Not listed on xAI's get-started page we read", "OpenAI's launch post says the desktop app includes Work on every plan, including Free"],
              ["Best when", "A standing roster should keep working in signed-in apps", "One ambitious pass should end as a file inside ChatGPT"],
            ],
          },
          {
            type: "p",
            text: "OpenAI's launch post, read the same day, says Work on web and mobile started with Pro, Enterprise, and Edu, then Plus and Business. The help article says web and mobile Work skips Free and Go. We do not print a dollar figure either vendor left off the page.",
          },
        ],
      },
      {
        id: "what-we-would-not-claim",
        title: "What we would not claim",
        blocks: [
          {
            type: "p",
            text: "We did not measure which agent finishes a spreadsheet faster. We did not count connectors. OpenAI's marketing pages mention a large app catalog; we did not audit it. If a number is not on the help article or the launch post, it is not in this table.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Is ChatGPT Work the same as Codex?",
        a: "No. OpenAI's help article keeps Codex as a separate desktop view for software development. Work is the longer-task agent for documents, sheets, decks, and Sites. Grok Bot is closer to Work than to Codex. For repo work, see [Grok Bot vs Cursor Cloud Agents](/guides/grok-bot-vs-cursor-agents).",
      },
      {
        q: "Does Grok Bot run on Linux the way ChatGPT's desktop page mentions Linux?",
        a: "xAI's get-started page names macOS and Windows for desktop and iOS for mobile. It has no Linux desktop app. The cloud computer your Bots share is a managed Linux environment, which is a different machine from the client you install.",
      },
      {
        q: "Can a Grok Bot routine replace ChatGPT Work?",
        a: "A routine tells one Bot when to run a saved method. Work is a long chat that can run for hours inside ChatGPT. Use a routine for a standing watch. Use Work for a one-off ambitious pass. Do not pretend they are the same noun.",
      },
    ],
    sources: [
      { href: XAI_DOCS.overview, label: "docs.x.ai/grok-bot/overview" },
      { href: XAI_DOCS.getStarted, label: "docs.x.ai/grok-bot/get-started" },
      { href: COMPARE_DOCS.chatgptWorkHelp, label: "ChatGPT Work and Codex help" },
      { href: COMPARE_DOCS.chatgptWorkLaunch, label: "OpenAI launch post" },
    ],
    related: [
      { href: "/grok-bot", label: "What is Grok Bot?" },
      { href: "/guides/grok-bot-vs-claude-cowork", label: "Grok Bot vs Claude Cowork" },
      { href: "/guides/grok-bot-vs-cursor-agents", label: "Grok Bot vs Cursor Cloud Agents" },
      { href: "/guides/grok-bot-alternatives", label: "Grok Bot alternatives" },
    ],
  },
  {
    slug: "grok-bot-vs-cursor-agents",
    cluster: "compare",
    title: "Grok Bot vs Cursor Cloud Agents",
    headline: "Grok Bot vs Cursor Cloud Agents",
    description:
      "Grok Bot signs into apps on one shared cloud computer. Cursor Cloud Agents clone a repo into an isolated VM and open a pull request. Sourced 24 August 2026.",
    hero: "Grok Bot is a named teammate on one account-scoped cloud computer. A Cursor Cloud Agent is a coding run in an isolated VM with your repo, tests, and a branch. Use Grok Bot when the job lives in signed-in apps. Use a Cloud Agent when the output should be a pull request.",
    sections: [
      {
        id: "what-is-each-product",
        title: "What is each product?",
        blocks: [
          {
            type: "p",
            text: "Grok Bot and Cursor Cloud Agents can both be on a Cursor plan. They are not the same product. Grok Bot is xAI's teammate with a browser and connectors. A Cloud Agent is Cursor's isolated development VM. Cursor's docs still note the old name: Background Agents.",
          },
          {
            type: "quote",
            text: "Cloud agents use the same agent fundamentals but run in isolated VMs in the cloud with full development environments instead of on your local machine.",
            source: 'cursor.com/docs/cloud-agent, "Cloud Agents"',
          },
          {
            type: "p",
            text: "xAI's get-started page lists Cursor Pro+, Cursor Ultra, and Cursor Teams Standard or Premium among the plans that can open Grok Bot. Cursor Pro without the plus is absent from that list. Cloud Agents, on the troubleshooting page we read, require a paid Cursor plan and a connected source-control account.",
          },
        ],
      },
      {
        id: "what-comes-back",
        title: "What comes back?",
        blocks: [
          {
            type: "p",
            text: "A Cloud Agent clones the repo, works on a separate branch, and pushes for handoff. Cursor documents merge-ready pull requests, screenshots, videos, and logs. You can take over the agent's remote desktop, then hand control back.",
          },
          {
            type: "p",
            text: "A Grok Bot comes back with whatever you asked it to leave in the apps: a draft email, a review list, a Notion note. It does not open a pull request unless you also pointed a coding agent at the repo. The combination we like is written on [What is Grok Bot?](/grok-bot): a Bot gathers evidence, a coding agent changes the repo, a person merges.",
          },
        ],
      },
      {
        id: "which-one-fits",
        title: "Which one fits?",
        blocks: [
          {
            type: "table",
            headers: ["Criterion", "Grok Bot", "Cursor Cloud Agent"],
            rows: [
              ["Isolation", "One computer per account, shared by every Bot", "One isolated VM per agent"],
              ["Default output", "Work inside signed-in apps and files on that computer", "A branch and a pull request"],
              ["Needs source control first", "No", "Yes. An admin connects GitHub, GitLab, Bitbucket, or Azure DevOps"],
              ["Parallel runs", "Many Bots, one shared computer", "As many agents as you start, each on its own VM"],
              ["Best when", "The job is mail, CRM, ads, or a standing watch", "The job is code in a connected repository"],
            ],
          },
          {
            type: "p",
            text: "Cursor bills Cloud Agents at API pricing for the selected model and asks for a spend limit. xAI's Grok Bot get-started page lists plan names, not a dollar figure. Do not treat those as the same invoice.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "If I have Cursor Ultra, do I pick Grok Bot or a Cloud Agent?",
        a: "You can have both. Ultra is on xAI's Grok Bot eligibility list. Cloud Agents still need a paid Cursor plan and a connected repo. Pick by output: apps and drafts for Grok Bot, a pull request for a Cloud Agent.",
      },
      {
        q: "Does a second Grok Bot isolate code the way a Cloud Agent VM does?",
        a: "No. Cursor documents one isolated VM per Cloud Agent. xAI documents one computer per Grok Bot account. A second Bot is a second conversation. It is not a second machine.",
      },
      {
        q: "Can a Grok Bot replace a Cloud Agent on a multi-repo change?",
        a: "Cursor's Cloud Agent docs describe multi-repo work, coordinated changes, and pull requests in the repos it touches. Grok Bot is not documented as a git handoff tool. Keep repo edits on a coding agent.",
      },
    ],
    sources: [
      { href: XAI_DOCS.getStarted, label: "docs.x.ai/grok-bot/get-started" },
      { href: XAI_DOCS.overview, label: "docs.x.ai/grok-bot/overview" },
      { href: COMPARE_DOCS.cursorCloudAgent, label: "cursor.com/docs/cloud-agent" },
    ],
    related: [
      { href: "/grok-bot", label: "What is Grok Bot?" },
      { href: "/guides/grok-bot-vs-devin", label: "Grok Bot vs Devin" },
      { href: "/guides/who-can-use-grok-bot", label: "Who can use Grok Bot" },
      { href: "/guides/grok-bot-alternatives", label: "Grok Bot alternatives" },
    ],
  },
  {
    slug: "grok-bot-vs-devin",
    cluster: "compare",
    title: "Grok Bot vs Devin",
    headline: "Grok Bot vs Devin",
    description:
      "Grok Bot is a named teammate in your apps. Devin is Cognition's AI software engineer that writes, runs, and tests code. Sourced 24 August 2026.",
    hero: "Grok Bot is a named teammate on one shared cloud computer. Devin is Cognition's AI software engineer. It writes, runs, and tests code, and you can take over in an embedded IDE. Use Grok Bot for signed-in business apps. Use Devin when the output should be code a human can review.",
    sections: [
      {
        id: "what-is-each-product",
        title: "What is each product?",
        blocks: [
          {
            type: "p",
            text: "Grok Bot owns a repeatable job across apps: a review list, a digest, a draft. It is not documented as an engineer that ships a pull request.",
          },
          {
            type: "p",
            text: "Cognition's intro page, read on 24 August 2026, calls Devin an autonomous AI software engineer that can write, run, and test code. The same page says you follow the work in an embedded IDE and can take over to run commands or edit. Access is at app.devin.ai, with Individual and Teams plans named. No dollar figure sat on that intro page.",
          },
          {
            type: "quote",
            text: "Devin is an autonomous AI software engineer that can write, run and test code.",
            source: 'docs.devin.ai/get-started/devin-intro, "Introducing Devin"',
          },
        ],
      },
      {
        id: "what-comes-back",
        title: "What comes back?",
        blocks: [
          {
            type: "p",
            text: "Devin's public site says it ships pull requests the way your team does, including review feedback and CI. The intro page's rule of thumb is a job you could finish in about three hours. Tickets, features, reproductions, and internal tools are the examples they list.",
          },
          {
            type: "p",
            text: "Grok Bot comes back with a reviewable artifact in the tools you already use. xAI's [use-case gallery](/guides/grok-bot-for-bug-reproduction) includes bug reproduction as a staging pack with screenshots, not a merge.",
          },
        ],
      },
      {
        id: "which-one-fits",
        title: "Which one fits?",
        blocks: [
          {
            type: "table",
            headers: ["Criterion", "Grok Bot", "Devin"],
            rows: [
              ["Job", "Named teammate across apps", "AI software engineer"],
              ["Default output", "Drafts and lists in signed-in tools", "Code you can follow in an IDE, then a pull request"],
              ["Takeover", "Take over the shared computer for passwords and codes", "Take over the embedded IDE"],
              ["Best when", "The work is research, outreach, or a standing watch", "The work is a scoped engineering ticket"],
            ],
          },
          {
            type: "p",
            text: "If the ticket is reproduce-in-staging and write a pack, this directory has [Bug Reproduction](/bots/xai-bug-reproduction). If the ticket is change the repo, that is Devin or a [Cursor Cloud Agent](/guides/grok-bot-vs-cursor-agents), not a Grok Bot merge.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Can Grok Bot write production code?",
        a: "xAI's use cases stop at reviewable artifacts and keep production changes behind approval. This directory's recipes say the same. Devin is the product that describes writing, running, and testing code as the job.",
      },
      {
        q: "Is Devin a Grok Bot alternative for inbox work?",
        a: "No. Devin's intro is engineering backlog. For mail and calendar, see [Grok Bot for inbox](/guides/grok-bot-for-inbox) or [Chief of Staff](/guides/grok-bot-chief-of-staff).",
      },
      {
        q: "Do you recommend one winner?",
        a: "No. They take different outputs. A Bot can gather the bug pack. Devin or a Cloud Agent can open the pull request. A person still merges.",
      },
    ],
    sources: [
      { href: XAI_DOCS.useCases, label: "docs.x.ai/grok-bot/use-cases" },
      { href: COMPARE_DOCS.devinIntro, label: "docs.devin.ai/get-started/devin-intro" },
    ],
    related: [
      { href: "/guides/grok-bot-vs-cursor-agents", label: "Grok Bot vs Cursor Cloud Agents" },
      { href: "/guides/grok-bot-for-bug-reproduction", label: "Grok Bot for bug reproduction" },
      { href: "/guides/grok-bot-alternatives", label: "Grok Bot alternatives" },
    ],
  },
  {
    slug: "grok-bot-vs-manus",
    cluster: "compare",
    title: "Grok Bot vs Manus",
    headline: "Grok Bot vs Manus",
    description:
      "Grok Bot works inside your signed-in apps on one shared computer. Manus describes a cloud sandbox that returns finished files. Sourced 24 August 2026.",
    hero: "Grok Bot is a named teammate on one shared cloud computer. Manus describes a cloud sandbox with a browser and code that keeps going after you close the tab, and hands back a finished file. Use Grok Bot when the change should land in your apps. Use Manus when you want a file out of a sandbox.",
    sections: [
      {
        id: "what-is-each-product",
        title: "What is each product?",
        blocks: [
          {
            type: "p",
            text: "Grok Bot signs into the apps on its account-scoped computer and leaves the work there: a CRM list, a draft email, a Notion note. The login stays on that computer for every Bot on the account.",
          },
          {
            type: "p",
            text: "Manus's own customer-service comparison, published on manus.im and read on 24 August 2026, calls Manus an autonomous agent that plans, executes, and delivers a finished result. The same page says tasks run in a dedicated cloud sandbox with a browser and code, and that work can continue after you close the tab.",
          },
          {
            type: "p",
            text: "The Manus docs welcome page, fetched the same day, was not a product overview. It said access would resume at 8:00 a.m. on 25 August 2026, Singapore time, while they processed scheduled data deletion as the company prepared to operate independently again. Treat that as a live access fact, not a feature.",
          },
        ],
      },
      {
        id: "where-does-the-output-land",
        title: "Where does the output land?",
        blocks: [
          {
            type: "table",
            headers: ["Criterion", "Grok Bot", "Manus"],
            rows: [
              ["Workspace", "Account-scoped cloud computer, signed into your apps", "Dedicated cloud sandbox with a browser and code"],
              ["What you get back", "Work inside those apps", "A finished file or report from the sandbox"],
              ["Access on 24 August 2026", "Eligible SuperGrok or Cursor plans, per xAI get-started", "Welcome page announced a resume at 08:00 SGT on 25 August 2026 for some jurisdictions"],
              ["Best when", "The record should change in the tool you already use", "You want research or a document without giving the agent your production logins"],
            ],
          },
          {
            type: "p",
            text: "Manus's comparison page lists a free plan with daily credits and paid plans from $20 a month. That number is theirs, on their page, that day. xAI still does not print a Heavy price, so we do not invent one to complete the row.",
          },
        ],
      },
      {
        id: "what-we-would-not-claim",
        title: "What we would not claim",
        blocks: [
          {
            type: "p",
            text: "We did not watch Manus sign into a CRM. Their page describes a sandbox and a file. Third-party roundups that say otherwise are not a source here. If Manus's docs change after the 25 August resume, this page needs another fetch.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Is Manus available right now?",
        a: "On 24 August 2026 their welcome docs said some users were blocked until 8:00 a.m. on 25 August 2026, Singapore time, for a scheduled deletion. Recheck manus.im/docs before you plan a trial around that hour.",
      },
      {
        q: "Does Grok Bot return a file the way Manus describes?",
        a: "Grok Bot can write files on its computer. The product pitch is work inside your tools. Manus's own comparison stresses a finished result from a sandbox. Pick by where you want the artifact to live.",
      },
      {
        q: "Should I give Manus the same logins I put on Grok Bot?",
        a: "Grok Bot's computer is already a single trust zone for the account. Manus describes a sandbox. Do not copy production credentials into either place without a human yes. See [Grok Bot security](/guides/grok-bot-security).",
      },
    ],
    sources: [
      { href: XAI_DOCS.overview, label: "docs.x.ai/grok-bot/overview" },
      { href: COMPARE_DOCS.manusWelcome, label: "manus.im/docs/introduction/welcome" },
      { href: COMPARE_DOCS.manusBlog, label: "Manus customer-service comparison" },
    ],
    related: [
      { href: "/guides/grok-bot-vs-claude-cowork", label: "Grok Bot vs Claude Cowork" },
      { href: "/guides/grok-bot-connectors", label: "Grok Bot connectors" },
      { href: "/guides/grok-bot-alternatives", label: "Grok Bot alternatives" },
    ],
  },
  {
    slug: "grok-bot-alternatives",
    cluster: "compare",
    title: "Grok Bot alternatives",
    headline: "Grok Bot alternatives",
    description:
      "A short chooser for Grok Bot, Claude Cowork, ChatGPT Work, Cursor Cloud Agents, Devin, and Manus. Each row links to a sourced 1:1 page. 24 August 2026.",
    hero: "Grok Bot is the right tool when a named teammate should keep working in signed-in apps on one shared computer. It is the wrong tool when you need local files, a pull request, or a sandbox file. The table below only points at the 1:1 pages. It does not rank a winner.",
    sections: [
      {
        id: "how-to-choose",
        title: "How do you choose?",
        blocks: [
          {
            type: "p",
            text: "Start from the output, not the brand. If the work should land in a CRM, inbox, or ad account, stay on Grok Bot. If the work should land in a folder on your laptop, read Cowork. If the work should land in a ChatGPT file, read Work. If the work should land in a pull request, read Cursor or Devin. If you want a sandbox file and fewer production logins, read Manus.",
          },
          {
            type: "table",
            headers: ["If you need", "Read"],
            rows: [
              ["Local files on the desktop", "[Grok Bot vs Claude Cowork](/guides/grok-bot-vs-claude-cowork)"],
              ["A long pass inside ChatGPT", "[Grok Bot vs ChatGPT Work](/guides/grok-bot-vs-chatgpt-work)"],
              ["A pull request from a connected repo", "[Grok Bot vs Cursor Cloud Agents](/guides/grok-bot-vs-cursor-agents)"],
              ["An AI software engineer on a ticket", "[Grok Bot vs Devin](/guides/grok-bot-vs-devin)"],
              ["A sandbox that returns a file", "[Grok Bot vs Manus](/guides/grok-bot-vs-manus)"],
            ],
          },
        ],
      },
      {
        id: "what-this-page-refuses",
        title: "What this page refuses",
        blocks: [
          {
            type: "p",
            text: "It does not name a seventh product. It does not invent prices. It does not declare a best general-purpose agent. Those essays already exist elsewhere, and they go stale in a week. Each linked page quotes the vendor and stops.",
          },
          {
            type: "p",
            text: "For the product itself, start at [What is Grok Bot?](/grok-bot). For a roster from this directory, use [Install a Grok Bot team](/guides/install-a-grok-bot-team).",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Is Grok Bot better than the others?",
        a: "Not as a universal answer. It is better when you want a standing named roster on one shared computer. It is worse when the job is a repo merge or a local folder. The 1:1 pages state the fit. This page only routes you.",
      },
      {
        q: "Why not one giant comparison table?",
        a: "A seven-column table forces unsourced cells. We already cut that pattern off the pillar. Each pair has its own sources. This chooser stays a router.",
      },
      {
        q: "Where do I go if I already picked Grok Bot?",
        a: "Read [How do you create a Grok Bot?](/guides/create-a-grok-bot), then [install a team](/guides/install-a-grok-bot-team). Connect [connectors](/guides/grok-bot-connectors) before you paste the prompt.",
      },
    ],
    sources: [
      { href: XAI_DOCS.overview, label: "docs.x.ai/grok-bot/overview" },
      { href: XAI_DOCS.getStarted, label: "docs.x.ai/grok-bot/get-started" },
    ],
    related: [
      { href: "/grok-bot", label: "What is Grok Bot?" },
      { href: "/guides/grok-bot-vs-claude-cowork", label: "vs Claude Cowork" },
      { href: "/guides/grok-bot-vs-chatgpt-work", label: "vs ChatGPT Work" },
      { href: "/guides/install-a-grok-bot-team", label: "Install a team" },
    ],
  },
];
