import React from 'react';
import { Plus, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  name: string;
  price: number;
  rating: number;
  reviews: number;
  badge?: string;
  imageUrl?: string;
  imageText: string;
  slug?: string;
}

export default function ProductCard({ name, price, rating, reviews, badge, imageUrl, imageText, slug }: ProductCardProps) {
  const content = (
    <div className="bg-brand-white border border-brand-dark rounded-xl p-3 flex flex-col transition-all cursor-pointer group h-full">
      
      <div className="bg-gray-50 rounded-lg h-48 w-full relative flex items-center justify-center mb-4 overflow-hidden">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        ) : (
          <span className="font-bold text-gray-400 text-xl">{imageText}</span>
        )}
        {badge && (
          <div className="absolute top-2 left-2 z-10 bg-brand-lime text-brand-dark text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full border border-brand-dark">
            {badge}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-bold text-sm leading-snug mb-1 group-hover:underline decoration-2 underline-offset-2">{name}</h3>
          <div className="flex items-center text-xs font-bold mb-4">
            <div className="flex text-brand-lime mr-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} fill="currentColor" />
              ))}
            </div>
            <span>{rating} ({reviews})</span>
          </div>
        </div>

        <div className="flex items-end justify-between mt-2">
          <p className="font-black text-lg">₹{price.toLocaleString('en-IN')}</p>
          <button className="w-8 h-8 rounded-full border border-brand-dark flex items-center justify-center group-hover:bg-brand-lime transition-colors">
            <Plus size={16} />
          </button>
        </div>
      </div>

    </div>
  );

  if (slug) {
    return <Link href={`/gear/${slug}`} className="block h-full">{content}</Link>;
  }

  return content;
}
