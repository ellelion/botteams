import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
import { listTeams } from "@/lib/teams";
import { teamListJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  alternates: { canonical: site.url },
};

function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function Home() {
  const teams = listTeams();
  return (
    <>
      <JsonLd data={teamListJsonLd(teams)} />
      <HomePage teams={teams} />
    </>
  );
}
