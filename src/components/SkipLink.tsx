import { en } from "@/lib/messages/en";

export function SkipLink() {
  return (
    <a className="skip-link" href="#content">
      {en.nav.skip}
    </a>
  );
}
