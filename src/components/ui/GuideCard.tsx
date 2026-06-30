import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface GuideCardProps {
  slug: string;
  title: string;
  coverImageText: string;
  coverImageUrl?: string;
  category?: string;
  readingTime?: string;
}

export default function GuideCard({ slug, title, coverImageText, coverImageUrl, category = "BREWING GUIDE", readingTime = "6 min read" }: GuideCardProps) {
  return (
    <Link href={`/guides/${slug}`} className="block border border-gray-200 rounded-lg overflow-hidden group bg-white hover:shadow-md transition-all h-full flex flex-col">
      <div className="h-56 bg-brand-pink flex items-center justify-center p-6 text-center relative overflow-hidden">
        {coverImageUrl ? (
          <Image src={coverImageUrl} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <span className="text-brand-dark font-black uppercase tracking-widest leading-tight relative z-10">{coverImageText}</span>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between border-t border-gray-200">
        <h3 className="text-lg font-bold text-brand-dark leading-snug mb-6 group-hover:text-brand-lime transition-colors">{title}</h3>
        
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
          <span>{category}</span>
          <span>{readingTime}</span>
        </div>
      </div>
    </Link>
  );
}
