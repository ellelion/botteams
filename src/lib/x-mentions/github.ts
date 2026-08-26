import { githubConfig } from "@/lib/x-mentions/config";

const GITHUB_API = "https://api.github.com";

type GitHubPull = {
  number: number;
  html_url: string;
  state: "open" | "closed";
  merged_at: string | null;
};

type GitHubRef = { object: { sha: string } };
type GitHubCommit = { tree: { sha: string } };

async function githubRequest<T>(
  path: string,
  init?: RequestInit,
  allow404 = false,
): Promise<T | null> {
  const { token } = githubConfig();
  const response = await fetch(`${GITHUB_API}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  if (allow404 && response.status === 404) return null;
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload && typeof payload === "object" && "message" in payload
      ? String(payload.message)
      : `GitHub API request failed with ${response.status}`;
    throw new Error(message);
  }
  return payload as T;
}

function repoPath(path: string): string {
  const { owner, repo } = githubConfig();
  return `/repos/${owner}/${repo}${path}`;
}

export async function githubFileExists(path: string): Promise<boolean> {
  const result = await githubRequest<unknown>(repoPath(`/contents/${path}`), undefined, true);
  return result !== null;
}

async function findPullForBranch(branch: string): Promise<GitHubPull | null> {
  const { owner } = githubConfig();
  const query = new URLSearchParams({ state: "all", head: `${owner}:${branch}`, per_page: "5" });
  const pulls = await githubRequest<GitHubPull[]>(repoPath(`/pulls?${query}`));
  return pulls?.[0] ?? null;
}

async function ensureViaXLabel(): Promise<void> {
  const labelPath = repoPath("/labels/via-x");
  const existing = await githubRequest<unknown>(labelPath, undefined, true);
  if (existing) return;
  await githubRequest(repoPath("/labels"), {
    method: "POST",
    body: JSON.stringify({
      name: "via-x",
      color: "0f8f83",
      description: "Recipe proposed by the @Botteams_ai mention worker",
    }),
  });
}

async function addViaXLabel(prNumber: number): Promise<void> {
  await ensureViaXLabel();
  await githubRequest(repoPath(`/issues/${prNumber}/labels`), {
    method: "POST",
    body: JSON.stringify({ labels: ["via-x"] }),
  });
}

export type PullRequestFile = { path: string; content: string };

export async function openMentionPullRequest({
  mentionId,
  sourceUrl,
  scout,
  names,
  files,
}: {
  mentionId: string;
  sourceUrl: string;
  scout: string;
  names: string[];
  files: PullRequestFile[];
}): Promise<GitHubPull> {
  const config = githubConfig();
  const branch = `x-mention/${mentionId}`;
  const existing = await findPullForBranch(branch);
  if (existing) {
    await addViaXLabel(existing.number);
    return existing;
  }

  const existingBranch = await githubRequest<GitHubRef>(
    repoPath(`/git/ref/heads/${encodeURIComponent(branch)}`),
    undefined,
    true,
  );
  if (existingBranch) {
    const recovered = await githubRequest<GitHubPull>(repoPath("/pulls"), {
      method: "POST",
      body: JSON.stringify({
        title: `Add from X: ${names.join(", ").slice(0, 180)}`,
        head: branch,
        base: config.baseBranch,
        body: `Recovered automated draft from ${sourceUrl}. Scouted by @${scout.replace(/^@/, "")}.`,
        maintainer_can_modify: true,
      }),
    });
    if (!recovered) throw new Error("Could not recover GitHub pull request");
    await addViaXLabel(recovered.number);
    return recovered;
  }

  const baseRef = await githubRequest<GitHubRef>(repoPath(`/git/ref/heads/${encodeURIComponent(config.baseBranch)}`));
  if (!baseRef) throw new Error("GitHub base branch was not found");
  const baseCommit = await githubRequest<GitHubCommit>(repoPath(`/git/commits/${baseRef.object.sha}`));
  if (!baseCommit) throw new Error("GitHub base commit was not found");

  const treeEntries = [];
  for (const file of files) {
    const blob = await githubRequest<{ sha: string }>(repoPath("/git/blobs"), {
      method: "POST",
      body: JSON.stringify({ content: file.content, encoding: "utf-8" }),
    });
    if (!blob) throw new Error(`Could not create GitHub blob for ${file.path}`);
    treeEntries.push({ path: file.path, mode: "100644", type: "blob", sha: blob.sha });
  }

  const tree = await githubRequest<{ sha: string }>(repoPath("/git/trees"), {
    method: "POST",
    body: JSON.stringify({ base_tree: baseCommit.tree.sha, tree: treeEntries }),
  });
  if (!tree) throw new Error("Could not create GitHub tree");
  const commit = await githubRequest<{ sha: string }>(repoPath("/git/commits"), {
    method: "POST",
    body: JSON.stringify({
      message: `Add ${names.join(", ")} from X`,
      tree: tree.sha,
      parents: [baseRef.object.sha],
      author: { name: "botteams.ai", email: "info@ellelion.com" },
      committer: { name: "botteams.ai", email: "info@ellelion.com" },
    }),
  });
  if (!commit) throw new Error("Could not create GitHub commit");

  try {
    await githubRequest(repoPath("/git/refs"), {
      method: "POST",
      body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: commit.sha }),
    });
  } catch (error) {
    const raced = await findPullForBranch(branch);
    if (raced) {
      await addViaXLabel(raced.number);
      return raced;
    }
    throw error;
  }

  const titleNames = names.join(", ");
  const pull = await githubRequest<GitHubPull>(repoPath("/pulls"), {
    method: "POST",
    body: JSON.stringify({
      title: `Add from X: ${titleNames.slice(0, 180)}`,
      head: branch,
      base: config.baseBranch,
      body: [
        "Automated draft from an @Botteams_ai mention.",
        "",
        `Source: ${sourceUrl}`,
        `Scouted by: @${scout.replace(/^@/, "")}`,
        "",
        "Every added recipe is `status: example`. A maintainer must review and run it before changing that claim.",
      ].join("\n"),
      maintainer_can_modify: true,
    }),
  });
  if (!pull) throw new Error("Could not open GitHub pull request");
  await addViaXLabel(pull.number);
  return pull;
}

export async function getPullRequest(prNumber: number): Promise<GitHubPull> {
  const pull = await githubRequest<GitHubPull>(repoPath(`/pulls/${prNumber}`));
  if (!pull) throw new Error(`Pull request ${prNumber} was not found`);
  return pull;
}
