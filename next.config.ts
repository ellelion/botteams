import type { NextConfig } from "next";

// Canonical public domain: botteams.ai
// grokbotteam.ai (no s) is a type-in that should 301 when DNS exists.
// Do not implement live DNS in this repo.

// /teams/<slug> is the only team route. There is no rewrite and no
// redirect from the old path: nothing has shipped to a customer, so an
// alias would only be a second name to keep alive.

const nextConfig: NextConfig = {
  poweredByHeader: false,
  /* The default Next.js N sits bottom-left and covers the mobile
     sponsored rail label. Hide it; errors still overlay. */
  devIndicators: false,
};

export default nextConfig;
