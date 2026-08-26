import { createHmac } from "node:crypto";
import OAuth from "oauth-1.0a";
import { xReadConfig, xWriteConfig } from "@/lib/x-mentions/config";
import type { XPost, XUser } from "@/lib/x-mentions/types";

const X_API = "https://api.x.com";
const POST_FIELDS = "author_id,created_at,conversation_id,referenced_tweets,note_tweet";
const USER_FIELDS = "username,name";

type RawPost = {
  id: string;
  text: string;
  author_id?: string;
  created_at?: string;
  conversation_id?: string;
  note_tweet?: { text?: string };
  referenced_tweets?: Array<{ type: string; id: string }>;
};

type RawUser = { id: string; username: string; name?: string };

type XResponse<T> = {
  data?: T;
  includes?: { users?: RawUser[]; tweets?: RawPost[] };
  meta?: { newest_id?: string; next_token?: string; result_count?: number };
  errors?: Array<{ detail?: string; title?: string }>;
};

function errorDetail(status: number, payload: unknown): string {
  if (payload && typeof payload === "object") {
    const row = payload as XResponse<unknown>;
    const detail = row.errors?.map((item) => item.detail || item.title).filter(Boolean).join("; ");
    if (detail) return detail;
  }
  return `X API request failed with ${status}`;
}

async function xGet<T>(path: string, params?: URLSearchParams): Promise<XResponse<T>> {
  const { bearerToken } = xReadConfig();
  const url = new URL(path, X_API);
  if (params) url.search = params.toString();
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${bearerToken}` },
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  const payload = (await response.json().catch(() => null)) as XResponse<T> | null;
  if (!response.ok) throw new Error(errorDetail(response.status, payload));
  return payload ?? {};
}

function userMap(includes?: XResponse<unknown>["includes"]): Map<string, XUser> {
  return new Map(
    (includes?.users ?? []).map((user) => [
      user.id,
      { id: user.id, username: user.username, name: user.name },
    ]),
  );
}

function asPost(raw: RawPost, users: Map<string, XUser>): XPost {
  const authorId = raw.author_id ?? "";
  const author = users.get(authorId);
  return {
    id: raw.id,
    text: raw.note_tweet?.text?.trim() || raw.text,
    authorId,
    authorUsername: author?.username || authorId,
    createdAt: raw.created_at,
    conversationId: raw.conversation_id,
    repliedToId: raw.referenced_tweets?.find((item) => item.type === "replied_to")?.id,
  };
}

export async function resolveBotUserId(): Promise<string> {
  const config = xReadConfig();
  if (config.userId) return config.userId;
  const payload = await xGet<RawUser>(`/2/users/by/username/${encodeURIComponent(config.handle)}`, new URLSearchParams({
    "user.fields": USER_FIELDS,
  }));
  if (!payload.data?.id) throw new Error(`X account @${config.handle} was not found`);
  return payload.data.id;
}

export type MentionPage = {
  posts: XPost[];
  newestId?: string;
};

export async function fetchMentions(userId: string, sinceId?: string, bootstrap = false): Promise<MentionPage> {
  const posts: XPost[] = [];
  let nextToken: string | undefined;
  let newestId: string | undefined;
  let page = 0;

  do {
    const params = new URLSearchParams({
      max_results: bootstrap ? "5" : "100",
      "tweet.fields": POST_FIELDS,
      expansions: "author_id",
      "user.fields": USER_FIELDS,
    });
    if (sinceId && sinceId !== "0") params.set("since_id", sinceId);
    if (nextToken) params.set("pagination_token", nextToken);
    const payload = await xGet<RawPost[]>(`/2/users/${encodeURIComponent(userId)}/mentions`, params);
    const users = userMap(payload.includes);
    posts.push(...(payload.data ?? []).map((post) => asPost(post, users)));
    newestId ||= payload.meta?.newest_id;
    nextToken = bootstrap ? undefined : payload.meta?.next_token;
    page += 1;
  } while (nextToken && page < 5);

  return { posts, newestId };
}

export async function fetchPost(postId: string): Promise<XPost> {
  const params = new URLSearchParams({
    "tweet.fields": POST_FIELDS,
    expansions: "author_id",
    "user.fields": USER_FIELDS,
  });
  const payload = await xGet<RawPost>(`/2/tweets/${encodeURIComponent(postId)}`, params);
  if (!payload.data) throw new Error(`X post ${postId} was not found`);
  return asPost(payload.data, userMap(payload.includes));
}

export async function fetchReplyChain(mentionId: string, maximumPosts = 8): Promise<XPost[]> {
  const newest = await fetchPost(mentionId);
  const chain = [newest];
  const seen = new Set([newest.id]);
  let parentId = newest.repliedToId;

  while (parentId && chain.length < maximumPosts && !seen.has(parentId)) {
    const parent = await fetchPost(parentId);
    chain.push(parent);
    seen.add(parent.id);
    parentId = parent.repliedToId;
  }

  return chain.reverse();
}

export async function replyOnX(text: string, inReplyToPostId: string): Promise<string> {
  const config = xWriteConfig();
  const url = `${X_API}/2/tweets`;
  const oauth = new OAuth({
    consumer: { key: config.apiKey, secret: config.apiKeySecret },
    signature_method: "HMAC-SHA1",
    hash_function(baseString, key) {
      return createHmac("sha1", key).update(baseString).digest("base64");
    },
  });
  const authorization = oauth.toHeader(
    oauth.authorize(
      { url, method: "POST" },
      { key: config.accessToken, secret: config.accessTokenSecret },
    ),
  );
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: authorization.Authorization,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      reply: { in_reply_to_tweet_id: inReplyToPostId },
    }),
    signal: AbortSignal.timeout(15_000),
  });
  const payload = (await response.json().catch(() => null)) as XResponse<{ id: string }> | null;
  if (!response.ok || !payload?.data?.id) {
    throw new Error(errorDetail(response.status, payload));
  }
  return payload.data.id;
}
