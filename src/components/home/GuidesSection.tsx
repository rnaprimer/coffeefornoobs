import React from 'react';
import { ArrowRight } from 'lucide-react';

const guides = [
  { id: 'FP', title: 'How to Make Coffee in a French Press' },
  { id: 'AP', title: 'Aeropress Guide for Beginners' },
  { id: 'MP', title: 'Moka Pot Brewing (With Tips)' },
];

export default function GuidesSection() {
  return (
    <section className="bg-brand-dark text-brand-white w-full lg:w-[320px] xl:w-[400px] border-l-0 lg:border-l-4 border-b-4 lg:border-b-0 border-brand-dark p-8 lg:p-10 shrink-0 flex flex-col">
      <h2 className="text-2xl font-black uppercase tracking-tight mb-8">
        Popular Guides <span className="text-brand-lime">/</span>
      </h2>
      
      <div className="flex flex-col gap-6 flex-1">
        {guides.map((guide, idx) => (
          <div key={idx} className="flex items-start gap-4 group cursor-pointer">
            <div className="w-12 h-12 shrink-0 border-2 border-gray-600 bg-gray-800 flex items-center justify-center font-bold group-hover:border-brand-lime group-hover:text-brand-lime transition-colors">
              {guide.id}
            </div>
            <div className="flex flex-col pt-1">
              <h3 className="font-bold text-sm leading-tight mb-2 group-hover:text-brand-lime transition-colors">{guide.title}</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center group-hover:text-brand-white transition-colors">
                Read Guide <ArrowRight size={12} className="ml-1" />
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t-2 border-gray-800">
        <a href="/guides" className="text-[10px] font-bold uppercase tracking-widest text-brand-lime flex items-center hover:text-white transition-colors">
          View All Guides <ArrowRight size={12} className="ml-2" />
        </a>
      </div>
    </section>
  );
}
