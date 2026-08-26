const DEFAULT_HANDLE = "Botteams_ai";
const DEFAULT_REPOSITORY = "ellelion/botteams";

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

function handle(): string {
  return (process.env.X_HANDLE?.trim() || DEFAULT_HANDLE).replace(/^@/, "");
}

export function xReadConfig() {
  return {
    bearerToken: required("X_API_BEARER_TOKEN"),
    handle: handle(),
    userId: process.env.X_USER_ID?.trim() || undefined,
  };
}

export function xWriteConfig() {
  return {
    apiKey: required("X_API_KEY"),
    apiKeySecret: required("X_API_KEY_SECRET"),
    accessToken: required("X_ACCESS_TOKEN"),
    accessTokenSecret: required("X_ACCESS_TOKEN_SECRET"),
  };
}

export function githubConfig() {
  const repository = process.env.BOTTEAMS_GITHUB_REPOSITORY?.trim() || DEFAULT_REPOSITORY;
  const [owner, repo, ...rest] = repository.split("/");
  if (!owner || !repo || rest.length > 0) {
    throw new Error("BOTTEAMS_GITHUB_REPOSITORY must be owner/repository");
  }
  return {
    token: required("BOTTEAMS_GITHUB_TOKEN"),
    owner,
    repo,
    baseBranch: process.env.BOTTEAMS_GITHUB_BASE_BRANCH?.trim() || "main",
  };
}

export function mentionBackfillEnabled(): boolean {
  return process.env.X_MENTION_BACKFILL === "true";
}

export function dailyUrlReplyCap(): number {
  const raw = process.env.X_DAILY_URL_REPLY_CAP?.trim() || "20";
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 0 || value > 20) {
    throw new Error("X_DAILY_URL_REPLY_CAP must be an integer from 0 to 20");
  }
  return value;
}

export function dailyReplyCap(): number {
  const raw = process.env.X_DAILY_REPLY_CAP?.trim() || "100";
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 0 || value > 100) {
    throw new Error("X_DAILY_REPLY_CAP must be an integer from 0 to 100");
  }
  return value;
}

export function mentionHandle(): string {
  return `@${handle()}`;
}
