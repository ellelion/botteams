/* Public name is botteams.ai. Never grokbotteams.ai in user-facing copy. */
export const site = {
  name: "botteams.ai",
  updatedAt: "2026-08-25",
  verifiedOn: "2026-08-23",
  title: "Grok Bot teams directory · botteams.ai",
  description:
    "Public directory of company teams for Grok Bot. Copy one installer prompt, paste it into Grok Bot, and stand up a named team. Operated by Ellelion LLC. Not affiliated with xAI.",
  url: "https://botteams.ai",
  company: "Ellelion LLC",
  email: "info@ellelion.com",
  address: "30 N Gould St Ste R, Sheridan, WY 82801, United States",
  github: "https://github.com/ellelion/botteams",
  xHandle: "@Botteams_ai",
  xUrl: "https://x.com/Botteams_ai",
  entity:
    "botteams.ai is a public directory of company teams for Grok Bot, operated by Ellelion LLC. Not affiliated with xAI.",
  /* The other Ellelion products. They are not "sisters", they are the
     rest of what this company ships. */
  ellelionSites: [
    { name: "ellelion.com", href: "https://ellelion.com" },
    { name: "skillselion.com", href: "https://skillselion.com" },
    { name: "agentpluginsdirectory.com", href: "https://agentpluginsdirectory.com" },
  ],
  grokHome: "https://grok.com",
  brandGuidelines: "https://x.ai/legal/brand-guidelines",
} as const;

export const APD_HOME = "https://agentpluginsdirectory.com";
export const SKILLSELION_HOME = "https://skillselion.com";
export const STRIPE_BEST_PRACTICES =
  "https://skillselion.com/skills/stripe/ai/stripe-best-practices";

export const XAI_DOCS = {
  overview: "https://docs.x.ai/grok-bot/overview",
  getStarted: "https://docs.x.ai/grok-bot/get-started",
  bots: "https://docs.x.ai/grok-bot/bots",
  chat: "https://docs.x.ai/grok-bot/chat-and-collaboration",
  routines: "https://docs.x.ai/grok-bot/skills-routines-and-automations",
  computer: "https://docs.x.ai/grok-bot/computer-and-apps",
  approvals: "https://docs.x.ai/grok-bot/approvals-security-and-privacy",
  useCases: "https://docs.x.ai/grok-bot/use-cases",
  launch: "https://x.ai/news/introducing-grok-bot",
} as const;

/* Date this directory last read the Grok Bot docs end to end. */
export const GROK_BOT_GUIDE_UPDATED = "2026-08-24";

/* Date the /guides cluster was verified against live vendor docs. */
export const GUIDES_UPDATED = "2026-08-24";

/* Date the Chief of Staff collection was reviewed against its recipe files. */
export const CHIEF_OF_STAFF_COLLECTION_UPDATED = "2026-08-26";

export const COMPARE_DOCS = {
  coworkOverview: "https://claude.com/docs/cowork/overview",
  coworkGetStarted: "https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork",
  chatgptWorkHelp: "https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex",
  chatgptWorkLaunch: "https://openai.com/index/chatgpt-for-your-most-ambitious-work/",
  cursorCloudAgent: "https://cursor.com/docs/cloud-agent",
  devinIntro: "https://docs.devin.ai/get-started/devin-intro",
  manusWelcome: "https://manus.im/docs/introduction/welcome",
  manusBlog: "https://manus.im/blog/best-ai-agents-customer-service",
} as const;

/* xAI's public gallery of Grok Bot use cases. Cited on every recipe we
   directory from it. Sourcing, never endorsement: nothing on this site is
   certified by xAI. */
export const XAI_USE_CASE_GALLERY = "https://x.ai/bot/use-cases";
