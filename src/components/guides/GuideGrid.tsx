import React from 'react';
import { Guide } from '../../types/guide';
import GuideCard from '../ui/GuideCard';

interface GuideGridProps {
  guides: Guide[];
}

export default function GuideGrid({ guides }: GuideGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {guides.map((guide) => (
        <GuideCard
          key={guide.id}
          slug={guide.slug}
          title={guide.title}
          coverImageText={guide.coverImageText}
        />
      ))}
    </div>
  );
}
