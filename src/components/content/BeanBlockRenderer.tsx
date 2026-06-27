import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

interface BeanBlockRendererProps {
  id: string;
}

export async function BeanBlockRenderer({ id }: BeanBlockRendererProps) {
  if (!id) return null;

  const supabase = await createClient();
  if (!supabase) return <div className="p-4 border rounded-md text-red-500">Failed to load bean.</div>;
  const { data: bean, error } = await supabase
    .from('beans')
    .select('*, roasters(name)')
    .eq('id', id)
    .single<any>();

  if (error || !bean) {
    return (
      <div className="p-4 border-2 border-brand-dark bg-brand-white text-gray-500 font-bold uppercase tracking-widest text-center">
        Bean not found
      </div>
    );
  }

  return (
    <div className="my-8 border-4 border-brand-dark bg-brand-white shadow-[8px_8px_0px_#111111] overflow-hidden flex flex-col md:flex-row">
      <div className="md:w-1/3 relative aspect-square md:aspect-auto md:h-full min-h-[200px] bg-[#3B291A] border-b-4 md:border-b-0 md:border-r-4 border-brand-dark flex items-center justify-center p-8">
        {bean.image_url ? (
          <div className="relative w-full h-full max-w-[200px] max-h-[200px] rounded-full overflow-hidden border-4 border-brand-dark shadow-[4px_4px_0px_#111111]">
            <Image 
              src={bean.image_url} 
              alt={bean.name} 
              fill 
              className="object-cover" 
              unoptimized={bean.image_url.startsWith('http')} 
            />
          </div>
        ) : (
          <div className="text-brand-white font-bold uppercase">No Image</div>
        )}
      </div>
      <div className="p-6 md:w-2/3 flex flex-col justify-center">
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">
          {bean.roasters?.name || 'Unknown Roaster'}
        </p>
        <h3 className="font-black text-2xl uppercase tracking-wider mb-2 text-brand-dark">
          {bean.name}
        </h3>
        
        <div className="flex gap-2 flex-wrap mb-4">
          {bean.roast_level && (
            <span className="px-2 py-1 border-2 border-brand-dark bg-brand-lime text-xs font-bold uppercase tracking-widest">
              {bean.roast_level} Roast
            </span>
          )}
          {bean.process && (
            <span className="px-2 py-1 border-2 border-brand-dark bg-brand-pink text-white text-xs font-bold uppercase tracking-widest">
              {bean.process} Process
            </span>
          )}
        </div>

        {bean.flavor_notes && bean.flavor_notes.length > 0 && (
          <div className="mb-4">
            <p className="font-bold text-sm uppercase tracking-widest text-brand-dark mb-1">Tasting Notes:</p>
            <p className="font-medium">{bean.flavor_notes.join(', ')}</p>
          </div>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between">
          {bean.price && (
            <p className="font-bold text-brand-pink text-xl">
              ${(bean.price / 100).toFixed(2)}
            </p>
          )}
          {bean.affiliate_link ? (
            <a 
              href={bean.affiliate_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 bg-brand-lime text-brand-dark font-black uppercase tracking-widest border-4 border-brand-dark hover:bg-yellow-400 transition-colors shadow-[4px_4px_0px_#111111] hover:translate-y-1 hover:shadow-none"
            >
              Buy Now
            </a>
          ) : (
            <Link
              href={`/beans/${bean.slug}`} // Assuming we might add bean pages later, or we can just point to /beans
              className="inline-block px-6 py-2 bg-brand-lime text-brand-dark font-black uppercase tracking-widest border-4 border-brand-dark hover:bg-yellow-400 transition-colors shadow-[4px_4px_0px_#111111] hover:translate-y-1 hover:shadow-none"
            >
              View Bean
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
