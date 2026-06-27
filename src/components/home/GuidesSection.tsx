import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Guide } from '@/types/guide';
import { HomepageSection } from '@/types/homepage';
import Image from 'next/image';

interface GuidesSectionProps {
  section: HomepageSection;
  guides: Guide[];
}

export default function GuidesSection({ section, guides = [] }: GuidesSectionProps) {
  // Use first 3 guides if not limited
  const displayGuides = guides.slice(0, 3);

  return (
    <section className="bg-brand-dark text-brand-white w-full lg:w-[320px] xl:w-[400px] border-l-0 lg:border-l border-b lg:border-b-0 border-brand-dark p-8 lg:p-10 shrink-0 flex flex-col">
      <h2 className="text-2xl font-black uppercase tracking-tight mb-8">
        {section.title || 'Popular Guides'} <span className="text-brand-lime">/</span>
      </h2>
      
      <div className="flex flex-col gap-6 flex-1">
        {displayGuides.map((guide, idx) => (
          <a key={guide.id || idx} href={`/guides/${guide.slug}`} className="flex items-start gap-4 group cursor-pointer">
            <div className="w-12 h-12 shrink-0 border border-gray-600 bg-gray-800 flex items-center justify-center font-bold group-hover:border-brand-lime group-hover:text-brand-lime transition-colors relative overflow-hidden">
              {(guide as any).featured_media?.url ? (
                 <Image src={(guide as any).featured_media.url} alt={guide.title} fill className="object-cover" />
              ) : (
                <>{(guide.title)?.substring(0, 2).toUpperCase() || 'GD'}</>
              )}
            </div>
            <div className="flex flex-col pt-1">
              <h3 className="font-bold text-sm leading-tight mb-2 group-hover:text-brand-lime transition-colors">{guide.title}</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center group-hover:text-brand-white transition-colors">
                Read Guide <ArrowRight size={12} className="ml-1" />
              </p>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-800">
        <a href={section.button_url || "/guides"} className="text-[10px] font-bold uppercase tracking-widest text-brand-lime flex items-center hover:text-white transition-colors">
          {section.button_text || 'View All Guides'} <ArrowRight size={12} className="ml-2" />
        </a>
      </div>
    </section>
  );
}

