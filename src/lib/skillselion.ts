export type SkillselionHit = {
  id: string;
  name: string;
  summary: string;
  url: string;
  install: string;
  installs: number;
  stars: number;
  author: string;
  avatarUrl: string;
};

export type SkillUse = "install" | "fetch";

/** "team" = every Bot on the recipe. Any other string is an exact Bot name. */
export type SkillScope = "team" | (string & {});

export type SkillPick = SkillselionHit & { use: SkillUse; scope: string };

export const SKILLSELION_SITE = "https://skillselion.com";
export const SKILLSELION_LISTINGS = "https://skillselion.com/api/upstream/listings";
export const SKILLSELION_MCP = "https://skillselion.com/skillselion-mcp";

const GH_OWNER = /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/;
const GH_NAME = /^[A-Za-z0-9._-]+$/;

function isGitHubRepoSlug(repo: string): boolean {
  const parts = repo.split("/");
  if (parts.length !== 2) return false;
  const [owner, name] = parts;
  return GH_OWNER.test(owner) && GH_NAME.test(name) && !name.startsWith(".");
}

export function isGitHubLogin(value: string): boolean {
  return GH_OWNER.test(value) && !value.includes(".");
}

function skillSlugFromId(id: string): string {
  const i = id.indexOf("#");
  return i >= 0 ? id.slice(i + 1) : id;
}

