import React from 'react';

interface GearFiltersProps {
  categories: { id: string; name: string; slug: string }[];
  activeCategory: string;
}

export default function GearFilters({ categories, activeCategory }: GearFiltersProps) {
  return (
    <div className="w-full md:w-64 shrink-0 pr-8">
      <div className="mb-8">
        <h3 className="font-bold text-xs uppercase tracking-widest text-brand-dark mb-4">Type</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-4 h-4 border border-brand-dark flex items-center justify-center ${activeCategory === 'all' ? 'bg-brand-lime' : 'bg-white group-hover:bg-gray-100'}`}>
              {activeCategory === 'all' && <div className="w-2 h-2 bg-brand-dark" />}
            </div>
            <span className={`text-sm font-medium ${activeCategory === 'all' ? 'text-brand-dark font-bold' : 'text-gray-600'}`}>All Gear</span>
          </label>
          
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 border border-brand-dark flex items-center justify-center ${activeCategory === cat.slug ? 'bg-brand-lime' : 'bg-white group-hover:bg-gray-100'}`}>
                {activeCategory === cat.slug && <div className="w-2 h-2 bg-brand-dark" />}
              </div>
              <span className={`text-sm font-medium ${activeCategory === cat.slug ? 'text-brand-dark font-bold' : 'text-gray-600'}`}>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-bold text-xs uppercase tracking-widest text-brand-dark mb-4">Price</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="w-4 h-4 border border-brand-dark bg-white group-hover:bg-gray-100" />
            <span className="text-sm font-medium text-gray-600">Under ₹1,000</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="w-4 h-4 border border-brand-dark bg-white group-hover:bg-gray-100" />
            <span className="text-sm font-medium text-gray-600">₹1,000 - ₹3,000</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="w-4 h-4 border border-brand-dark bg-white group-hover:bg-gray-100" />
            <span className="text-sm font-medium text-gray-600">₹3,000 - ₹7,000</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="w-4 h-4 border border-brand-dark bg-white group-hover:bg-gray-100" />
            <span className="text-sm font-medium text-gray-600">₹7,000+</span>
          </label>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-bold text-xs uppercase tracking-widest text-brand-dark mb-4">Rating</h3>
        <div className="space-y-3">
          {[4, 3, 2, 1].map((stars) => (
            <label key={stars} className="flex items-center gap-3 cursor-pointer group">
              <div className="w-4 h-4 border border-brand-dark bg-white group-hover:bg-gray-100" />
              <div className="flex items-center gap-2">
                <div className="flex text-brand-lime">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-3 h-3 ${i < stars ? 'text-brand-lime fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-600">& up</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
