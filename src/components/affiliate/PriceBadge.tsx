import React from 'react';
import { formatPrice } from '@/lib/affiliate';

interface PriceBadgeProps {
  currentPrice: number;
  originalPrice?: number;
  currency?: string;
  className?: string;
}

export function PriceBadge({ currentPrice, originalPrice, currency = 'INR', className = '' }: PriceBadgeProps) {
  const hasDiscount = originalPrice && originalPrice > currentPrice;
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-black text-xl text-brand-dark">{formatPrice(currentPrice, currency)}</span>
      {hasDiscount && (
        <span className="text-sm font-medium text-gray-400 line-through">
          {formatPrice(originalPrice, currency)}
        </span>
      )}
    </div>
  );
}
