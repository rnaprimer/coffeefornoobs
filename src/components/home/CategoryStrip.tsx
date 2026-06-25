import React from 'react';
import { Coffee, Flame, Droplet, Database, ThermometerSun, Scale, Package, Bean, ChevronLeft, ChevronRight, Archive } from 'lucide-react';
import Container from '../layout/Container';

const categories = [
  { name: 'French Press', icon: Coffee },
  { name: 'Aeropress', icon: Archive },
  { name: 'Moka Pot', icon: Flame },
  { name: 'Pour Over', icon: Droplet },
  { name: 'Grinders', icon: Database },
  { name: 'Kettles', icon: ThermometerSun },
  { name: 'Scales', icon: Scale },
  { name: 'Accessories', icon: Package },
  { name: 'Coffee Beans', icon: Bean },
];

export default function CategoryStrip() {
  return (
    <div className="w-full bg-brand-white border-b-4 border-brand-dark py-4 flex items-center">
      <Container className="w-full flex items-center relative px-12">
        <button className="absolute left-4 w-8 h-8 rounded-full border-2 border-brand-dark bg-brand-lime flex items-center justify-center hover:bg-yellow-400 transition-colors z-10">
          <ChevronLeft size={16} />
        </button>
        
        <div className="flex-1 flex justify-between items-center overflow-x-auto no-scrollbar gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div 
                key={index} 
                className="flex flex-col items-center justify-center gap-2 cursor-pointer group min-w-max"
              >
                <div className="w-12 h-12 flex items-center justify-center text-brand-dark group-hover:text-brand-lime transition-colors">
                  <Icon size={32} strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-dark group-hover:underline decoration-2 underline-offset-4">
                  {category.name}
                </span>
              </div>
            );
          })}
        </div>

        <button className="absolute right-4 w-8 h-8 rounded-full border-2 border-brand-dark bg-brand-lime flex items-center justify-center hover:bg-yellow-400 transition-colors z-10">
          <ChevronRight size={16} />
        </button>
      </Container>
    </div>
  );
}
