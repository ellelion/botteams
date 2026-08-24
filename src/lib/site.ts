export const site = {
  name: "botteams.ai",
  updatedAt: "2026-08-24",
  verifiedOn: "2026-08-23",
  title: "Grok Bot teams directory · botteams.ai",
  description:
    "Public directory of company teams for Grok Bot. Copy one installer prompt, paste it into Grok Bot, and stand up a named team. Operated by Ellelion LLC. Not affiliated with xAI.",
  url: "https://botteams.ai",
  company: "Ellelion LLC",
  email: "info@ellelion.com",
  address: "30 N Gould St Ste R, Sheridan, WY 82801, United States",
  github: "https://github.com/ellelion/botteams",
  typeInDomain: "grokbotteam.ai",
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
  bots: "https://docs.x.ai/grok-bot/bots",
  chat: "https://docs.x.ai/grok-bot/chat-and-collaboration",
  routines: "https://docs.x.ai/grok-bot/skills-routines-and-automations",
  useCases: "https://docs.x.ai/grok-bot/use-cases",
} as const;

/* xAI's public gallery of Grok Bot use cases. Cited on every recipe we
   directory from it. Sourcing, never endorsement: nothing on this site is
   certified by xAI. */
export const XAI_USE_CASE_GALLERY = "https://x.ai/bot/use-cases";
