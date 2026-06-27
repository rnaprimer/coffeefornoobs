import React from 'react';
import { notFound } from 'next/navigation';
import { getGuides, getGuideBySlug } from '../../../../lib/queries/guides';
import Container from '../../../../components/layout/Container';
import { ContentRenderer } from '../../../../components/content/ContentRenderer';
import Link from 'next/link';
import { Metadata } from 'next';
import { constructMetadata } from '../../../../lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) return {};

  return constructMetadata({
    title: guide.title,
    description: guide.content.substring(0, 150),
    url: `https://coffeefornoobs.com/guides/${slug}`
  });
}



export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-brand-white pb-20 pt-12">
      <Container>
        <div className="mb-8 text-brand-dark font-bold uppercase text-sm">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/guides" className="hover:underline">Guides</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-lime bg-brand-dark px-2 py-1">{guide.title}</span>
        </div>

        <div className="mb-12 border-4 border-brand-dark bg-brand-pink shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] p-8 md:p-16">
          <div className="uppercase font-bold text-sm mb-4 bg-brand-lime text-brand-dark inline-block px-3 py-1 border-2 border-brand-dark">
            {guide.readingTime}
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase text-brand-dark mb-6 leading-tight">
            {guide.title}
          </h1>
          <p className="text-xl font-bold text-brand-dark">By {guide.author}</p>
        </div>
        
        <div className="max-w-4xl mx-auto border-4 border-brand-dark p-8 md:p-12 bg-brand-white shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
          <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-brand-dark prose-headings:uppercase prose-p:text-brand-dark prose-p:font-medium prose-a:text-brand-lime prose-a:bg-brand-dark prose-a:px-1 prose-a:font-bold hover:prose-a:bg-brand-pink prose-a:no-underline prose-strong:text-brand-dark prose-strong:bg-brand-lime/30 prose-strong:px-1">
            {(guide as any).content_json ? (
              <ContentRenderer content={(guide as any).content_json} />
            ) : (
              <div className="text-lg text-brand-dark font-medium leading-relaxed space-y-6">
                <p>{guide.content}</p>
                <p>This section is a static placeholder for future markdown or rich-text CMS content. It demonstrates how the guide content will be displayed and styled.</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

