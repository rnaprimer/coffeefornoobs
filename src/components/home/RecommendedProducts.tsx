import React from 'react';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../ui/ProductCard';
import { recommendedProducts } from '../../data/products';

export default function RecommendedProducts() {
  return (
    <section className="bg-brand-white p-8 lg:p-12 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl lg:text-2xl font-black uppercase tracking-tight">Recommended For You</h2>
        <a href="/gear" className="text-xs font-bold uppercase tracking-widest flex items-center hover:text-brand-lime transition-colors">
          View All <ArrowRight size={14} className="ml-1" />
        </a>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
        {recommendedProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
