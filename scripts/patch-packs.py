
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
PACKS = ROOT / "packs"

META = {
  "founder-os": {
    "Chief of Staff": ("staff", ["Calendar"]),
    "Founder · Money": ("card", ["Stripe"]),
    "Founder · Inbox": ("inbox", ["Gmail"]),
  },
  "sales": {
    "Sales · Pipeline": ("pipeline", ["Calendar"]),
    "Sales · Follow-ups": ("inbox", ["Gmail"]),
  },
  "support": {
    "Support · Triage": ("inbox", ["Gmail"]),
    "Support · Drafts": ("pen", ["Gmail"]),
    "Support · Follow-ups": ("inbox", ["Gmail"]),
  },
  "agency": {
    "Agency · Intake": ("inbox", ["Gmail"]),
    "Agency · Accounts": ("calendar", ["Calendar"]),
    "Agency · Delivery": ("calendar", ["Calendar"]),
    "Agency · Billing": ("card", ["Stripe"]),
    "Agency · Follow-ups": ("inbox", ["Gmail"]),
    "Agency · Recap": ("recap", []),
  },
  "bookkeeping": {
    "Books · Stripe": ("card", ["Stripe"]),
    "Books · Receipts": ("inbox", ["Gmail"]),
    "Books · Close": ("calendar", ["Calendar"]),
    "Books · Exceptions": ("shield", ["Stripe"]),
    "Books · Drafts": ("pen", ["Gmail"]),
    "Books · Recap": ("recap", []),
  },
  "community": {
    "Community · Inbound": ("inbox", ["Gmail"]),
    "Community · Welcome": ("pen", ["Gmail"]),
    "Community · Moderation": ("shield", ["Gmail"]),
    "Community · Calendar": ("calendar", ["Calendar"]),
    "Community · Follow-ups": ("inbox", ["Gmail"]),
    "Community · Recap": ("recap", []),
  },
  "content": {
    "Content · Calendar": ("calendar", ["Calendar"]),
    "Content · Outline": ("pen", []),
    "Content · Draft": ("pen", []),
    "Content · Review": ("search", []),
    "Content · Inbox": ("inbox", ["Gmail"]),
    "Content · Recap": ("recap", []),
  },
  "creator": {
    "Creator · Lead": ("staff", []),
    "Creator · Script": ("pen", []),
    "Creator · Calendar": ("calendar", ["Calendar"]),
    "Creator · Sponsors": ("inbox", ["Gmail"]),
    "Creator · Inbox": ("inbox", ["Gmail"]),
    "Creator · Recap": ("recap", []),
  },
  "customer-success": {
    "Success · Health": ("health", ["Stripe"]),
    "Success · Inbox": ("inbox", ["Gmail"]),
    "Success · Renewals": ("calendar", ["Calendar"]),
    "Success · QBR": ("calendar", ["Calendar"]),
    "Success · Follow-ups": ("inbox", ["Gmail"]),
    "Success · Recap": ("recap", []),
  },
  "events": {
    "Events · Run of show": ("calendar", ["Calendar"]),
    "Events · Guests": ("inbox", ["Gmail"]),
    "Events · Calendar": ("calendar", ["Calendar"]),
    "Events · Inbox": ("inbox", ["Gmail"]),
    "Events · Follow-up": ("inbox", ["Gmail"]),
    "Events · Recap": ("recap", []),
  },
  "hiring": {
    "Hiring · Inbound": ("inbox", ["Gmail"]),
    "Hiring · Pipeline": ("pipeline", []),
    "Hiring · Screen": ("search", ["Gmail"]),
    "Hiring · Schedule": ("calendar", ["Calendar"]),
    "Hiring · Offers": ("pen", ["Gmail"]),
    "Hiring · Recap": ("recap", []),
  },
  "investor-updates": {
    "Investor · Numbers": ("card", ["Stripe"]),
    "Investor · Letter": ("pen", []),
    "Investor · Calendar": ("calendar", ["Calendar"]),
    "Investor · Drafts": ("inbox", ["Gmail"]),
    "Investor · Questions": ("inbox", ["Gmail"]),
    "Investor · Recap": ("recap", []),
  },
  "legal": {
    "Legal · Intake": ("inbox", ["Gmail"]),
    "Legal · Review": ("search", ["Gmail"]),
    "Legal · Calendar": ("calendar", ["Calendar"]),
    "Legal · Follow-ups": ("inbox", ["Gmail"]),
    "Legal · Archive": ("clipboard", []),
    "Legal · Recap": ("recap", []),
  },
  "onboarding": {
    "Onboarding · Kickoff": ("staff", []),
    "Onboarding · Checklist": ("clipboard", []),
    "Onboarding · Calendar": ("calendar", ["Calendar"]),
    "Onboarding · Mail": ("inbox", ["Gmail"]),
    "Onboarding · Blockers": ("shield", []),
    "Onboarding · Recap": ("recap", []),
  },
  "partnerships": {
    "Partnerships · Inbound": ("inbox", ["Gmail"]),
    "Partnerships · Map": ("pipeline", []),
    "Partnerships · Intros": ("pen", ["Gmail"]),
    "Partnerships · Calendar": ("calendar", ["Calendar"]),
    "Partnerships · Follow-ups": ("inbox", ["Gmail"]),
    "Partnerships · Recap": ("recap", []),
  },
  "product": {
    "Product · Intake": ("inbox", ["Gmail"]),
    "Product · Roadmap": ("pipeline", []),
    "Product · Specs": ("pen", []),
    "Product · Calendar": ("calendar", ["Calendar"]),
    "Product · Follow-ups": ("inbox", ["Gmail"]),
    "Product · Recap": ("recap", []),
  },
  "recruiting": {
    "Recruiting · Sourcer": ("search", []),
    "Recruiting · Outreach": ("inbox", ["Gmail"]),
    "Recruiting · Calendar": ("calendar", ["Calendar"]),
    "Recruiting · Pipeline": ("pipeline", []),
    "Recruiting · Inbox": ("inbox", ["Gmail"]),
    "Recruiting · Recap": ("recap", []),
  },
  "research": {
    "Research · Brief": ("staff", []),
    "Research · Sources": ("search", []),
    "Research · Notes": ("pen", []),
    "Research · Synthesis": ("pen", []),
    "Research · Calendar": ("calendar", ["Calendar"]),
    "Research · Recap": ("recap", []),
  },
}

