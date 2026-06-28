import React from 'react';

interface AvailabilityBadgeProps {
  status: string;
  className?: string;
}

export function AvailabilityBadge({ status, className = '' }: AvailabilityBadgeProps) {
  let colors = 'text-gray-600';
  if (status === 'In Stock') colors = 'text-green-600';
  else if (status === 'Limited Stock') colors = 'text-amber-600';
  else if (status === 'Out of Stock') colors = 'text-red-600';
  else if (status === 'Preorder') colors = 'text-blue-600';

  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider ${colors} ${className}`}>
      {status}
    </span>
  );
}
