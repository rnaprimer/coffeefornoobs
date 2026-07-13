import React from 'react';
import { Bean } from '../../types/bean';
import BeanCard from '../ui/BeanCard';

interface BeanGridProps {
  beans: Bean[];
}

export default function BeanGrid({ beans }: BeanGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {beans.map((bean) => (
        <BeanCard
          key={bean.id}
          id={bean.id}
          slug={bean.slug}
          name={bean.name}
          brand={bean.brand}
          roaster={bean.brand}
          roastLevel={bean.roastLevel}
          tastingNotes={bean.tastingNotes}
          price={bean.price}
        />
      ))}
    </div>
  );
}
