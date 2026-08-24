import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
import { parseIndexQuery } from "@/lib/catalog-query";
import { listAll } from "@/lib/teams";
import { teamListJsonLd } from "@/lib/seo";
import { en } from "@/lib/messages/en";
import { site } from "@/lib/site";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { kind } = parseIndexQuery(await searchParams);
  /* Default keeps the existing full title. Bots and All use the shelf
     name so the tab matches the heading the field already follows. */
  const title =
    kind === "bot"
      ? en.home.indexTitleBots
      : kind === "all"
        ? en.home.indexTitleAll
        : { absolute: site.title };
  return {
    title,
    description: site.description,
    alternates: { canonical: site.url },
  };
}

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
