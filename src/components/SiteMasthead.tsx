import { Suspense } from "react";
import { SiteMenu } from "@/components/SiteMenu";
import { SiteNav } from "@/components/SiteNav";
import { ThemeControls } from "@/components/theme/ThemeControls";
import { WingsMark } from "@/components/WingsMark";
import { en } from "@/lib/messages/en";
import Link from "next/link";

export function SiteMasthead() {
  return (
    <header className="site-masthead">
      <Link href="/" className="site-wordmark accent-hover inline-flex shrink-0 items-center gap-2" aria-label={en.nav.homeAria}>
        <WingsMark size={36} layoutSize={18} priority />
        <span className="site-wordmark-text">{en.wordmark}</span>
      </Link>
      <div className="site-masthead-actions">
        <Suspense fallback={<nav className="site-masthead-nav" aria-label={en.nav.mainAria} />}>
          <SiteNav />
        </Suspense>
        <ThemeControls />
        <Suspense fallback={null}>
          <SiteMenu />
        </Suspense>
      </div>
    </header>
  );
}
