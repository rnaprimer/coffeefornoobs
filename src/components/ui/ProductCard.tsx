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
    <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col transition-all cursor-pointer group h-full hover:shadow-sm">
      
      <div className="bg-gray-50 rounded-md h-48 w-full relative flex items-center justify-center mb-6 overflow-hidden">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-contain group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <span className="font-bold text-gray-400 text-xl">{imageText}</span>
        )}
        {badge && (
          <div className="absolute top-0 left-0 z-10 bg-brand-lime text-brand-dark text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-sm border border-brand-dark">
            {badge}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-bold text-[15px] leading-snug mb-2 group-hover:underline decoration-2 underline-offset-2 transition-all">{name}</h3>
          <p className="font-black text-lg mb-4">₹{price.toLocaleString('en-IN')}</p>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
          <div className="flex items-center text-xs font-bold text-gray-500">
            <div className="flex text-yellow-400 mr-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill={i < Math.floor(rating) ? "currentColor" : "transparent"} stroke={i < Math.floor(rating) ? "currentColor" : "#CBD5E1"} />
              ))}
            </div>
            <span>{rating} ({reviews})</span>
          </div>
          <button className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-brand-dark hover:text-brand-dark transition-colors">
            <Plus size={14} />
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
