import React from 'react';
import { Guide } from '../../types/guide';
import Link from 'next/link';
import Image from 'next/image';

interface GuideHeroProps {
  guide: Guide;
}

export default function GuideHero({ guide }: GuideHeroProps) {
  return (
    <div className="mb-16 border-4 border-brand-dark overflow-hidden bg-brand-lime shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] flex flex-col md:flex-row">
      <div className="md:w-1/2 bg-brand-dark p-8 md:p-12 flex items-center justify-center relative min-h-[250px]">
        {guide.coverImageUrl ? (
          <Image src={guide.coverImageUrl} alt={guide.title} fill className="object-cover opacity-80" />
        ) : (
          <span className="text-brand-white font-black text-3xl uppercase tracking-widest relative z-10">{guide.coverImageText}</span>
        )}
      </div>
      <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-brand-white">
        <div className="uppercase font-bold text-sm mb-4 bg-brand-pink text-brand-dark inline-block px-3 py-1 border-2 border-brand-dark self-start">Featured Guide</div>
        <h2 className="text-3xl md:text-5xl font-black uppercase text-brand-dark mb-4 leading-tight">
          {guide.title}
        </h2>
        <p className="text-lg text-brand-dark mb-6 font-medium">
          {guide.content.substring(0, 100)}...
        </p>
        <Link href={`/guides/${guide.slug}`} className="self-start px-6 py-3 bg-brand-lime text-brand-dark font-bold uppercase tracking-wide border-2 border-brand-dark shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-transform hover:-translate-y-1 hover:translate-x-1 hover:shadow-[0px_0px_0px_0px_rgba(17,17,17,1)]">
          Read Guide
        </Link>
      </div>
    </div>
  );
}
