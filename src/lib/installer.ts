import type { Pack } from "@/lib/types";
import { site } from "@/lib/site";

export function installerPrompt(pack: Pack): string {
  const agents = pack.agents
    .map((agent) => {
      const reuse = agent.reuse
        ? "If a Bot with this exact name already exists, reuse it. Do not create a duplicate."
        : "Create this Bot. Use the name exactly.";
      const connectors = agent.connectors.length
        ? `Uses connectors (already on the account): ${agent.connectors.join(", ")}`
        : "No team connectors assigned to this Bot.";
      return [`### ${agent.name}`, reuse, connectors, "", "Job:", agent.persona].join("\n");
    })
    .join("\n\n");

  const rooms = pack.rooms
    .map((room) => {
      return [`### ${room.name}`, `Members (${room.members.length}, two to six Bots): ${room.members.join(", ")}`].join("\n");
    })
    .join("\n\n");

  const routines = pack.routines
    .map((routine) => {
      return [`### ${routine.name}`, `Owner Bot: ${routine.owner}`, `Schedule: ${routine.schedule}`, "", "Prompt to save (human must confirm):", routine.prompt].join("\n");
    })
    .join("\n\n");

  const connectors = pack.connectors.map((name) => `- ${name}`).join("\n");
  const skills = pack.skills.length > 0
    ? pack.skills.map((name) => `- ${name}`).join("\n")
    : "(none listed. Skills cannot be attached at create time anyway.)";

  const exampleBanner = pack.status === "example"
    ? ["NOTE: This is an EXAMPLE team from the public shelf. Use it to learn the format.", "Do not treat it as a production company recipe.", ""]
    : [];

  return [
    "# Grok Bot Teams installer",
    "",
    ...exampleBanner,
    "Paste this into Grok Bot. It is a prompt, not an OAuth app and not a plugin.",
    "Do not claim one-click connect. Do not start OAuth.",
    "",
    `Catalog: ${site.url}`,
    `Source: ${site.github}`,
    `Team: ${pack.name} (${pack.slug})`,
    `Bots: ${pack.bots}`,
    `Sidebar section name: ${pack.section}`,
    "",
    "## 1. Create these Bots",
    "",
    "In Grok Bot: New chat, then Create new agent. Then Edit Profile (name, title, description, avatar).",
    "Use the names exactly, including any prefix.",
    "A Bot is a single persistent, named agent. Give each Bot a job.",
    "",
    agents,
    "",
    "## 2. Create this group chat",
    "",
    "In New chat, select two to six of the Bots above. Do not add more than six.",
    "",
    rooms,
    "",
    "## 3. Sidebar section (human does this)",
    "",
    "The installer cannot create sidebar sections.",
    "Human: in the Grok Bot sidebar, use Move to, then New section.",
    `Name that section exactly: ${pack.section}`,
    "Move the group chat and Bots into that section.",
    "",
    "## 4. Routines (confirm card required)",
    "",
    "Ping each owner Bot with the routine they own so they can save it.",
    "A routine is owned by one Bot. A confirm card will appear. The human must confirm each one.",
    "Do not assume a routine is saved until the human confirms.",
    "",
    routines,
    "",
    "## 5. Connectors already on this account",
    "",
    "Connectors are account-wide. They must already be connected.",
    "If any are missing, tell the human to connect them in Grok Bot settings first.",
    "Do not walk an OAuth flow from this prompt.",
    "Per-Bot connector lists below are which Bot uses which ones, not a second OAuth.",
    "",
    connectors,
    "",
    "## 6. Skills",
    "",
    "Skills cannot be attached at Bot create time.",
    "If the human wants skills later, they add them after the Bots exist.",
    "",
    skills,
    "",
    "## Done when",
    "",
    "- Named Bots exist",
    "- Named group chat exists (two to six Bots)",
    `- Human has created section "${pack.section}"`,
    "- Each routine has a confirmed save (or the human declined)",
    "- Connectors listed above are already connected",
    "",
    "Uninstall: delete the Bots and group chats in the Grok Bot sidebar.",
    `There is no remote uninstall from ${site.name}.`,
    "",
    "Drafts only where mail is involved. Never send.",
  ].join("\n");
}
