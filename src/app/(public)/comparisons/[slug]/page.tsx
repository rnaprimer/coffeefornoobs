import React from 'react';
import { notFound } from 'next/navigation';
import { getComparisons, getComparisonBySlug } from '../../../../lib/queries/comparisons';
import Container from '../../../../components/layout/Container';
import { ContentRenderer } from '../../../../components/content/ContentRenderer';
import Link from 'next/link';
import { Metadata } from 'next';
import { constructMetadata } from '../../../../lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const comp = await getComparisonBySlug(slug);
  if (!comp) return {};

  return constructMetadata({
    title: comp.title,
    description: comp.description,
    url: `https://coffeefornoobs.com/comparisons/${slug}`
  });
}



export default async function ComparisonDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const comp = await getComparisonBySlug(slug);

  if (!comp) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-brand-white pb-20 pt-12">
      <Container>
        <div className="mb-8 text-brand-dark font-bold uppercase text-sm">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/comparisons" className="hover:underline">Comparisons</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-lime bg-brand-dark px-2 py-1">{comp.title}</span>
        </div>

        <div className="mb-12 border-4 border-brand-dark bg-brand-pink shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] p-8 md:p-16 text-center">
          <h1 className="text-4xl md:text-5xl font-black uppercase text-brand-dark mb-6 leading-tight">
            {comp.title}
          </h1>
          <p className="text-xl font-bold text-brand-dark max-w-2xl mx-auto">{comp.description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="border-4 border-brand-dark p-8 bg-brand-white text-center">
            <h2 className="text-3xl font-black uppercase text-brand-dark mb-4">{comp.productA.replace('-', ' ')}</h2>
            <div className="w-full h-48 bg-brand-dark mb-4 flex items-center justify-center text-brand-white font-bold">Image A</div>
          </div>
          <div className="border-4 border-brand-dark p-8 bg-brand-white text-center">
            <h2 className="text-3xl font-black uppercase text-brand-dark mb-4">{comp.productB.replace('-', ' ')}</h2>
            <div className="w-full h-48 bg-brand-dark mb-4 flex items-center justify-center text-brand-white font-bold">Image B</div>
          </div>
        </div>

        <div className="border-4 border-brand-dark p-8 md:p-12 bg-brand-lime shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
          <h2 className="text-3xl font-black uppercase text-brand-dark mb-6 text-center">The Verdict</h2>
          <div className="text-center">
            <span className="inline-block px-4 py-2 bg-brand-dark text-brand-lime font-black uppercase text-xl mb-6">
              Winner: {comp.winner.replace('-', ' ')}
            </span>
            <p className="text-xl text-brand-dark font-medium max-w-3xl mx-auto mb-12">{comp.recommendation}</p>
          </div>
          {(comp as any).content_json && (
            <div className="mt-12 pt-12 border-t-4 border-brand-dark max-w-4xl mx-auto text-left">
              <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-brand-dark prose-headings:uppercase prose-p:text-brand-dark prose-p:font-medium prose-a:text-brand-lime prose-a:bg-brand-dark prose-a:px-1 prose-a:font-bold hover:prose-a:bg-brand-pink prose-a:no-underline prose-strong:text-brand-dark prose-strong:bg-brand-white prose-strong:px-1">
                <ContentRenderer content={(comp as any).content_json} />
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

