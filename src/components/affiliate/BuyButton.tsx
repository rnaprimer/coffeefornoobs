import React from 'react';

interface BuyButtonProps {
  merchantSlug: string;
  productSlug: string;
  text?: string;
  primary?: boolean;
  className?: string;
}

export function BuyButton({ merchantSlug, productSlug, text = 'Buy Now', primary = false, className = '' }: BuyButtonProps) {
  const url = `/go/${merchantSlug}/${productSlug}`;

  if (primary) {
    return (
      <a 
        href={url} 
        target="_blank"
        rel="noopener noreferrer"
        className={`px-8 py-4 bg-brand-lime text-brand-dark font-black uppercase tracking-widest border-4 border-brand-dark shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-transform hover:-translate-y-1 hover:translate-x-1 hover:shadow-[0px_0px_0px_0px_rgba(17,17,17,1)] w-full text-center block ${className}`}
      >
        {text}
      </a>
    );
  }

  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`px-4 py-2 bg-brand-dark text-brand-lime font-black text-xs uppercase tracking-widest rounded border-2 border-brand-dark hover:bg-gray-800 transition-colors ${className}`}
    >
      {text}
    </a>
  );
}
