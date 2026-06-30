import React from 'react';
import { Plus } from 'lucide-react';
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

export default function BeanCard({ brand, name, price, slug, imageUrl }: BeanCardProps) {
  const content = (
    <div className="flex items-center group cursor-pointer bg-white border border-transparent hover:border-gray-200 hover:shadow-sm p-3 transition-all rounded-lg">
      <div className="w-16 h-16 bg-gray-50 rounded-md flex flex-col items-center justify-center shrink-0 relative overflow-hidden">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <span className="text-[10px] font-bold uppercase tracking-widest leading-none text-gray-400">Bag</span>
        )}
      </div>
      
      <div className="flex-1 ml-4 mr-4">
        <h3 className="font-bold text-sm leading-tight group-hover:underline decoration-2 underline-offset-2 transition-all">{brand}</h3>
        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-0.5">{name}</p>
        <p className="font-black mt-1">₹{price.toLocaleString('en-IN')}</p>
      </div>

      <button className="w-8 h-8 shrink-0 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 group-hover:border-brand-dark group-hover:text-brand-dark transition-colors bg-white">
        <Plus size={16} />
      </button>
    </div>
  );

  if (slug) {
    return <Link href={`/beans/${slug}`} className="block">{content}</Link>;
  }

  return content;
}

