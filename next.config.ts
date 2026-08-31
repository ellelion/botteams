import type { NextConfig } from "next";
import { retiredTeamRedirects } from "./src/data/retired-teams";

// Canonical public domain: botteams.io
// Apex and www are attached to the existing Vercel project. DNS stays
// outside this repo (Vercel nameservers). Do not buy a domain or create
// a Vercel team from this codebase.
// The application still owns canonical host redirects so www and the
// retired botteams.ai hostname cannot become a second public site.

// /teams/<slug> is the only team route. Retired slugs redirect from the
// map in src/data/retired-teams.ts so old URLs do not 404.

const scriptSources = [
  "'self'",
  "'unsafe-inline'", // Next.js hydration, JSON-LD, and OpenPanel bootstrap.
  "https://openpanel.dev",
  ...(process.env.NODE_ENV === "development" ? ["'unsafe-eval'"] : []),
];

const connectSources = [
  "'self'",
  "https://api.openpanel.dev",
  ...(process.env.NODE_ENV === "development" ? ["ws:", "wss:"] : []),
];

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  `script-src ${scriptSources.join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src ${connectSources.join(" ")}`,
  "frame-src https://checkout.stripe.com",
  "worker-src 'self' blob:",
  ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/*": ["./teams/**/*", "./bots/**/*"],
  },
  poweredByHeader: false,
  /* The default Next.js N sits bottom-left and covers the mobile
     sponsored rail label. Hide it; errors still overlay. */
  devIndicators: false,
  async redirects() {
    /* Host-based redirects (www.botteams.io and the retired botteams.ai) now
       live in Cloudflare. Matching on `host` here makes every response depend
       on a request header, so Next rendered the whole site on demand and
       answered `no-store` — the CDN could not cache a single page. */
    return retiredTeamRedirects();
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async rewrites() {
    /* JSON-LD and old bookmarks ask for /icon.png. Serve the generated
       PNG mark, not the SVG, so scrapers get the type they asked for. */
    return [
      { source: "/icon.png", destination: "/icon" },
      { source: "/apple-icon.png", destination: "/apple-icon" },
    ];
  },
};

export default nextConfig;
