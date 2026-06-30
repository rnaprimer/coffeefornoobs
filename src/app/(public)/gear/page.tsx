import React from 'react';
import Container from '../../../components/layout/Container';
import PageHeader from '../../../components/shared/PageHeader';
import GearFilters from '../../../components/gear/GearFilters';
import GearGrid from '../../../components/gear/GearGrid';
import { getProducts, getCategories } from '../../../lib/queries/products';
import { Coffee, Cylinder, Filter, Settings, Droplets, Scale, Wrench, ChevronRight } from 'lucide-react';

export default async function GearPage() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-brand-white pb-20">
      <PageHeader 
        title="Our Coffee Gear" 
        description="Handpicked gear that's beginner friendly and brews amazing coffee." 
        illustrationSrc="https://api.dicebear.com/9.x/notionists/svg?seed=Barista&backgroundColor=e6ff00"
      />
      
      {/* Category Navigation Bar */}
      <div className="border-b border-brand-dark bg-white">
        <Container className="py-4">
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-8">
            <button className="flex flex-col items-center gap-2 group min-w-[80px]">
              <div className="w-12 h-12 rounded-full bg-brand-lime border border-brand-dark flex items-center justify-center">
                <Coffee className="w-6 h-6 text-brand-dark" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark">All Gear</span>
            </button>
            <button className="flex flex-col items-center gap-2 group min-w-[80px] opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 flex items-center justify-center">
                <Coffee className="w-6 h-6 text-brand-dark" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark">French Press</span>
            </button>
            <button className="flex flex-col items-center gap-2 group min-w-[80px] opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 flex items-center justify-center">
                <Cylinder className="w-6 h-6 text-brand-dark" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark">Aeropress</span>
            </button>
            <button className="flex flex-col items-center gap-2 group min-w-[80px] opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 flex items-center justify-center">
                <Filter className="w-6 h-6 text-brand-dark" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark">Pour Over</span>
            </button>
            <button className="flex flex-col items-center gap-2 group min-w-[80px] opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 flex items-center justify-center">
                <Settings className="w-6 h-6 text-brand-dark" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark">Grinders</span>
            </button>
            <button className="flex flex-col items-center gap-2 group min-w-[80px] opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 flex items-center justify-center">
                <Droplets className="w-6 h-6 text-brand-dark" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark">Kettles</span>
            </button>
            <button className="flex flex-col items-center gap-2 group min-w-[80px] opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 flex items-center justify-center">
                <Scale className="w-6 h-6 text-brand-dark" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark">Scales</span>
            </button>
            <button className="flex flex-col items-center gap-2 group min-w-[80px] opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 flex items-center justify-center">
                <Wrench className="w-6 h-6 text-brand-dark" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark">Accessories</span>
            </button>
            
            <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center shrink-0 ml-4 hover:border-brand-dark">
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </Container>
      </div>

      <Container className="mt-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 shrink-0">
            <h3 className="font-bold text-xs uppercase tracking-widest text-brand-dark mb-4">Filter By</h3>
            <GearFilters categories={categories} activeCategory="all" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-medium text-gray-500">Showing 1-12 of 48 products</span>
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
            <GearGrid products={products} />
          </div>
        </div>
      </Container>
    </div>
  );
}

