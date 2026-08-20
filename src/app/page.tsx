import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
import { listPacks } from "@/lib/packs";
import { packListJsonLd } from "@/lib/seo";
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
  const packs = listPacks();
  return (
    <>
      <JsonLd data={packListJsonLd(packs)} />
      <HomePage packs={packs} />
    </>
  );
}
