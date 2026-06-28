import React from 'react';
import { Truck } from 'lucide-react';

interface ShippingBadgeProps {
  freeShipping?: boolean;
  estimatedDelivery?: string;
  className?: string;
}

export function ShippingBadge({ freeShipping, estimatedDelivery, className = '' }: ShippingBadgeProps) {
  if (!freeShipping && !estimatedDelivery) return null;

  return (
    <div className={`flex items-center gap-1 text-xs font-medium text-gray-600 ${className}`}>
      <Truck size={14} className="text-gray-400" />
      {freeShipping && <span className="text-green-700 font-bold">Free Shipping</span>}
      {freeShipping && estimatedDelivery && <span className="text-gray-300">•</span>}
      {estimatedDelivery && <span>{estimatedDelivery}</span>}
    </div>
  );
}
