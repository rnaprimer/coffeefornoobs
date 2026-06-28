import React from 'react';

interface CouponBadgeProps {
  code: string;
  className?: string;
}

export function CouponBadge({ code, className = '' }: CouponBadgeProps) {
  if (!code) return null;

  return (
    <div className={`inline-flex items-center gap-1.5 bg-brand-pink border border-brand-dark px-2 py-0.5 rounded text-xs font-bold text-brand-dark ${className}`}>
      <span className="text-[10px] uppercase tracking-wider text-gray-500">Coupon:</span>
      <span className="tracking-widest">{code}</span>
    </div>
  );
}
