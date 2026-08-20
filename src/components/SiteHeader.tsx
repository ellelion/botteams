import Link from "next/link";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-[15px] font-medium tracking-[-0.01em] text-ink">
          {site.name}
        </Link>
        <nav className="flex items-center gap-6 text-[13px] text-mute">
          <Link href="/#packs" className="hover:text-ink">
            Packs
          </Link>
          <Link href="/docs" className="hover:text-ink">
            Docs
          </Link>
        </nav>
      </div>
    </header>
  );
}
