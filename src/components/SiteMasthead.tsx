import Link from "next/link";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { ThemeControls } from "@/components/theme/ThemeControls";
import { WingsMark } from "@/components/WingsMark";
import { en } from "@/lib/messages/en";
import { site } from "@/lib/site";

export function SiteMasthead() {
  return (
    <header className="site-masthead">
      <Link href="/" className="accent-hover inline-flex items-center gap-2" aria-label={en.nav.homeAria}>
        <WingsMark size={44} layoutSize={18} priority />
        <span className="hidden sm:inline">{en.wordmark}</span>
      </Link>
      <div className="site-masthead-actions">
        <nav className="site-masthead-nav" aria-label={en.nav.mainAria}>
          <Link href="/#teams" className="accent-hover">{en.nav.packs}</Link>
          <Link href="/docs" className="accent-hover">{en.nav.docs}</Link>
          <a href={site.github} target="_blank" rel="noopener noreferrer" className="accent-hover inline-flex items-center" aria-label={en.nav.github} title={en.nav.github}>
            <GitHubIcon className="h-[13px] w-[13px]" />
          </a>
        </nav>
        <ThemeControls />
      </div>
    </header>
  );
}
