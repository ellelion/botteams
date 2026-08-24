export type GuideCluster = "compare" | "howto" | "trust" | "job";

export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "quote"; text: string; source: string }
  | { type: "ol"; items: string[] }
  | { type: "ul"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };

export type GuideSection = {
  id: string;
  title: string;
  blocks: GuideBlock[];
};

export type GuideSource = { href: string; label: string };

export type Guide = {
  slug: string;
  cluster: GuideCluster;
  title: string;
  headline: string;
  description: string;
  hero: string;
  sections: GuideSection[];
  faq: { q: string; a: string }[];
  sources: GuideSource[];
  related: { href: string; label: string }[];
};
