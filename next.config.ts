import type { NextConfig } from "next";

// Canonical public domain: botteams.ai
// Do not implement live DNS in this repo.

// /teams/<slug> is the only team route. There is no rewrite and no
// redirect from the old path: nothing has shipped to a customer, so an
// alias would only be a second name to keep alive.

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/*": ["./teams/**/*", "./bots/**/*"],
  },
  poweredByHeader: false,
  /* The default Next.js N sits bottom-left and covers the mobile
     sponsored rail label. Hide it; errors still overlay. */
  devIndicators: false,
  async rewrites() {
    /* JSON-LD and old bookmarks ask for /icon.png. The mark is the
       ellelion SVG; keep the .png names so scrapers do not 404. */
    return [
      { source: "/icon.png", destination: "/icon.svg" },
      { source: "/apple-icon.png", destination: "/apple-icon" },
    ];
  },
};

export default nextConfig;
