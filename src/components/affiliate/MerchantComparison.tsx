import React from 'react';
import { MerchantCard } from './MerchantCard';

interface MerchantComparisonProps {
  merchants: any[];
  productSlug: string;
  className?: string;
}

export function MerchantComparison({ merchants, productSlug, className = '' }: MerchantComparisonProps) {
  if (!merchants || merchants.length === 0) return null;

  return (
    <div className={`border-2 border-brand-dark bg-brand-white p-4 rounded-xl space-y-4 ${className}`}>
      <h3 className="font-black text-sm uppercase tracking-wider text-brand-dark border-b-2 border-brand-dark pb-3">
        Compare All Sellers
      </h3>
      
      <div className="flex flex-col gap-3">
        {merchants.map((item) => (
          <MerchantCard 
            key={item.id} 
            productMerchant={item} 
            productSlug={productSlug} 
          />
        ))}
      </div>
    </div>
  );
}
