import React from 'react';
import Container from '../../../components/layout/Container';
import PageHeader from '../../../components/shared/PageHeader';
import ComparisonGrid from '../../../components/comparisons/ComparisonGrid';
import { comparisons } from '../../../data/comparisons';

export default function ComparisonsPage() {
  const featured = comparisons[0];

  return (
    <div className="min-h-screen bg-brand-white pb-20">
      <PageHeader 
        title="Comparisons" 
        description="Head-to-head battles between popular coffee equipment." 
      />
      <Container>
        {featured && (
          <div className="mb-16 border-4 border-brand-dark p-8 md:p-12 bg-brand-pink shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <div className="uppercase font-bold text-sm mb-4 bg-brand-lime text-brand-dark inline-block px-3 py-1 border-2 border-brand-dark">Featured</div>
              <h2 className="text-4xl md:text-5xl font-black uppercase text-brand-dark mb-4">{featured.title}</h2>
              <p className="text-xl text-brand-dark font-medium mb-6">{featured.description}</p>
              <a href={`/comparisons/${featured.slug}`} className="inline-block px-6 py-3 bg-brand-white text-brand-dark font-bold uppercase tracking-wide border-2 border-brand-dark shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-transform hover:-translate-y-1 hover:translate-x-1 hover:shadow-[0px_0px_0px_0px_rgba(17,17,17,1)]">
                Read Matchup
              </a>
            </div>
            <div className="md:w-1/2 flex items-center justify-center font-black text-6xl text-brand-dark opacity-50 italic">
              VS
            </div>
          </div>
        )}
        
        <h2 className="text-3xl font-black uppercase text-brand-dark mb-8">All Comparisons</h2>
        <ComparisonGrid comparisons={comparisons} />
      </Container>
    </div>
  );
}
