import React from 'react';

interface TagProps {
  label: string;
  color?: 'pink' | 'lime' | 'white' | 'dark';
}

export default function Tag({ label, color = 'pink' }: TagProps) {
  const bgColors = {
    pink: 'bg-brand-pink',
    lime: 'bg-brand-lime',
    white: 'bg-brand-white',
    dark: 'bg-brand-dark text-brand-white'
  };

  const textColor = color === 'dark' ? 'text-brand-white' : 'text-brand-dark';

  return (
    <span className={`px-3 py-1 border-2 border-brand-dark font-bold text-sm uppercase ${bgColors[color]} ${textColor}`}>
      {label}
    </span>
  );
}
