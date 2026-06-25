import React from 'react';

interface GearFiltersProps {
  categories: { id: string; name: string; slug: string }[];
  activeCategory: string;
}

export default function GearFilters({ categories, activeCategory }: GearFiltersProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <span className="font-bold text-brand-dark">Filter by:</span>
        <button className={`px-4 py-2 font-bold uppercase border-2 border-brand-dark shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-transform hover:-translate-y-1 hover:translate-x-1 hover:shadow-[0px_0px_0px_0px_rgba(17,17,17,1)] ${activeCategory === 'all' ? 'bg-brand-lime' : 'bg-brand-white'}`}>
          All Gear
        </button>
        {categories.map((cat) => (
          <button key={cat.id} className={`px-4 py-2 font-bold uppercase border-2 border-brand-dark shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-transform hover:-translate-y-1 hover:translate-x-1 hover:shadow-[0px_0px_0px_0px_rgba(17,17,17,1)] ${activeCategory === cat.slug ? 'bg-brand-lime' : 'bg-brand-white'}`}>
            {cat.name}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <span className="font-bold text-brand-dark">Sort by:</span>
        <select className="px-4 py-2 font-bold uppercase border-2 border-brand-dark bg-brand-white focus:outline-none focus:ring-2 focus:ring-brand-lime">
          <option>Recommended</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Highest Rated</option>
        </select>
      </div>
    </div>
  );
}
