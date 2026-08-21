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
    connectorsNav: "Connectors",
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
    bots: "bots",
    section: "Sidebar section",
    connectors: "Connectors already on the account",
    connectFirst: "Connect first",
    promptTitle: "Installer prompt",
    connectorsNote:
      "Connectors are account-wide. This team expects these already on the account. The per-Bot row is which Bot uses which ones, not a second OAuth.",
    agents: "Bots",
    botTag: "Bot",
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
  connectors: {
    eyebrow: "Grok Bot connectors",
    h1: "Connectors",
    intro: (count: number) =>
      `Every connector Grok Bot supports, ${count} of them, grouped the way the catalog groups them. Connectors are account-wide. A team on this shelf expects yours to be connected already, and the installer prompt never starts an OAuth flow.`,
    sourceNote: "xAI publishes no machine-readable connector list, so this page tracks a dated snapshot rather than a live feed. Source:",
    sourceLabel: "awesome-grok-connectors",
    sourceTail: (asOf: string) => `, which describes the catalog as of ${asOf}.`,
    checked: "Checked on",
    andMore: (n: number) => ` and ${n} more`,
    byoTitle: "Bring your own MCP",
    byoBody:
      "Grok Bot also speaks the Model Context Protocol, so a team file may name a connector that is not on this list. Those resolve to a monogram instead of a brand mark. That is expected, not a gap.",
    retiredTitle: "Retired",
    retiredBody:
      "Slack shipped early and was pulled from the catalog before this snapshot. Older team files still resolve it so nothing breaks, but no team here should expect it.",
    marksNote:
      "Brand marks identify each connector and belong to their owners. Grok Bot Teams is operated by Ellelion LLC and is not affiliated with xAI or with any connector vendor. Twelve connectors have no mark yet and show a monogram.",
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
