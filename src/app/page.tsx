import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
import { parseIndexQuery } from "@/lib/catalog-query";
import { getListingChrome } from "@/lib/rail-inventory";
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
  /* generateMetadata string titles skip the layout template here, so
     every shelf sets the full tab name. Default stays the existing
     directory title. */
  const title = {
    absolute:
      kind === "bot"
        ? `${en.home.indexTitleBots} · ${site.name}`
        : kind === "all"
          ? `${en.home.indexTitleAll} · ${site.name}`
          : site.title,
  };
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
  const sponsors = await getListingChrome();
  return (
    <>
      <JsonLd data={teamListJsonLd(teams)} />
      <HomePage teams={teams} query={query} sponsors={sponsors} />
    </>
  );
}
