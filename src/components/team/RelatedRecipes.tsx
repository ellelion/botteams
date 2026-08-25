import Link from "next/link";
import { ConnectorRow } from "@/components/ConnectorRow";
import { FeaturedChip } from "@/components/FeaturedChip";
import { FromXaiChip } from "@/components/FromXaiChip";
import { grokRecipeTitle } from "@/lib/grok-names";
import type { Team } from "@/lib/types";

export function RelatedRecipes({
  title,
  items,
  hrefFor,
}: {
  title: string;
  items: Team[];
  hrefFor: (team: Team) => string;
}) {
  if (items.length === 0) return null;
  return (
    <section className="rp-related">
      <h2 className="rc-h2">{title}</h2>
      <ul>
        {items.map((other) => (
          <li key={other.slug} className="rp-related-row">
            <Link href={hrefFor(other)} className="rp-related-name accent-hover">
              {grokRecipeTitle(other.kind, other.name)}
            </Link>
            {other.featured || other.fromXai ? (
              <span className="rp-related-chips">
                {other.featured ? <FeaturedChip /> : null}
                {other.fromXai ? <FromXaiChip as="span" /> : null}
              </span>
            ) : null}
            <p className="rp-related-tag">{other.tagline}</p>
            <ConnectorRow names={other.connectors} labeled size={15} />
          </li>
        ))}
      </ul>
    </section>
  );
}
