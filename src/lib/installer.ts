import type { Pack } from "@/lib/packs";
import { site } from "@/lib/site";

export function installerPrompt(pack: Pack): string {
  const agents = pack.agents
    .map((agent) => {
      const reuse = agent.reuse
        ? "If an agent with this exact name already exists, reuse it. Do not create a duplicate."
        : "Create this agent. Use the name exactly.";
      return [`### ${agent.name}`, reuse, "", "Persona:", agent.persona].join("\n");
    })
    .join("\n\n");

  const rooms = pack.rooms
    .map((room) => {
      return [`### ${room.name}`, `Members (${room.members.length}, cap 6): ${room.members.join(", ")}`].join("\n");
    })
    .join("\n\n");

  const routines = pack.routines
    .map((routine) => {
      return [`### ${routine.name}`, `Owner: ${routine.owner}`, `Schedule: ${routine.schedule}`, "", "Prompt to save (human must confirm):", routine.prompt].join("\n");
    })
    .join("\n\n");

  const connectors = pack.connectors.map((name) => `- ${name}`).join("\n");
  const skills = pack.skills.length > 0
    ? pack.skills.map((name) => `- ${name}`).join("\n")
    : "(none listed. Skills cannot be attached at create time anyway.)";

  const exampleBanner = pack.status === "example"
    ? ["NOTE: This is an EXAMPLE pack from the public shelf. Use it to learn the format.", "Do not treat it as a production company recipe.", ""]
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
    `Pack: ${pack.name} (${pack.slug})`,
    `Seats: ${pack.seats}`,
    `Sidebar section name: ${pack.section}`,
    "",
    "## 1. Create these agents",
    "",
    "Use the names exactly, including any prefix.",
    "",
    agents,
    "",
    "## 2. Create these rooms",
    "",
    "Grok Bot rooms cap at 6 members. Do not add more.",
    "",
    rooms,
    "",
    "## 3. Sidebar section (human does this)",
    "",
    "The installer cannot create sidebar sections.",
    "Human: in the Grok Bot sidebar, use Move to → New section.",
    `Name that section exactly: ${pack.section}`,
    "Move the room and agents into that section.",
    "",
    "## 4. Routines (confirm card required)",
    "",
    "Ping each owner agent with the routine they own so they can save it.",
    "A confirm card will appear. The human must confirm each one.",
    "Do not assume a routine is saved until the human confirms.",
    "",
    routines,
    "",
    "## 5. Connectors already on this account",
    "",
    "Connectors are account-wide. They must already be connected.",
    "If any are missing, tell the human to connect them in Grok Bot settings first.",
    "Do not walk an OAuth flow from this prompt.",
    "",
    connectors,
    "",
    "## 6. Skills",
    "",
    "Skills cannot be attached at agent create time.",
    "If the human wants skills later, they add them after the agents exist.",
    "",
    skills,
    "",
    "## Done when",
    "",
    "- Named agents exist",
    "- Named rooms exist (6-seat cap respected)",
    `- Human has created section \"${pack.section}\"`,
    "- Each routine has a confirmed save (or the human declined)",
    "- Connectors listed above are already connected",
    "",
    "Uninstall: delete the agents and rooms in the Grok Bot sidebar.",
    `There is no remote uninstall from ${site.name}.`,
    "",
    "Drafts only where mail is involved. Never send.",
  ].join("\n");
}
