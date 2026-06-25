import React from 'react';
import Link from 'next/link';

interface ComparisonCardProps {
  slug: string;
  title: string;
  description: string;
}

export default function ComparisonCard({ slug, title, description }: ComparisonCardProps) {
  return (
    <Link href={`/comparisons/${slug}`} className="block border-4 border-brand-dark p-6 bg-brand-white shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[0px_0px_0px_0px_rgba(17,17,17,1)] transition-all">
      <h3 className="text-2xl font-black uppercase text-brand-dark mb-4">{title}</h3>
      <p className="text-brand-dark font-medium">{description}</p>
      <div className="mt-6 flex items-center gap-2 text-brand-dark font-bold uppercase text-sm">
        <span>Read Comparison</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
      </div>
    </Link>
  );
}
