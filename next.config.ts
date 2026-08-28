import type { NextConfig } from "next";

// Canonical public domain: botteams.io
// DNS stays outside this repo. The application still owns canonical host
// redirects so a second hostname cannot become a duplicate public site.
// botteams.ai is the retired hostname and redirects here.

// /teams/<slug> is the only team route. There is no rewrite and no
// redirect from the old path: nothing has shipped to a customer, so an
// alias would only be a second name to keep alive.

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
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.botteams.io" }],
        destination: "https://botteams.io/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "botteams.ai" }],
        destination: "https://botteams.io/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.botteams.ai" }],
        destination: "https://botteams.io/:path*",
        permanent: true,
      },
    ];
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
