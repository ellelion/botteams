import { site } from "@/lib/site";

export const en = {
  siteName: site.name,
  wordmark: "Grok Bot Teams",
  h1: "Install a Grok Bot team, not a bot.",
  eyebrow: "Company packs for Grok Bot",
  answer:
    "Copy one installer prompt, paste it into Grok Bot, and stand up a named team: agents, a room, a sidebar section, and routines you confirm. No accounts on this site. No plugin API. No one-click OAuth.",
  entity: site.entity,
  verified: "Verified on",
  nav: {
    packs: "Packs",
    docs: "Docs",
    github: "GitHub",
    homeAria: "Grok Bot Teams, home",
    mainAria: "Main",
  },
  home: {
    indexTitle: "The company packs",
    howTitle: "How it works",
    howBody:
      "Pick a pack. Copy the installer prompt. Paste it into Grok Bot. The prompt creates named agents and a room (6 seats max), tells you to make a sidebar section, and pings each agent so you can confirm routines. Connectors must already be on the account.",
    typeIn:
      "Canonical domain grokbotteams.ai. grokbotteam.ai (no s) is a type-in that should 301 when DNS exists. This repo does not buy or configure DNS.",
    sponsorsTitle: "Sponsor slots",
    sponsorsNote: "Fifteen slots. All available. No fake advertisers.",
    available: "Available",
    scrollCue: "Scroll the packs",
    exampleBadge: "Example pack",
    liveBadge: "Installable",
  },
  pack: {
    copy: "Copy installer prompt",
    copied: "Copied",
    copyFail: "Copy failed",
    seats: "seats",
    section: "Sidebar section",
    connectors: "Connectors already on the account",
    agents: "Agents",
    rooms: "Rooms",
    routines: "Routines",
    skills: "Skills",
    reuse: "Reuse existing if present",
    exampleNote:
      "Example pack. The copy button still builds a real prompt so you can see the format. Do not treat this as a production recipe.",
    installNote:
      "Paste the prompt into Grok Bot. This is not one-click OAuth and not a plugin install.",
  },
  docs: {
    title: "Pack format and install notes",
    h1: "Pack format and install notes",
  },
  footer: {
    mit: "MIT",
    sisters: "Sister sites",
  },
  notFound: {
    kicker: "Not on the shelf",
    body: "This page is not in the pack index.",
    back: "Back to the shelf",
  },
} as const;
