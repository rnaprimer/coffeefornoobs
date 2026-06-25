import React from 'react';
import Link from 'next/link';

interface GuideCardProps {
  slug: string;
  title: string;
  coverImageText: string;
}

export default function GuideCard({ slug, title, coverImageText }: GuideCardProps) {
  return (
    <Link href={`/guides/${slug}`} className="block border-4 border-brand-dark overflow-hidden group bg-brand-white shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[0px_0px_0px_0px_rgba(17,17,17,1)] transition-all h-full flex flex-col">
      <div className="h-48 bg-brand-dark flex items-center justify-center border-b-4 border-brand-dark p-6 text-center">
        <span className="text-brand-white font-black uppercase tracking-widest leading-tight group-hover:text-brand-lime transition-colors">{coverImageText}</span>
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <h3 className="text-xl font-black uppercase text-brand-dark leading-tight mb-4 group-hover:underline decoration-2 underline-offset-2">{title}</h3>
        <div className="flex items-center gap-2 text-brand-dark font-bold uppercase text-xs tracking-wide">
          <span>Read Guide</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </div>
      </div>
    </Link>
  );
}
