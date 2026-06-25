import React from 'react';

interface ProductSpecsProps {
  specs: Record<string, string>;
}

export default function ProductSpecs({ specs }: ProductSpecsProps) {
  return (
    <div className="border-4 border-brand-dark bg-brand-white shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] p-8">
      <h3 className="text-2xl font-black uppercase text-brand-dark mb-6">Specifications</h3>
      <div className="space-y-4">
        {Object.entries(specs).map(([key, value]) => (
          <div key={key} className="flex border-b-2 border-brand-dark pb-2">
            <span className="font-bold text-brand-dark w-1/3">{key}</span>
            <span className="font-medium text-brand-dark w-2/3">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
