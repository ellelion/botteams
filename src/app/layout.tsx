import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { DEFAULT_THEME, createThemeBootstrapScript, themeColorFor } from "@/lib/theme";

/*
 * Geist Sans and Geist Mono, from Vercel, under the SIL Open Font
 * License. x.ai sets its display in Universal Sans, which is a paid
 * Family Type licence we do not hold, so we do not download it, hotlink
 * it, or pass anything off as it. Geist is the closest legal neighbour:
 * same grotesque skeleton, same tight display tracking.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  authors: [{ name: site.company, url: site.url }],
  creator: site.company,
  publisher: site.company,
  openGraph: { title: site.title, description: site.description, url: site.url, siteName: site.name, locale: "en_US", type: "website" },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
};

function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme={DEFAULT_THEME} suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}>
      <head>
        <meta name="theme-color" content={themeColorFor(DEFAULT_THEME)} />
        <script dangerouslySetInnerHTML={{ __html: createThemeBootstrapScript() }} />
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
