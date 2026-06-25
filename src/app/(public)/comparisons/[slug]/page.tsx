import React from 'react';
import { notFound } from 'next/navigation';
import { comparisons } from '../../../../data/comparisons';
import Container from '../../../../components/layout/Container';
import Link from 'next/link';

export function generateStaticParams() {
  return comparisons.map((comp) => ({
    slug: comp.slug,
  }));
}

export default async function ComparisonDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const comp = comparisons.find((c) => c.slug === slug);

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
            <p className="text-xl text-brand-dark font-medium max-w-3xl mx-auto">{comp.recommendation}</p>
          </div>
        </div>
      </Container>
    </div>
  );
}
