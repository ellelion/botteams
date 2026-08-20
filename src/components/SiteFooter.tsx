import { en } from "@/lib/messages/en";
import { site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 flex shrink-0 flex-col items-center gap-2 px-6 pb-10 pt-8 text-center text-[0.8rem] text-[color:var(--muted)]">
      <p>
        © {year} {site.company} · {en.footer.mit} · <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>
      <p>
        {en.footer.sisters}:{" "}
        {site.sisters.map((sister, i) => (
          <span key={sister.href}>
            {i > 0 ? " · " : null}
            <a href={sister.href} rel="nofollow noopener noreferrer" target="_blank">{sister.name}</a>
          </span>
        ))}
      </p>
      <p>Operated by {site.company}. Not affiliated with xAI.</p>
    </footer>
  );
}
