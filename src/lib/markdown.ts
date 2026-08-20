function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function inline(value: string): string {
  return escapeHtml(value)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" rel="nofollow noopener noreferrer">$1</a>')
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

export function renderMarkdown(src: string): string {
  const blocks = src.trim().split(/\n{2,}/);
  return blocks.map((block) => {
    const heading = block.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2].trim();
      return `<h${level} id="${slugify(text)}">${inline(text)}</h${level}>`;
    }
    if (block.startsWith("- ")) {
      const items = block.split("\n").filter((line) => line.startsWith("- ")).map((line) => `<li>${inline(line.slice(2))}</li>`).join("");
      return `<ul>${items}</ul>`;
    }
    return `<p>${inline(block.replace(/\n/g, " "))}</p>`;
  }).join("\n");
}
