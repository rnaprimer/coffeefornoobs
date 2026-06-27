import React from 'react';
import { ArrowRight } from 'lucide-react';
import BeanCard from '../ui/BeanCard';
import { Bean } from '@/types/bean';
import { HomepageSection } from '@/types/homepage';

interface BestBeansProps {
  section: HomepageSection;
  beans: Bean[];
}

export default function BestBeans({ section, beans = [] }: BestBeansProps) {
  // Display only first 3 beans
  const displayBeans = beans.slice(0, 3);

  return (
    <section className="bg-brand-pink p-8 lg:p-12 w-full lg:w-[400px] shrink-0 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-black uppercase tracking-tight">{section.title || 'Best Coffee Beans'}</h2>
        <a href={section.button_url || "/beans"} className="text-[10px] font-bold uppercase tracking-widest flex items-center hover:text-white transition-colors">
          {section.button_text || 'View All'} <ArrowRight size={12} className="ml-1" />
        </a>
      </div>
      
      <div className="flex flex-col gap-6 flex-1">
        {displayBeans.map((bean) => (
          <BeanCard key={bean.id} {...bean} />
        ))}
      </div>
    </section>
  );
}

