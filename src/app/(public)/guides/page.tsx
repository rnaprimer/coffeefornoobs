import React from 'react';
import Container from '../../../components/layout/Container';
import PageHeader from '../../../components/shared/PageHeader';
import GuideHero from '../../../components/guides/GuideHero';
import GuideGrid from '../../../components/guides/GuideGrid';
import { getGuides } from '../../../lib/queries/guides';

export default async function GuidesPage() {
  const guides = await getGuides();
  const featuredGuide = guides.find(g => g.slug === 'how-to-make-coffee-in-a-french-press') || guides[0];
  const remainingGuides = guides.filter(g => g.id !== featuredGuide?.id);

  return (
    <div className="min-h-screen bg-brand-white pb-20">
      <PageHeader 
        title="Coffee Guides" 
        description="Learn everything from basic brewing to advanced espresso theory." 
      />
      <Container>
        {featuredGuide && <GuideHero guide={featuredGuide} />}
        
        <div className="mb-8">
          <h2 className="text-3xl font-black uppercase text-brand-dark mb-8">All Guides</h2>
          <div className="flex flex-wrap gap-4 items-center mb-8">
            <span className="font-bold text-brand-dark">Categories:</span>
            <button className="px-4 py-2 font-bold uppercase bg-brand-pink border-2 border-brand-dark shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
              All
            </button>
            <button className="px-4 py-2 font-bold uppercase bg-brand-white border-2 border-brand-dark shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
              Brewing
            </button>
            <button className="px-4 py-2 font-bold uppercase bg-brand-white border-2 border-brand-dark shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
              Equipment
            </button>
          </div>
        </div>

        <GuideGrid guides={remainingGuides.length > 0 ? remainingGuides : guides} />
      </Container>
    </div>
  );
}

