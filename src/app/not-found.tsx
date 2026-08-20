import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteMasthead } from "@/components/SiteMasthead";
import { en } from "@/lib/messages/en";

export default function NotFound() {
  return (
    <div className="site-shell">
      <SiteMasthead />
      <main className="page-main flex flex-1 flex-col items-center justify-center py-24 text-center">
        <p className="eyebrow">{en.notFound.kicker}</p>
        <p className="mt-4 text-[clamp(2.8rem,7vw,4.2rem)] font-medium leading-none tracking-[-0.05em]">404</p>
        <p className="mt-4 max-w-xs text-[1rem] leading-relaxed" style={{ color: "var(--muted)" }}>{en.notFound.body}</p>
        <Link href="/" className="btn-primary mt-8">{en.notFound.back}</Link>
      </main>
      <SiteFooter />
    </div>
  );
}
