import React from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface BeanCardProps {
  brand: string;
  name: string;
  price: number;
  slug?: string;
  roaster?: string;
  roastLevel?: string;
  tastingNotes?: string[];
}

export default function BeanCard({ brand, name, price, slug }: BeanCardProps) {
  const content = (
    <div className="flex items-center group cursor-pointer border-4 border-transparent hover:border-brand-dark p-2 transition-all">
      <div className="w-12 h-12 bg-brand-dark flex flex-col items-center justify-center shrink-0 border-2 border-brand-dark group-hover:bg-brand-lime group-hover:text-brand-dark text-brand-white transition-colors">
        <span className="text-[8px] font-bold uppercase tracking-widest leading-none">Bag</span>
      </div>
      
      <div className="flex-1 ml-4 mr-4">
        <h3 className="font-bold text-sm leading-tight group-hover:underline decoration-2 underline-offset-2">{brand}</h3>
        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{name}</p>
        <p className="font-black mt-1">₹{price}</p>
      </div>

      <button className="w-8 h-8 shrink-0 rounded-full border-2 border-brand-dark flex items-center justify-center group-hover:bg-brand-lime transition-colors">
        <Plus size={16} />
      </button>
    </div>
  );

  if (slug) {
    return <Link href={`/beans/${slug}`} className="block">{content}</Link>;
  }

  return content;
}
