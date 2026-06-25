import React from 'react';
import Link from 'next/link';

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="mb-8 text-brand-dark font-bold uppercase text-sm flex flex-wrap items-center">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.href ? (
            <Link href={item.href} className="hover:underline hover:text-brand-pink transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-brand-lime bg-brand-dark px-2 py-1">{item.label}</span>
          )}
          {index < items.length - 1 && <span className="mx-2">/</span>}
        </React.Fragment>
      ))}
    </div>
  );
}
