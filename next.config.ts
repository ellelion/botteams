import type { NextConfig } from "next";

// Canonical public domain: grokbotteams.ai
// grokbotteam.ai (no s) is a type-in that should 301 when DNS exists.
// Do not implement live DNS in this repo.

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async rewrites() {
    return [{ source: "/teams/:slug", destination: "/packs/:slug" }];
  },
};

export default nextConfig;
