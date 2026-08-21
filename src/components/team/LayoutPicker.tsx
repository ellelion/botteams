"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { en } from "@/lib/messages/en";
import { LAYOUTS, type RecipeLayout } from "@/lib/recipe-layout";

/*
 * A choose-pass, not a preference.
 *
 * The layout lives in the URL and nowhere else: no localStorage, no
 * cookie. Three arrangements of the same recipe, so one can be picked and
 * the other two deleted.
 */
export function LayoutPicker({ current }: { current: RecipeLayout }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function pick(next: RecipeLayout) {
    const usp = new URLSearchParams(params.toString());
    if (next === "rail") usp.delete("layout");
    else usp.set("layout", next);
    const qs = usp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="rc-pick">
      <span className="rc-pick-label">{en.recipe.layout}</span>
      {LAYOUTS.map((l) => (
        <button
          key={l.id}
          type="button"
          className={`rc-pick-btn${current === l.id ? " is-on" : ""}`}
          aria-pressed={current === l.id}
          onClick={() => pick(l.id)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