export function ownerFromListing(listing: { id?: string; repo?: string; author?: string }): string {
  const repo = (listing.repo ?? "").trim();
  if (repo.includes("/")) {
    const owner = repo.split("/")[0];
    if (GH_OWNER.test(owner)) return owner;
  }
  const author = (listing.author ?? "").trim();
  if (author && isGitHubLogin(author)) return author;
  const m = (listing.id ?? "").match(/^skill:([^/#]+)/);
  return m && GH_OWNER.test(m[1]) ? m[1] : author;
}

export function githubAvatarUrl(owner: string): string {
  return owner ? `https://github.com/${owner}.png` : "";
}

export function authorHref(hit: { author: string; url: string }): string {
  if (hit.author && isGitHubLogin(hit.author)) return `https://github.com/${hit.author}`;
  return hit.url || SKILLSELION_SITE;
}

/** Public Skillselion path from a catalog listing. Mirrors prism listing-url. */
export function skillselionUrl(listing: { id?: string; type?: string; repo?: string }): string {
  const id = listing.id ?? "";
  const repo = (listing.repo ?? "").trim();
  const m = id.match(/^skill:([^#]+)#(.+)$/);
  if (m) {
    const repoSegs = m[1].split("/");
    const skillSegs = m[2].split("/");
    const segs =
      skillSegs.length === 1 && skillSegs[0] === repoSegs[repoSegs.length - 1]
        ? repoSegs
        : [...repoSegs, ...skillSegs];
    return `${SKILLSELION_SITE}/skills/${segs.map(encodeURIComponent).join("/")}`;
  }
  if (repo.includes("/")) {
    return `${SKILLSELION_SITE}/skills/${repo.split("/").map(encodeURIComponent).join("/")}`;
  }
  if (id && /^[\w.-]+$/.test(id)) return `${SKILLSELION_SITE}/skills/${encodeURIComponent(id)}`;
  return SKILLSELION_SITE;
}

export function skillInstallCommand(listing: { id?: string; repo?: string }): string {
  const repo = (listing.repo ?? "").trim();
  if (!isGitHubRepoSlug(repo)) return "";
  const slug = skillSlugFromId(listing.id ?? "");
  if (slug && slug !== repo.split("/")[1]) {
    return `npx skills add https://github.com/${repo} --skill ${slug}`;
  }
  return `npx skills add https://github.com/${repo}`;
}

function oneLine(text: string, max = 240): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const at = cut.lastIndexOf(" ");
  return `${(at > 80 ? cut.slice(0, at) : cut).trimEnd()}…`;
}

type RawListing = {
  id?: unknown;
  name?: unknown;
  description?: unknown;
  summary?: unknown;
  repo?: unknown;
  type?: unknown;
  stars?: unknown;
  installs?: unknown;
  author?: unknown;
};

export function mapListing(raw: RawListing): SkillselionHit | null {
  if (typeof raw.id !== "string" || !raw.id) return null;
  const name = typeof raw.name === "string" && raw.name.trim() ? raw.name.trim() : raw.id;
  const summary = oneLine(
    (typeof raw.summary === "string" && raw.summary) ||
      (typeof raw.description === "string" && raw.description) ||
      "",
  );
  const repo = typeof raw.repo === "string" ? raw.repo : "";
  const authorRaw = typeof raw.author === "string" ? raw.author.trim() : "";
  const author = ownerFromListing({ id: raw.id, repo, author: authorRaw });
  return {
    id: raw.id,
    name,
    summary,
    url: skillselionUrl({ id: raw.id, type: typeof raw.type === "string" ? raw.type : "skill", repo }),
    install: skillInstallCommand({ id: raw.id, repo }),
    installs: typeof raw.installs === "number" ? raw.installs : 0,
    stars: typeof raw.stars === "number" ? raw.stars : 0,
    author,
    avatarUrl: githubAvatarUrl(author),
  };
}

export function hitFromId(id: string, name: string): SkillselionHit {
  const m = id.match(/^skill:([^#]+)#(.+)$/);
  const repo = m ? m[1] : "";
  const author = ownerFromListing({ id, repo });
  return {
    id,
    name,
    summary: "",
    url: skillselionUrl({ id, type: "skill", repo }),
    install: skillInstallCommand({ id, repo }),
    installs: 0,
    stars: 0,
    author,
    avatarUrl: githubAvatarUrl(author),
  };
}

export function isSkillUse(value: unknown): value is SkillUse {
  return value === "install" || value === "fetch";
}

export function isSkillScope(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isSkillPick(value: unknown): value is SkillPick {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.name === "string" &&
    typeof v.summary === "string" &&
    typeof v.url === "string" &&
    typeof v.install === "string" &&
    typeof v.installs === "number" &&
    typeof v.stars === "number" &&
    typeof v.author === "string" &&
    typeof v.avatarUrl === "string" &&
    isSkillUse(v.use) &&
    isSkillScope(v.scope)
  );
}

export function normalizeSkillPick(value: unknown): SkillPick | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  if (typeof v.id !== "string" || typeof v.name !== "string" || typeof v.summary !== "string") return null;
  if (typeof v.url !== "string" || typeof v.install !== "string") return null;
  if (typeof v.installs !== "number" || typeof v.stars !== "number") return null;
  if (!isSkillUse(v.use)) return null;
  const author =
    typeof v.author === "string" && v.author
      ? v.author
      : ownerFromListing({ id: v.id, repo: typeof v.install === "string" ? "" : "" });
  const filledAuthor = author || ownerFromListing({ id: v.id });
  return {
    id: v.id,
    name: v.name,
    summary: v.summary,
    url: v.url,
    install: v.install,
    installs: v.installs,
    stars: v.stars,
    author: filledAuthor,
    avatarUrl: typeof v.avatarUrl === "string" && v.avatarUrl ? v.avatarUrl : githubAvatarUrl(filledAuthor),
    use: v.use,
    scope: isSkillScope(v.scope) ? v.scope : "team",
  };
}

export function skillCreator(id: string, repo = "", author = ""): { author: string; avatarUrl: string } {
  const repoOwner = repo.split("/")[0] || "";
  const idOwner = (id.match(/^skill:([^/#]+)/) || [])[1] || "";
  const login = author.replace(/^@/, "") || repoOwner || idOwner;
  return {
    author: author || login,
    avatarUrl: login ? "https://github.com/" + login + ".png" : "",
  };
}

export function enrichHit<T extends SkillselionHit>(hit: T): T {
  const c = skillCreator(hit.id, "", hit.author || "");
  return { ...hit, author: hit.author || c.author, avatarUrl: hit.avatarUrl || c.avatarUrl };
}

export function fmtInstalls(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "m";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}
