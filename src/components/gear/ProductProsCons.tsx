import React from 'react';

interface ProductProsConsProps {
  pros: string[];
  cons: string[];
}

export default function ProductProsCons({ pros, cons }: ProductProsConsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <div className="border-4 border-brand-dark p-6 bg-brand-lime">
        <h3 className="text-2xl font-black uppercase text-brand-dark mb-4 flex items-center">
          <span className="mr-2">👍</span> Pros
        </h3>
        <ul className="space-y-2 font-bold text-brand-dark">
          {pros.map((pro, idx) => (
            <li key={idx} className="flex items-start">
              <span className="mr-2 text-brand-dark">✓</span> {pro}
            </li>
          ))}
        </ul>
      </div>
      <div className="border-4 border-brand-dark p-6 bg-brand-pink">
        <h3 className="text-2xl font-black uppercase text-brand-dark mb-4 flex items-center">
          <span className="mr-2">👎</span> Cons
        </h3>
        <ul className="space-y-2 font-bold text-brand-dark">
          {cons.map((con, idx) => (
            <li key={idx} className="flex items-start">
              <span className="mr-2 text-brand-dark">✕</span> {con}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
