import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

interface ProductBlockRendererProps {
  id: string;
}

export async function ProductBlockRenderer({ id }: ProductBlockRendererProps) {
  if (!id) return null;

  const supabase = await createClient();
  if (!supabase) return <div className="p-4 border rounded-md text-red-500">Failed to load product.</div>;
  const { data: product, error } = await supabase
    .from('products')
    .select('*, brand:brands(name)')
    .eq('id', id)
    .single<any>();

  if (error || !product) {
    return (
      <div className="p-4 border-2 border-brand-dark bg-brand-white text-gray-500 font-bold uppercase tracking-widest text-center">
        Product not found
      </div>
    );
  }

  return (
    <div className="my-8 border-4 border-brand-dark bg-brand-white shadow-[8px_8px_0px_#111111] overflow-hidden flex flex-col md:flex-row">
      <div className="md:w-1/3 relative aspect-square md:aspect-auto md:h-full min-h-[200px] bg-gray-100 border-b-4 md:border-b-0 md:border-r-4 border-brand-dark">
        {product.image_url && (
          <Image 
            src={product.image_url} 
            alt={product.name} 
            fill 
            className="object-cover" 
            unoptimized={product.image_url.startsWith('http')} 
          />
        )}
      </div>
      <div className="p-6 md:w-2/3 flex flex-col justify-center">
        <h3 className="font-black text-2xl uppercase tracking-wider mb-2 text-brand-dark">
          {product.name}
        </h3>
        {product.price && (
          <p className="font-bold text-brand-pink text-xl mb-4">
            ${(product.price / 100).toFixed(2)}
          </p>
        )}
        {product.affiliate_link ? (
          <a 
            href={product.affiliate_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-brand-lime text-brand-dark font-black uppercase tracking-widest border-4 border-brand-dark hover:bg-yellow-400 transition-colors self-start shadow-[4px_4px_0px_#111111] hover:translate-y-1 hover:shadow-none"
          >
            Check Price
          </a>
        ) : (
          <Link
            href={`/learn`} // We don't have a product detail page in scope, maybe /equipment?
            className="inline-block px-8 py-3 bg-brand-lime text-brand-dark font-black uppercase tracking-widest border-4 border-brand-dark hover:bg-yellow-400 transition-colors self-start shadow-[4px_4px_0px_#111111] hover:translate-y-1 hover:shadow-none"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
}
