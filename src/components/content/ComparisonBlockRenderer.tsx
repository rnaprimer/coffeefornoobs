import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

interface ComparisonBlockRendererProps {
  product1Id: string;
  product2Id: string;
}

export async function ComparisonBlockRenderer({ product1Id, product2Id }: ComparisonBlockRendererProps) {
  if (!product1Id || !product2Id) return null;

  const supabase = await createClient();
  if (!supabase) return <div className="p-4 border rounded-md text-red-500">Failed to load comparison.</div>;
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .in('id', [product1Id, product2Id])
    .returns<any[]>();

  if (error || !products || products.length !== 2) {
    return (
      <div className="p-4 border-2 border-brand-dark bg-brand-white text-gray-500 font-bold uppercase tracking-widest text-center">
        Comparison data incomplete
      </div>
    );
  }

  // Ensure they are in the requested order
  const p1 = products.find(p => p.id === product1Id) || products[0];
  const p2 = products.find(p => p.id === product2Id) || products[1];

  return (
    <div className="my-8 border-4 border-brand-dark bg-brand-white shadow-[8px_8px_0px_#111111] overflow-hidden flex flex-col md:flex-row relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-brand-pink text-white font-black flex items-center justify-center rounded-full border-4 border-brand-dark shadow-[4px_4px_0px_#111111] text-lg hidden md:flex">
        VS
      </div>
      
      <div className="md:w-1/2 flex flex-col border-b-4 md:border-b-0 md:border-r-4 border-brand-dark">
        <div className="relative aspect-square w-full bg-gray-50 border-b-4 border-brand-dark">
          {p1.image_url && (
            <Image 
              src={p1.image_url} 
              alt={p1.name} 
              fill 
              className="object-cover p-4" 
              unoptimized={p1.image_url.startsWith('http')} 
            />
          )}
        </div>
        <div className="p-6 flex flex-col flex-1">
          <h3 className="font-black text-xl uppercase tracking-wider mb-2 text-brand-dark">
            {p1.name}
          </h3>
          {p1.price && (
            <p className="font-bold text-brand-pink text-lg mb-4">
              ${(p1.price / 100).toFixed(2)}
            </p>
          )}
          <div className="mt-auto">
            {p1.affiliate_link ? (
              <a 
                href={p1.affiliate_link}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-4 py-3 bg-brand-lime text-brand-dark font-black uppercase tracking-widest border-2 border-brand-dark hover:bg-yellow-400 transition-colors shadow-[4px_4px_0px_#111111] hover:translate-y-1 hover:shadow-none"
              >
                Check Price
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="md:w-1/2 flex flex-col">
        <div className="relative aspect-square w-full bg-gray-50 border-b-4 border-brand-dark">
          {p2.image_url && (
            <Image 
              src={p2.image_url} 
              alt={p2.name} 
              fill 
              className="object-cover p-4" 
              unoptimized={p2.image_url.startsWith('http')} 
            />
          )}
        </div>
        <div className="p-6 flex flex-col flex-1">
          <h3 className="font-black text-xl uppercase tracking-wider mb-2 text-brand-dark">
            {p2.name}
          </h3>
          {p2.price && (
            <p className="font-bold text-brand-pink text-lg mb-4">
              ${(p2.price / 100).toFixed(2)}
            </p>
          )}
          <div className="mt-auto">
            {p2.affiliate_link ? (
              <a 
                href={p2.affiliate_link}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-4 py-3 bg-brand-lime text-brand-dark font-black uppercase tracking-widest border-2 border-brand-dark hover:bg-yellow-400 transition-colors shadow-[4px_4px_0px_#111111] hover:translate-y-1 hover:shadow-none"
              >
                Check Price
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
