import React from 'react';

interface RelatedContentProps {
  title: string;
  children: React.ReactNode;
}

export default function RelatedContent({ title, children }: RelatedContentProps) {
  return (
    <div className="mt-16 border-t-4 border-brand-dark pt-12">
      <h3 className="text-3xl font-black uppercase text-brand-dark mb-8">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {children}
      </div>
    </div>
  );
}
