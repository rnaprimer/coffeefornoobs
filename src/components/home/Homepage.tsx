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

export default function Homepage() {
  return (
    <div className="w-full">
      <Hero />
      <CategoryStrip />
      
      {/* Three column section: Gear, Guides, SetupBuilder */}
      <div className="flex flex-col lg:flex-row w-full border-b-4 border-brand-dark">
        <GearSection />
        <GuidesSection />
        <SetupBuilder />
      </div>

      <div className="flex flex-col lg:flex-row w-full border-b-4 border-brand-dark">
        <div className="flex-1 border-r-0 lg:border-r-4 border-brand-dark">
          <RecommendedProducts />
        </div>
        <BestBeans />
      </div>

      <FeaturesStrip />
      <Newsletter />
    </div>
  );
}
