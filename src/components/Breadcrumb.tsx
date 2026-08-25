import Link from "next/link";
import { en } from "@/lib/messages/en";

export function Breadcrumb({
  parentHref,
  parentLabel,
  current,
}: {
  parentHref: string;
  parentLabel: string;
  current: string;
}) {
  return (
    <nav aria-label={en.nav.breadcrumb}>
      <ol className="crumb-list">
        <li>
          <Link href={parentHref} className="accent-hover">
            {parentLabel}
          </Link>
        </li>
        <li aria-current="page">{current}</li>
      </ol>
    </nav>
  );
}
