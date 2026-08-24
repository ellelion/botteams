import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuidePage } from "@/components/GuidePage";
import { getGuide, guideUpdated, guideUrl, listGuides } from "@/lib/guides";

export function generateStaticParams() {
  return listGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  const canonical = guideUrl(guide.slug);
  const updated = guideUpdated();
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: canonical,
      type: "article",
      publishedTime: updated,
      modifiedTime: updated,
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
    },
  };
}

export default async function GuideSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();
  return <GuidePage guide={guide} />;
}
