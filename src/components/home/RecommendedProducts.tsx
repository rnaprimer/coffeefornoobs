import React from 'react';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../ui/ProductCard';
import { Product } from '@/types/product';
import { HomepageSection } from '@/types/homepage';

interface RecommendedProductsProps {
  section: HomepageSection;
  products: Product[];
}

export default function RecommendedProducts({ section, products = [] }: RecommendedProductsProps) {
  // Display only first 4 recommended products
  const displayProducts = products.slice(0, 4);

  return (
    <section className="bg-brand-white p-8 lg:p-12 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl lg:text-2xl font-black uppercase tracking-tight">{section.title || 'Recommended For You'}</h2>
        <a href={section.button_url || "/gear"} className="text-xs font-bold uppercase tracking-widest flex items-center hover:text-brand-lime transition-colors">
          {section.button_text || 'View All'} <ArrowRight size={14} className="ml-1" />
        </a>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}

