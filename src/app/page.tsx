import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
import { parseIndexQuery } from "@/lib/catalog-query";
import { listAll } from "@/lib/teams";
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

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const teams = listAll();
  const query = parseIndexQuery(await searchParams);
  return (
    <>
      <JsonLd data={teamListJsonLd(teams)} />
      <HomePage teams={teams} query={query} />
    </>
  );
}
