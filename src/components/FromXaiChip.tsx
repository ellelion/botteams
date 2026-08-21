import { en } from "@/lib/messages/en";
import { XAI_USE_CASE_GALLERY } from "@/lib/site";

/*
 * Sourcing, not endorsement.
 *
 * This is deliberately a different chip from Verified and says a different
 * thing. Verified is our claim that a recipe fits the published group-chat
 * limits. This one only says where the job came from. It is never worded as
 * a seal of approval, and it links to xAI's own gallery so a reader can
 * check the source for themselves.
 */
export function FromXaiChip({ className = "" }: { className?: string }) {
  return (
    <a
      className={`chip chip-xai ${className}`}
      href={XAI_USE_CASE_GALLERY}
      target="_blank"
      rel="noopener noreferrer"
      title={en.xai.chipTitle}
    >
      {en.xai.chip}
    </a>
  );
}
