import React from 'react';
import { Plus, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface BeanCardProps {
  brand: string;
  name: string;
  price: number;
  slug?: string;
  imageUrl?: string;
  roaster?: string;
  roastLevel?: string;
  tastingNotes?: string[];
}

export default function BeanCard({ brand, name, price, slug, imageUrl, roastLevel }: BeanCardProps) {
  const content = (
    <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col transition-all cursor-pointer group h-full hover:shadow-sm">
      
      <div className="bg-white h-48 w-full relative flex items-center justify-center mb-6 overflow-hidden">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-contain group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <span className="text-[10px] font-bold uppercase tracking-widest leading-none text-gray-400">Coffee Bag</span>
        )}
        {roastLevel && (
          <div className="absolute top-0 left-0 z-10 bg-brand-lime text-brand-dark text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-sm border border-brand-dark">
            {roastLevel}
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <p className="text-[10px] text-brand-lime font-black uppercase tracking-widest mb-1">{brand}</p>
          <h3 className="font-bold text-[15px] leading-snug mb-2 group-hover:text-brand-lime transition-colors">{name}</h3>
          <p className="font-black text-lg mb-4">₹{price.toLocaleString('en-IN')}</p>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
          <div className="flex items-center text-xs font-bold text-gray-500">
            <div className="flex text-yellow-400 mr-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill="currentColor" stroke="transparent" />
              ))}
            </div>
            <span>4.8 (124)</span> {/* Static mock for beans as rating isn't in BeanCardProps yet */}
          </div>
          <button className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-brand-dark hover:text-brand-dark transition-colors">
            <Plus size={14} />
          </button>
        </div>
      </div>

    </div>
  );

  if (slug) {
    return <Link href={`/beans/${slug}`} className="block h-full">{content}</Link>;
  }

  return content;
}
