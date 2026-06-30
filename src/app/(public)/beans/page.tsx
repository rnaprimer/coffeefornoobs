import React from 'react';
import Container from '../../../components/layout/Container';
import PageHeader from '../../../components/shared/PageHeader';
import BeanGrid from '../../../components/beans/BeanGrid';
import { getBeans, getRoasters } from '../../../lib/queries/beans';
import { Coffee, ChevronRight, CircleDot, Bean } from 'lucide-react';

export default async function BeansPage() {
  const beans = await getBeans();
  const roasters = await getRoasters();

  return (
    <div className="min-h-screen bg-brand-white pb-20">
      <PageHeader 
        title="Best Coffee Beans" 
        description="Great beans make great coffee. Find the perfect roast for your taste." 
        illustrationSrc="https://api.dicebear.com/9.x/notionists/svg?seed=Beans&backgroundColor=e6ff00"
      />

      {/* Category Navigation Bar */}
      <div className="border-b border-brand-dark bg-white">
        <Container className="py-4">
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-8">
            <button className="flex flex-col items-center gap-2 group min-w-[80px]">
              <div className="w-12 h-12 rounded-full bg-brand-lime border border-brand-dark flex items-center justify-center">
                <Coffee className="w-6 h-6 text-brand-dark" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark">All Beans</span>
            </button>
            <button className="flex flex-col items-center gap-2 group min-w-[80px] opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 flex items-center justify-center">
                <CircleDot className="w-6 h-6 text-brand-dark" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark">Light Roast</span>
            </button>
            <button className="flex flex-col items-center gap-2 group min-w-[80px] opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 flex items-center justify-center">
                <CircleDot className="w-6 h-6 text-brand-dark fill-brand-dark/50" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark">Medium Roast</span>
            </button>
            <button className="flex flex-col items-center gap-2 group min-w-[80px] opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 flex items-center justify-center">
                <CircleDot className="w-6 h-6 text-brand-dark fill-brand-dark" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark">Dark Roast</span>
            </button>
            <button className="flex flex-col items-center gap-2 group min-w-[80px] opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 flex items-center justify-center">
                <Bean className="w-6 h-6 text-brand-dark" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark">Single Origin</span>
            </button>
            <button className="flex flex-col items-center gap-2 group min-w-[80px] opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 flex items-center justify-center">
                <Bean className="w-6 h-6 text-brand-dark" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark">Blends</span>
            </button>
            
            <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center shrink-0 ml-4 hover:border-brand-dark">
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </Container>
      </div>

      <Container className="mt-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          <div className="w-full md:w-64 shrink-0 pr-8">
            <h3 className="font-bold text-xs uppercase tracking-widest text-brand-dark mb-4">Filter By</h3>
            
            <div className="mb-8">
              <h4 className="font-bold text-xs uppercase tracking-widest text-brand-dark mb-4 mt-6">Roast Level</h4>
              <div className="space-y-3">
                {['Light', 'Medium', 'Dark'].map((level) => (
                  <label key={level} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-4 h-4 border border-brand-dark bg-white group-hover:bg-gray-100" />
                    <span className="text-sm font-medium text-gray-600">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h4 className="font-bold text-xs uppercase tracking-widest text-brand-dark mb-4">Type</h4>
              <div className="space-y-3">
                {['Single Origin', 'Blend'].map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-4 h-4 border border-brand-dark bg-white group-hover:bg-gray-100" />
                    <span className="text-sm font-medium text-gray-600">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h4 className="font-bold text-xs uppercase tracking-widest text-brand-dark mb-4">Price</h4>
              <div className="space-y-3">
                {['Under ₹500', '₹500 - ₹1,000', '₹1,000+'].map((price) => (
                  <label key={price} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-4 h-4 border border-brand-dark bg-white group-hover:bg-gray-100" />
                    <span className="text-sm font-medium text-gray-600">{price}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h4 className="font-bold text-xs uppercase tracking-widest text-brand-dark mb-4">Brewing Method</h4>
              <div className="space-y-3">
                {['Pour Over', 'French Press', 'Espresso', 'All Methods'].map((method) => (
                  <label key={method} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-4 h-4 border border-brand-dark bg-white group-hover:bg-gray-100" />
                    <span className="text-sm font-medium text-gray-600">{method}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-medium text-gray-500">Showing 1-12 of {beans.length} beans</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select className="text-sm font-medium bg-transparent border-b border-gray-300 focus:outline-none focus:border-brand-dark pb-1">
                  <option>Popular</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Highest Rated</option>
                </select>
              </div>
            </div>
            <BeanGrid beans={beans} />
          </div>
        </div>
      </Container>
    </div>
  );
}

