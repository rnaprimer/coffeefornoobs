import React from 'react';
import { Comparison } from '../../types/comparison';
import ComparisonCard from '../ui/ComparisonCard';

interface ComparisonGridProps {
  comparisons: Comparison[];
}

export default function ComparisonGrid({ comparisons }: ComparisonGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {comparisons.map((comp) => (
        <ComparisonCard
          key={comp.id}
          slug={comp.slug}
          title={comp.title}
          description={comp.description}
        />
      ))}
    </div>
  );
}
