import { site } from "@/lib/site";

export const en = {
  siteName: site.name,
  wordmark: "Grok Bot Teams",
  h1: "Install a Grok Bot team, not a bot.",
  eyebrow: "Company teams for Grok Bot",
  answer:
    "Give each Bot a job. Copy one installer prompt, paste it into Grok Bot, and stand up a named team: Bots, a group chat, a sidebar section, and routines you confirm. No accounts on this site. No plugin API. No one-click OAuth.",
  entity: site.entity,
  verified: "Verified",
  nav: {
    packs: "Teams",
    docs: "Spec",
    github: "GitHub",
    homeAria: "Grok Bot Teams, home",
    mainAria: "Main",
  },
  home: {
    indexTitle: "Company teams",
    howTitle: "How it works",
    howBody:
      "Pick a team. Copy the installer prompt. Paste it into Grok Bot. The prompt creates named Bots and a group chat (two to six Bots), tells you to make a sidebar section, and pings each Bot so you can confirm routines. Connectors must already be on the account.",
    typeIn:
      "Canonical domain grokbotteams.ai. grokbotteam.ai (no s) is a type-in that should 301 when DNS exists. This repo does not buy or configure DNS.",
    sponsorsTitle: "Sponsor slots",
    sponsorsNote: "Fifteen slots. All available. No fake advertisers.",
    available: "Available",
    scrollCue: "Browse teams",
    exampleBadge: "Example",
    liveBadge: "Installable",
    filterAll: "All",
    viewCards: "Cards",
    viewTable: "Table",
    specCta: "Team spec",
  },
  pack: {
    copy: "Copy installer prompt",
    copied: "Copied",
    copyFail: "Copy failed",
    seats: "bots",
    bots: "bots",
    section: "Sidebar section",
    connectors: "Connectors already on the account",
    connectorsNote:
      "Connectors are account-wide. This team expects these already on the account. The per-Bot row is which Bot uses which ones, not a second OAuth.",
    agents: "Bots",
    rooms: "Group chat",
    routines: "Routines",
    skills: "Skills",
    reuse: "Reuse existing if present",
    exampleNote:
      "Example team. The copy button still builds a real prompt so you can see the format. Do not treat this as a production recipe.",
    installNote:
      "Paste the prompt into Grok Bot. This is not one-click OAuth and not a plugin install.",
    ownerBot: "Owner Bot",
  },
  docs: {
    title: "Team spec",
    h1: "Team spec",
  },
  footer: {
    mit: "MIT",
    sisters: "Sister sites",
  },
  notFound: {
    kicker: "Not on the shelf",
    body: "This page is not in the team index.",
    back: "Back to teams",
  },
} as const;
