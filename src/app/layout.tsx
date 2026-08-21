import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { createThemeBootstrapScript } from "@/lib/theme";

const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"], weight: ["300", "400", "500", "600"] });

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
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${outfit.variable} h-full antialiased`}>
      <head>
        <meta name="theme-color" content="#0a0a0a" />
        <script dangerouslySetInnerHTML={{ __html: createThemeBootstrapScript() }} />
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
