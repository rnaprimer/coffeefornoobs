import React from 'react';
import { PriceBadge } from './PriceBadge';
import { AvailabilityBadge } from './AvailabilityBadge';
import { CouponBadge } from './CouponBadge';
import { ShippingBadge } from './ShippingBadge';
import { BuyButton } from './BuyButton';

interface MerchantCardProps {
  productMerchant: any;
  productSlug: string;
}

export function MerchantCard({ productMerchant, productSlug }: MerchantCardProps) {
  const m = productMerchant;
  const merchantSlug = m.merchants?.slug;
  const merchantName = m.merchants?.name || 'Retailer';

  return (
    <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      
      {/* Left: Merchant Info & Badges */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-brand-dark text-lg">{merchantName}</span>
          <AvailabilityBadge status={m.availability} />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 mt-1">
          <ShippingBadge 
            freeShipping={m.free_shipping} 
            estimatedDelivery={m.estimated_delivery} 
          />
          {m.coupon_available && m.coupon_code && (
            <CouponBadge code={m.coupon_code} />
          )}
        </div>
      </div>

      {/* Right: Price & Button */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-gray-100">
        <PriceBadge 
          currentPrice={m.current_price || 0} 
          originalPrice={m.original_price} 
          currency={m.currency} 
        />
        
        <BuyButton 
          merchantSlug={merchantSlug} 
          productSlug={productSlug} 
          text={m.buy_button_text || 'Buy'}
        />
      </div>

    </div>
  );
}
