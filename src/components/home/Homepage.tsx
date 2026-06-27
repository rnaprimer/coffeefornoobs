import React from 'react';
import Hero from './Hero';
import CategoryStrip from './CategoryStrip';
import GearSection from './GearSection';
import GuidesSection from './GuidesSection';
import SetupBuilder from './SetupBuilder';
import RecommendedProducts from './RecommendedProducts';
import BestBeans from './BestBeans';
import FeaturesStrip from './FeaturesStrip';
import Newsletter from './Newsletter';
import { HomepageData, HomepageSection } from '@/types/homepage';

interface HomepageProps {
  data: HomepageData;
}

export default function Homepage({ data }: HomepageProps) {
  const { sections, items } = data;

  const getSection = (key: string) => sections.find(s => s.section_key === key);
  const isEnabled = (s: HomepageSection | undefined) => s && s.enabled;
  const getItems = (sectionId: string | undefined) => sectionId ? items.filter(i => i.homepage_section_id === sectionId) : [];

  const heroSection = getSection('hero');
  const catSection = getSection('categories');
  const setupSection = getSection('setup_builder');
  const prodSection = getSection('featured_products');
  const guidesSection = getSection('featured_guides');
  const beansSection = getSection('featured_beans');
  const newsSection = getSection('newsletter');
  
  // We can pass the mapped entity arrays to existing components 
  const categories = getItems(catSection?.id).map(i => i.category).filter(Boolean) as any[];
  const products = getItems(prodSection?.id).map(i => i.product).filter(Boolean) as any[];
  const guides = getItems(guidesSection?.id).map(i => i.guide).filter(Boolean) as any[];
  const beans = getItems(beansSection?.id).map(i => i.bean).filter(Boolean) as any[];

  return (
    <div className="w-full">
      {/* Announcement banner logic can be added here if needed */}
      {data.settings.announcement_enabled && (
        <div className="bg-brand-dark text-white p-2 text-center text-sm font-bold border-b-4 border-black">
          {data.settings.announcement_text}
          {data.settings.announcement_url && (
            <a href={data.settings.announcement_url} className="ml-2 underline">
              {data.settings.announcement_button || 'Learn More'}
            </a>
          )}
        </div>
      )}

      {isEnabled(heroSection) && <Hero section={heroSection!} />}
      {isEnabled(catSection) && <CategoryStrip categories={categories} />}
      
      {/* Three column section: Gear, Guides, SetupBuilder */}
      <div className="flex flex-col lg:flex-row w-full border-b border-brand-dark">
        <GearSection />
        {isEnabled(guidesSection) && <GuidesSection section={guidesSection!} guides={guides} />}
        {isEnabled(setupSection) && <SetupBuilder section={setupSection!} />}
      </div>

      <div className="flex flex-col lg:flex-row w-full border-b border-brand-dark">
        {isEnabled(prodSection) && (
          <div className="flex-1 border-r-0 lg:border-r border-brand-dark">
            <RecommendedProducts section={prodSection!} products={products} />
          </div>
        )}
        {isEnabled(beansSection) && <BestBeans section={beansSection!} beans={beans} />}
      </div>

      <FeaturesStrip />
      {isEnabled(newsSection) && <Newsletter section={newsSection!} />}
    </div>
  );
}

