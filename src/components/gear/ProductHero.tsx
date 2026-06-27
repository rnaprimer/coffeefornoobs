import React from 'react';
import { Product } from '../../types/product';
import Image from 'next/image';

export default function ProductHero({ product }: { product: Product }) {
  return (
    <div className="border-4 border-brand-dark bg-brand-pink shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] mb-12 flex flex-col md:flex-row overflow-hidden">
      <div className="md:w-1/2 p-12 bg-brand-dark flex items-center justify-center relative min-h-[300px]">
        {product.imageUrl ? (
          <div className="absolute inset-0">
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover opacity-80" />
            <div className="absolute inset-0 bg-brand-dark/20 mix-blend-multiply" />
          </div>
        ) : (
          <div className="w-64 h-64 bg-brand-white border-4 border-brand-dark rounded-full flex items-center justify-center transform -rotate-6 relative z-10">
            <span className="font-black text-2xl uppercase tracking-widest text-brand-dark">{product.imageText}</span>
          </div>
        )}
      </div>
      <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-brand-white border-l-4 border-brand-dark">
        {product.badge && (
          <span className="bg-brand-lime text-brand-dark font-bold uppercase text-xs px-3 py-1 border-2 border-brand-dark self-start mb-4">
            {product.badge}
          </span>
        )}
        <h1 className="text-4xl md:text-5xl font-black uppercase text-brand-dark mb-4">{product.name}</h1>
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-brand-dark text-brand-lime font-black px-4 py-2 text-xl">₹{product.price}</div>
          <div className="flex items-center text-brand-dark font-bold">
            <span className="text-xl mr-1">★</span> {product.rating} ({product.reviews} reviews)
          </div>
        </div>
        <p className="text-lg text-brand-dark font-medium mb-8">{product.description}</p>
        <button className="px-8 py-4 bg-brand-lime text-brand-dark font-black uppercase tracking-widest border-4 border-brand-dark shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-transform hover:-translate-y-1 hover:translate-x-1 hover:shadow-[0px_0px_0px_0px_rgba(17,17,17,1)] w-full text-center">
          Check Latest Price
        </button>
      </div>
    </div>
  );
}