def yaml_list(items):
    if not items:
        return "    connectors: []\n"
    lines = ["    connectors:\n"]
    for item in items:
        lines.append("      - %s\n" % item)
    return "".join(lines)

def patch_text(slug, text):
    text = re.sub(r"^seats:", "bots:", text, count=1, flags=re.M)
    meta = META.get(slug, {})
    lines = text.splitlines(keepends=True)
    out = []
    i = 0
    in_agents = False
    while i < len(lines):
        line = lines[i]
        if line.startswith("agents:"):
            in_agents = True
            out.append(line)
            i += 1
            continue
        if in_agents and line.startswith("rooms:"):
            in_agents = False
        if in_agents and re.match(r"  - name: ", line):
            name = line.split("name:", 1)[1].strip()
            out.append(line)
            i += 1
            # copy remaining agent fields until next agent or rooms
            block = []
            while i < len(lines):
                nxt = lines[i]
                if nxt.startswith("  - name: ") or nxt.startswith("rooms:"):
                    break
                block.append(nxt)
                i += 1
            joined = "".join(block)
            if "icon:" not in joined and name in meta:
                icon, conns = meta[name]
                # insert after last existing field in block
                # keep persona and reuse
                out.extend(block)
                if "icon:" not in joined:
                    out.append("    icon: %s\n" % icon)
                if "connectors:" not in joined:
                    out.append(yaml_list(conns))
            else:
                out.extend(block)
            continue
        out.append(line)
        i += 1
    text = "".join(out)
    text = text.replace("three-seat", "three-Bot")
    text = text.replace("two-seat", "two-Bot")
    text = text.replace("six-seat", "six-Bot")
    text = text.replace("6-seat", "6-Bot")
    return text

def main():
    for path in sorted(PACKS.glob("*.md")):
        slug = path.stem
        original = path.read_text()
        updated = patch_text(slug, original)
        if updated != original:
            path.write_text(updated)
            print("patched", slug)
        else:
            print("unchanged", slug)

if __name__ == "__main__":
    main()
