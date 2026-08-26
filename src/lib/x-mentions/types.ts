export const RECIPE_SECTIONS = [
  "Agency",
  "Bookkeeping",
  "Community",
  "Content",
  "Creator",
  "Customer success",
  "Data",
  "Design",
  "Engineering",
  "Events",
  "Founder OS",
  "Helpdesk",
  "Hiring",
  "Infrastructure",
  "Investor updates",
  "Knowledge",
  "Legal",
  "Onboarding",
  "Partnerships",
  "Product",
  "Recruiting",
  "Research",
  "Revenue",
  "Sales",
  "Support",
  "Workplace",
  "General",
  "Customer Success & Support",
  "Recruiting & People",
  "Operations & Finance",
  "Life & Leverage",
  "Marketing",
] as const;

export type RecipeSection = (typeof RECIPE_SECTIONS)[number];
export type ScoutedKind = "bot" | "team";

export type XUser = {
  id: string;
  username: string;
  name?: string;
};

export type XPost = {
  id: string;
  text: string;
  authorId: string;
  authorUsername: string;
  createdAt?: string;
  conversationId?: string;
  repliedToId?: string;
};

export type ScoutedBot = {
  name: string;
  persona: string;
  connectors: string[];
};

export type ScoutedRoom = {
  name: string;
  members: string[];
};

export type ScoutedRoutine = {
  name: string;
  owner: string;
  schedule: string;
  prompt: string;
};

export type ExtractedRecipe = {
  kind: ScoutedKind;
  name: string;
  tagline: string;
  section: RecipeSection;
  connectors: string[];
  botRoster: ScoutedBot[];
  rooms: ScoutedRoom[];
  routines: ScoutedRoutine[];
  body: string;
};

export type ScoutedRecipe = ExtractedRecipe & {
  slug: string;
  status: "example";
  addedAt: string;
  contributor: string;
  contributorUrl: string;
  scoutedBy?: string;
  addedVia: string;
};

export type StoredRecipe = {
  slug: string;
  name: string;
  kind: ScoutedKind;
  tagline?: string;
  url: string;
  outcome: "added" | "existing";
};

export type MentionRow = {
  mentionId: string;
  authorId: string;
  authorUsername: string;
  text: string;
  status: string;
  attempts: number;
  prNumber: number | null;
  prUrl: string | null;
  recipes: StoredRecipe[];
};
