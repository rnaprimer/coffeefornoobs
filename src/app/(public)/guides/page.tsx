import React from 'react';
import Container from '../../../components/layout/Container';
import PageHeader from '../../../components/shared/PageHeader';
import GuideHero from '../../../components/guides/GuideHero';
import GuideGrid from '../../../components/guides/GuideGrid';
import { getGuides } from '../../../lib/queries/guides';
import { BookOpen, Coffee, Droplets, Info } from 'lucide-react';

import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Guides",
  description: "Read our comprehensive coffee guides.",
  url: "https://coffeefornoobs.com/guides"
});



export default async function GuidesPage() {
  const guides = await getGuides();
  const featuredGuide = guides.find(g => g.slug === 'how-to-make-coffee-in-a-french-press') || guides[0];
  const remainingGuides = guides.filter(g => g.id !== featuredGuide?.id);

  return (
    <div className="min-h-screen bg-brand-white pb-20">
      <PageHeader 
        title="Coffee Guides" 
        description="Step-by-step brewing guides, explainers and tips for beginners." 
        illustrationSrc="https://api.dicebear.com/9.x/notionists/svg?seed=Reader&backgroundColor=f7d8e5"
      />
      
      {/* Category Navigation Bar */}
      <div className="border-b border-brand-dark bg-white">
        <Container className="py-4">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
            <button className="flex items-center gap-2 group px-4 py-2 bg-brand-lime border border-brand-dark rounded-full shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-dark">All Guides</span>
            </button>
            <button className="flex items-center gap-2 group px-4 py-2 opacity-70 hover:opacity-100 transition-opacity shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-dark">Brewing Guides</span>
            </button>
            <button className="flex items-center gap-2 group px-4 py-2 opacity-70 hover:opacity-100 transition-opacity shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-dark">Coffee Basics</span>
            </button>
            <button className="flex items-center gap-2 group px-4 py-2 opacity-70 hover:opacity-100 transition-opacity shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-dark">Tips & Tricks</span>
            </button>
            <button className="flex items-center gap-2 group px-4 py-2 opacity-70 hover:opacity-100 transition-opacity shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-dark">Explainers</span>
            </button>
          </div>
        </Container>
      </div>

      <Container className="mt-12">
        {featuredGuide && <GuideHero guide={featuredGuide} />}
        
        <GuideGrid guides={remainingGuides.length > 0 ? remainingGuides : guides} />
        
        <div className="mt-16 flex justify-center">
          <button className="px-8 py-3 bg-brand-lime text-brand-dark font-bold uppercase tracking-wider rounded-full hover:bg-yellow-400 transition-colors border border-brand-dark">
            Load More Guides
          </button>
        </div>
      </Container>
    </div>
  );
}

