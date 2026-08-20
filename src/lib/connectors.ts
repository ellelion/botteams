export type ConnectorMark = {
  name: string;
  slug: string;
  src: string;
};

const FILES: Record<string, string> = {
  gmail: "gmail.svg",
  calendar: "google-calendar.svg",
  "google calendar": "google-calendar.svg",
  googlecalendar: "google-calendar.svg",
  stripe: "stripe.svg",
  slack: "slack.svg",
  github: "github.svg",
  drive: "google-drive.svg",
  "google drive": "google-drive.svg",
  googledrive: "google-drive.svg",
  x: "x.svg",
  twitter: "x.svg",
  notion: "notion.svg",
  salesforce: "salesforce.svg",
  vercel: "vercel.svg",
  linear: "linear.svg",
  resend: "resend.svg",
};

export function connectorKey(name: string): string {
  return name.trim().toLowerCase().replace(/[_-]+/g, " ");
}

export function resolveConnector(name: string): ConnectorMark {
  const key = connectorKey(name);
  const file = FILES[key] ?? FILES[key.replace(/\s+/g, "")];
  const slug = key.replace(/\s+/g, "-");
  return {
    name,
    slug,
    src: file ? `/connectors/${file}` : "",
  };
}

export function resolveConnectors(names: string[]): ConnectorMark[] {
  const seen = new Set<string>();
  const out: ConnectorMark[] = [];
  for (const name of names) {
    const mark = resolveConnector(name);
    const id = mark.slug || mark.name.toLowerCase();
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(mark);
  }
  return out;
}
