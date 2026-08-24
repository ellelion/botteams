import type { Guide } from "@/lib/guide-types";
import { XAI_DOCS } from "@/lib/site";

export const howtoGuides: Guide[] = [
  {
    slug: "install-a-grok-bot-team",
    cluster: "howto",
    title: "How to install a Grok Bot team",
    headline: "How do you install a Grok Bot team?",
    description:
      "Copy one installer prompt from botteams.ai, connect the connectors first, paste it into Grok Bot, and confirm each routine. Nothing installs on this site. 24 August 2026.",
    hero: "Pick a team on this directory, connect the connectors it lists, copy the installer prompt, and paste that text into Grok Bot. The prompt creates named Bots and a group chat of two to six. You confirm each routine. Nothing on this site signs in, starts OAuth, or touches your account.",
    sections: [
      {
        id: "what-you-are-pasting",
        title: "What are you pasting?",
        blocks: [
          {
            type: "p",
            text: "A team on this site is one markdown file. Front matter names the Bots, the group chat, the routines, and the connectors the account needs first. The site turns that file into one installer prompt. A bot file is the same shape with one Bot and no group chat. The [team spec](/docs) is the format.",
          },
          {
            type: "p",
            text: "The prompt always says it is from botteams.ai and from this GitHub repo. It tells Grok Bot not to start OAuth. If a connector is missing, it tells you to open Settings, then Plugins.",
          },
        ],
      },
      {
        id: "the-steps",
        title: "What are the steps?",
        blocks: [
          {
            type: "ol",
            items: [
              "Open an eligible Grok Bot app and sign in. See [Who can use Grok Bot?](/guides/who-can-use-grok-bot).",
              "Open the team or bot page. Read the connectors. Connect each one in Settings, then Plugins, before you paste.",
              "Copy the installer prompt. Customize it on the page if you want different names. The edits live in the URL hash. Nothing is stored here.",
              "Paste the prompt into Grok Bot. Let it create each Bot with the exact names, then set Name, Title, and Description on the profile.",
              "For a team, let it open one group chat with two to six of those Bots. You create the sidebar section yourself. The prompt will tell you the section name.",
              "Confirm each routine card. A routine is not saved until you confirm. One Bot can own up to 50 routines.",
            ],
          },
          {
            type: "p",
            text: "Take over the computer for passwords, passkeys, two-factor codes, and CAPTCHAs. Do not paste those into chat. After the roster exists, watch one real task before you trust a routine to write.",
          },
        ],
      },
      {
        id: "what-this-site-never-does",
        title: "What does this site never do?",
        blocks: [
          {
            type: "ul",
            items: [
              "It never signs into Grok Bot.",
              "It never starts an OAuth flow.",
              "It never creates a Bot on your account.",
              "It never stores your customized prompt. The hash is the store.",
            ],
          },
          {
            type: "p",
            text: "If you only need one Bot and no group chat, open a page under [/bots](/?kind=bot). The installer then says not to create a group chat and not to create a sidebar section.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Why do connectors have to be connected first?",
        a: "Grok Bot connectors are account-wide. The installer cannot walk OAuth. If a plugin is missing, the prompt stops and tells you to connect it. Read or draft on a team page is wording, not a lock. See [Grok Bot connectors](/guides/grok-bot-connectors).",
      },
      {
        q: "What if I already created some of the Bots?",
        a: "Customize the recipe and mark the ones that already exist. The prompt then says to check the sidebar, create only the missing Bots, and rename the ones you listed. It will not ask for a second group chat if the team is already installed.",
      },
      {
        q: "Does the prompt publish or send anything?",
        a: "The stock recipes stop at review. Suggest lines say do not send, do not change a record, do not touch production. Read the prompt before you paste it. You are the one who confirms the routine cards.",
      },
    ],
    sources: [
      { href: XAI_DOCS.bots, label: "docs.x.ai/grok-bot/bots" },
      { href: XAI_DOCS.getStarted, label: "docs.x.ai/grok-bot/get-started" },
    ],
    related: [
      { href: "/", label: "Team directory" },
      { href: "/docs", label: "Team spec" },
      { href: "/guides/create-a-grok-bot", label: "Create a Grok Bot" },
      { href: "/guides/grok-bot-group-chat", label: "Group chat" },
    ],
  },
  {
    slug: "create-a-grok-bot",
    cluster: "howto",
    title: "How to create a Grok Bot",
    headline: "How do you create a Grok Bot?",
    description:
      "Create one Grok Bot from New chat, then Create new agent, then Edit Profile. Give it one job, a stop line, and a first task. 24 August 2026.",
    hero: "Create one Bot from New chat, then Create new agent, then Edit Profile. Set a short name, a one-line title, and a description that names the job, the sources, and the stop line. Give it one task. Take over the computer for passwords. Save a skill only after the job works twice.",
    sections: [
      {
        id: "the-click-path",
        title: "What is the click path?",
        blocks: [
          {
            type: "p",
            text: "xAI's Bots doc, read on 24 August 2026, says you create via New chat, then Create new agent, then Edit Profile. The profile fields are name, title, description, and avatar. Conversation is the task. Title is the one-line job. Description holds durable rules and approvals.",
          },
          {
            type: "ol",
            items: [
              "Install the macOS or Windows app and sign in with an eligible plan.",
              "Open New chat, then Create new agent.",
              "Edit Profile. Use a short name. Write one primary job in the title.",
              "In the description, name the sources, the output format, and the stop line. Put send, publish, purchase, deletion, and production behind approval.",
              "Give the Bot a first task that repeats those four things: outcome, sources, constraints, deliverable.",
              "Take over the computer for passwords, passkeys, two-factor codes, and CAPTCHAs.",
              "Correct the process. Save a skill only after the job works twice. Create a routine after that.",
            ],
          },
        ],
      },
      {
        id: "what-to-put-in-the-profile",
        title: "What do you put in the profile?",
        blocks: [
          {
            type: "p",
            text: "xAI's first-Bot example is a product-performance investigator called Piper. The useful part is the stopping rule: keep links and screenshots, separate evidence from hypotheses, never change production. Write that kind of sentence into the description before you write a personality.",
          },
          {
            type: "p",
            text: "If the job is already a roster on this directory, do not hand-build six profiles. Use [Install a Grok Bot team](/guides/install-a-grok-bot-team). If you want the profile language we use on recipes, see [Write a Grok Bot profile](/guides/write-a-grok-bot-profile).",
          },
        ],
      },
      {
        id: "when-to-stop-at-one",
        title: "When should you stop at one Bot?",
        blocks: [
          {
            type: "p",
            text: "One Bot is enough when one job owns the outcome. A group chat is for two to six Bots that should talk to each other. A second Bot is not a security boundary. See [Grok Bot group chat](/guides/grok-bot-group-chat) and [Grok Bot security](/guides/grok-bot-security).",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Does creating a Bot also create a group chat?",
        a: "No. A Bot is one teammate. A group chat is a later step with two to six Bots. The single-bot installer on this directory says not to create a group chat and not to create a sidebar section.",
      },
      {
        q: "Can you attach a skill at create time?",
        a: "The team spec on this site says skills cannot be attached at Bot create time. xAI's order that holds up is one-time task, corrected task, saved skill, then routine. See [Skills and routines](/guides/grok-bot-skills-and-routines).",
      },
      {
        q: "What if I need the same job on a schedule tonight?",
        a: "Do not skip the two successful runs. A test run performs real work. Keep writes behind approval until you have watched it twice, then put the skill on a routine.",
      },
    ],
    sources: [
      { href: XAI_DOCS.bots, label: "docs.x.ai/grok-bot/bots" },
      { href: XAI_DOCS.getStarted, label: "docs.x.ai/grok-bot/get-started" },
    ],
    related: [
      { href: "/grok-bot", label: "What is Grok Bot?" },
      { href: "/guides/write-a-grok-bot-profile", label: "Write a profile" },
      { href: "/guides/install-a-grok-bot-team", label: "Install a team" },
      { href: "/guides/grok-bot-skills-and-routines", label: "Skills and routines" },
    ],
  },
  {
    slug: "grok-bot-connectors",
    cluster: "howto",
    title: "Grok Bot connectors",
    headline: "How do Grok Bot connectors work?",
    description:
      "Grok Bot connectors are account-wide. Every Bot can reach every connected tool. This directory lists 342 connectors. 24 August 2026.",
    hero: "Connectors in Grok Bot are account-wide. The app currently labels them Plugins. Every Bot on the account can reach every connected tool. Read or draft on a team page is wording in the installer, not a lock. Prefer a plugin when one exists. Connect them before you paste a prompt from this directory.",
    sections: [
      {
        id: "what-a-connector-is",
        title: "What is a connector?",
        blocks: [
          {
            type: "p",
            text: "A connector is an account-level plugin. The switch is Settings, then Plugins. xAI's overview says a Bot can use a browser, a filesystem, a terminal, and connectors. Prefer the plugin when the job is a first-party API. Use the browser when the site has no plugin.",
          },
          {
            type: "p",
            text: "This directory keeps a [connectors catalog](/connectors). On 24 August 2026 that list had 342 rows, last checked 21 August 2026. A team page lists the connectors it expects already connected. The installer never starts OAuth.",
          },
        ],
      },
      {
        id: "why-modes-are-wording",
        title: "Why are read and draft only wording?",
        blocks: [
          {
            type: "p",
            text: "Team files on this site mark each connector as read or draft. That sentence goes into the prompt. It does not create a second permission. Grok Bot does not give one Bot a private Salesforce and another Bot a private Gmail. The computer is shared. The plugin is shared.",
          },
          {
            type: "quote",
            text: "Do not use separate Bots as a security boundary.",
            source: 'docs.x.ai/grok-bot/approvals-security-and-privacy, "Understand the shared-computer boundary"',
          },
          {
            type: "p",
            text: "Put only credentials that every Bot on the account may use. If a tool is too sensitive for the rest of the roster, do not connect it. See [Grok Bot security](/guides/grok-bot-security).",
          },
        ],
      },
      {
        id: "how-to-connect-them",
        title: "How do you connect them?",
        blocks: [
          {
            type: "ol",
            items: [
              "Open Grok Bot Settings, then Plugins.",
              "Connect each connector the team page lists.",
              "Stay there for the OAuth screens. Do not ask the installer to walk them.",
              "Copy the installer only after the plugins show as connected.",
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: "Does a Bot-only connector list hide the plugin from other Bots?",
        a: "No. The per-Bot list is which Bot is expected to use the tool. Every connected plugin stays reachable. Treat the roster as one trust zone.",
      },
      {
        q: "Should you connect every connector in the catalog?",
        a: "No. 342 rows is a map, not a shopping list. Connect the ones the job needs. Each extra plugin is another place a Bot can write if a prompt goes wrong.",
      },
      {
        q: "What if the vendor has no plugin?",
        a: "Use the browser on the shared computer, and take over for logins. Sign out when that job should stop. Browser sessions can remain after you delete a Bot.",
      },
    ],
    sources: [
      { href: XAI_DOCS.overview, label: "docs.x.ai/grok-bot/overview" },
      { href: XAI_DOCS.approvals, label: "docs.x.ai/grok-bot/approvals-security-and-privacy" },
    ],
    related: [
      { href: "/connectors", label: "Connectors catalog" },
      { href: "/guides/grok-bot-security", label: "Grok Bot security" },
      { href: "/guides/install-a-grok-bot-team", label: "Install a team" },
    ],
  },
  {
    slug: "grok-bot-skills-and-routines",
    cluster: "howto",
    title: "Grok Bot skills and routines",
    headline: "How do Grok Bot skills and routines work?",
    description:
      "A skill is the written method. A routine is the schedule or event that runs it. Caps: 50 routines per Bot, 20 stored runs. 24 August 2026.",
    hero: "A skill is the written method. A routine is the schedule or event that runs it. The order that holds up is one-time task, corrected task, saved skill, then routine. One Bot can own 50 routines. Grok Bot keeps the 20 most recent runs of each. Deleting a routine has no undo.",
    sections: [
      {
        id: "what-is-a-skill",
        title: "What is a skill?",
        blocks: [
          {
            type: "quote",
            text: "A skill is a reusable set of instructions for how to do a task.",
            source: 'docs.x.ai/grok-bot/skills-routines-and-automations, "Skills and routines"',
          },
          {
            type: "p",
            text: "Type / for a skill. Teach a task can draft a skill from a browser demonstration up to ten minutes. Audio is not recorded. Treat that draft as a happy path. Write the failure cases yourself. Skills cannot be attached at Bot create time on the format this directory uses.",
          },
        ],
      },
      {
        id: "what-is-a-routine",
        title: "What is a routine?",
        blocks: [
          {
            type: "quote",
            text: "A routine tells one Bot when to run a workflow, on a schedule or, where supported, after an event.",
            source: 'docs.x.ai/grok-bot/skills-routines-and-automations, "Skills and routines"',
          },
          {
            type: "p",
            text: "A routine is owned by one Bot. There is no documented cap on a team as a whole, so this directory does not invent one. The published caps are 50 routines per Bot and 20 stored runs each. Type @ for Bots, groups, routines, and connectors.",
          },
          {
            type: "p",
            text: "A test run performs real work. Keep writes behind approval until you have watched it twice. Deleting a routine has no undo. Deleting a Bot removes the routines it owned. Files on the shared computer can remain.",
          },
        ],
      },
      {
        id: "when-to-promote",
        title: "When do you promote a skill to a routine?",
        blocks: [
          {
            type: "ol",
            items: [
              "Run one real task with a safe scope.",
              "Correct the result until it is reviewable.",
              "Save the successful process as a skill.",
              "Test it on a second input.",
              "Create a routine only when retries and failure cases are defined.",
              "Keep consequential external actions behind approval.",
            ],
          },
          {
            type: "p",
            text: "That list is the close of xAI's use-cases page, read on 24 August 2026. The installers on this directory follow it. They ping the owner Bot and wait for your confirm card.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Can one routine belong to a whole team?",
        a: "No. A routine has one owner Bot. A group chat can talk about the result. The schedule still belongs to one teammate. See [Grok Bot group chat](/guides/grok-bot-group-chat).",
      },
      {
        q: "What happens to old runs?",
        a: "xAI documents 20 stored runs per routine. Treat anything older as gone. If you need a longer archive, copy the useful runs into a note you own.",
      },
      {
        q: "Should a routine send mail on the first night?",
        a: "No. The first nights should stop at a review list. Add send only after you have watched the draft twice and turned the approval on with your eyes open.",
      },
    ],
    sources: [
      { href: XAI_DOCS.routines, label: "docs.x.ai/grok-bot/skills-routines-and-automations" },
      { href: XAI_DOCS.useCases, label: "docs.x.ai/grok-bot/use-cases" },
    ],
    related: [
      { href: "/grok-bot", label: "What is Grok Bot?" },
      { href: "/guides/create-a-grok-bot", label: "Create a Grok Bot" },
      { href: "/guides/write-a-grok-bot-profile", label: "Write a profile" },
    ],
  },
  {
    slug: "write-a-grok-bot-profile",
    cluster: "howto",
    title: "How to write a Grok Bot profile",
    headline: "How do you write a Grok Bot profile?",
    description:
      "Name, title, and description for a Grok Bot that stops before send, publish, or production. Uses this directory's approval pattern. 24 August 2026.",
    hero: "A Grok Bot profile is a name, a one-line title, and a description that states the job, the sources, the output, and the stop line. Write the approval into the description before you write a personality. This directory's recipes all stop before send, publish, or production.",
    sections: [
      {
        id: "the-four-sentences",
        title: "What goes in the description?",
        blocks: [
          {
            type: "p",
            text: "xAI's use-cases page says to put the job, source systems, output format, and standing boundaries in the Bot description. Four sentences is enough:",
          },
          {
            type: "ol",
            items: [
              "The outcome this Bot owns, in one clause.",
              "The systems it may read.",
              "The artifact it must leave, and where.",
              "The actions it must not take until you approve.",
            ],
          },
          {
            type: "p",
            text: "Example we use on [Chief of Staff](/bots/xai-chief-of-staff): scan mail, calendar, chat, and notes; write one short read-out with a source on each line; never send mail; never accept a meeting.",
          },
        ],
      },
      {
        id: "the-suggest-lines",
        title: "What are the suggest lines?",
        blocks: [
          {
            type: "p",
            text: "Every recipe on this directory carries suggest lines. They become standing instructions in the installer. The ones we turn on by default are some mix of: never send, never change a record, never touch production, review only until I approve. They are not a second permission system. They are sentences the Bot is told to obey.",
          },
          {
            type: "p",
            text: "If you Customize a team, you can toggle those lines. The prompt rewrites. Read it. If a line is off, you chose that.",
          },
        ],
      },
      {
        id: "what-to-leave-out",
        title: "What should you leave out?",
        blocks: [
          {
            type: "ul",
            items: [
              "A second Bot used as a vault. That does not isolate logins.",
              "A personality paragraph with no stop line.",
              "Passwords, codes, or recovery keys in the description.",
              "A claim that xAI certified the recipe. From xAI on this site is sourcing, not a badge.",
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: "Should the title be cute?",
        a: "Short is better than cute. Title is the one-line job the sidebar shows. Piper works because the description holds the stop line, not because the name is clever.",
      },
      {
        q: "Can the description replace a skill?",
        a: "No. The description is durable rules. A skill is the method for one task. Put approvals in the description so they survive a bad skill draft. See [Skills and routines](/guides/grok-bot-skills-and-routines).",
      },
      {
        q: "Do you write profiles for people who already have a team file?",
        a: "Open the team, press Customize, and edit the persona there. The installer prompt is the profile you are about to paste. Do not maintain a second copy in a doc.",
      },
    ],
    sources: [
      { href: XAI_DOCS.useCases, label: "docs.x.ai/grok-bot/use-cases" },
      { href: XAI_DOCS.bots, label: "docs.x.ai/grok-bot/bots" },
    ],
    related: [
      { href: "/guides/create-a-grok-bot", label: "Create a Grok Bot" },
      { href: "/docs", label: "Team spec" },
      { href: "/guides/install-a-grok-bot-team", label: "Install a team" },
    ],
  },
  {
    slug: "grok-bot-group-chat",
    cluster: "howto",
    title: "Grok Bot group chat",
    headline: "What is a Grok Bot group chat?",
    description:
      "A Grok Bot team on this directory is two to six named Bots in one group chat, plus standing routines. Account cap: 50 Bots and group chats combined. 24 August 2026.",
    hero: "A group chat is two to six Grok Bots in one conversation. On this directory a team is that chat plus standing routines. A bot is one Bot and no chat. The published account cap is 50 Bots and group chats combined. A second Bot is still not a security boundary.",
    sections: [
      {
        id: "team-versus-bot",
        title: "What is a team versus a bot?",
        blocks: [
          {
            type: "p",
            text: "xAI documents group chat as selecting two to six Bots. This directory uses that noun. A team file lives under /teams and always has a room. A bot file lives under /bots and never does. We never add the two counts into one 'teams' number, because a recipe with no group chat is not a team.",
          },
          {
            type: "p",
            text: "The homepage FAQ already answers 'What is a Grok Bot team?' in one breath. This page is the click path and the cap.",
          },
        ],
      },
      {
        id: "how-to-create-one",
        title: "How do you create one?",
        blocks: [
          {
            type: "ol",
            items: [
              "Create the Bots first. Exact names.",
              "Open a group chat and add two to six of them. Do not add a seventh.",
              "Create the sidebar section yourself. Grok Bot will not do that from our installer.",
              "Move the group chat and the Bots into that section.",
              "Confirm each routine on its owner Bot.",
            ],
          },
          {
            type: "p",
            text: "The installer from [Install a Grok Bot team](/guides/install-a-grok-bot-team) writes those steps for you. Paste it only after [connectors](/guides/grok-bot-connectors) are on the account.",
          },
        ],
      },
      {
        id: "the-cap",
        title: "What is the cap?",
        blocks: [
          {
            type: "p",
            text: "The Bots doc, read on 24 August 2026, publishes an account cap of 50 Bots and group chats combined. One Bot can own 50 routines. There is no documented team-level routine cap, so we do not invent one.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Can seven Bots sit in one group chat?",
        a: "Not on the docs we read. The range is two to six. If you need a seventh job, give it its own Bot and keep it out of that chat, or split the work.",
      },
      {
        q: "Does a group chat isolate files?",
        a: "No. Isolation is the account computer. Every Bot in the chat, and every Bot outside it, can see logins and files on that computer. See [Grok Bot security](/guides/grok-bot-security).",
      },
      {
        q: "Why does a single Bot page refuse a group chat?",
        a: "A group chat with one member is not a team. The bot installer says so, so you do not end up with an empty room and a section that means nothing.",
      },
    ],
    sources: [
      { href: XAI_DOCS.chat, label: "docs.x.ai/grok-bot/chat-and-collaboration" },
      { href: XAI_DOCS.bots, label: "docs.x.ai/grok-bot/bots" },
    ],
    related: [
      { href: "/", label: "Teams" },
      { href: "/docs", label: "Team spec" },
      { href: "/guides/install-a-grok-bot-team", label: "Install a team" },
      { href: "/grok-bot", label: "What is Grok Bot?" },
    ],
  },
];
