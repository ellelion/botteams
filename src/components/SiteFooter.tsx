import { ledger } from "@/lib/ledger-theme";
import { en } from "@/lib/messages/en";
import { site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 flex shrink-0 flex-col items-center gap-2 pb-6 pt-4 text-center text-[0.58rem] tracking-[0.16em]" style={{ color: ledger.label }}>
      <p>
        © {year} {site.company} · {en.footer.mit} · <a className="accent-hover" href={`mailto:${site.email}`}>{site.email}</a>
      </p>
      <p>
        {en.footer.sisters}:{" "}
        {site.sisters.map((sister, i) => (
          <span key={sister.href}>
            {i > 0 ? " · " : null}
            <a href={sister.href} className="accent-hover" rel="nofollow noopener noreferrer" target="_blank">{sister.name}</a>
          </span>
        ))}
      </p>
    </footer>
  );
}
