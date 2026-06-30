import React from 'react';
import { Guide } from '../../types/guide';
import Link from 'next/link';
import Image from 'next/image';

interface GuideHeroProps {
  guide: Guide;
}

export default function GuideHero({ guide }: GuideHeroProps) {
  return (
    <div className="mb-16 border border-gray-200 overflow-hidden bg-brand-pink rounded-xl flex flex-col md:flex-row">
      <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
        <div className="uppercase font-bold text-[10px] tracking-widest mb-6 bg-brand-lime text-brand-dark inline-block px-3 py-1 border border-brand-dark self-start rounded-full">Featured Guide</div>
        <h2 className="text-4xl md:text-5xl font-black uppercase text-brand-dark mb-4 leading-[1.1] tracking-tighter">
          {guide.title}
        </h2>
        <p className="text-lg text-brand-dark mb-8 font-medium">
          {guide.content.substring(0, 100)}...
        </p>
        <Link href={`/guides/${guide.slug}`} className="self-start px-8 py-3 bg-brand-lime text-brand-dark font-bold uppercase tracking-wider rounded-full hover:bg-yellow-400 transition-colors">
          Read Guide
        </Link>
      </div>
      <div className="md:w-1/2 bg-brand-pink p-8 md:p-12 flex items-center justify-center relative min-h-[300px]">
        {guide.coverImageUrl ? (
          <Image src={guide.coverImageUrl} alt={guide.title} fill className="object-contain p-8" />
        ) : (
          <img src="https://api.dicebear.com/9.x/notionists/svg?seed=Reading&backgroundColor=f7d8e5" alt="Illustration" className="w-full h-full object-contain" />
        )}
      </div>
    </div>
  );
}
