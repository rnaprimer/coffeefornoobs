import React from 'react';
import Button from '../ui/Button';
import { HomepageSection } from '@/types/homepage';
import Link from 'next/link';
import Image from 'next/image';

interface SetupBuilderProps {
  section: HomepageSection;
}

export default function SetupBuilder({ section }: SetupBuilderProps) {
  return (
    <section className="bg-brand-lime text-brand-dark w-full lg:w-[320px] xl:w-[400px] border-l-0 lg:border-l border-brand-dark p-8 lg:p-10 shrink-0 relative overflow-hidden flex flex-col">
      <div className="z-10 flex-1">
        <h2 className="text-3xl font-black uppercase tracking-tight leading-[0.9] mb-4 whitespace-pre-line">
          {section.title || 'Coffee Setup\nBuilder'}
        </h2>
        <p className="text-sm font-medium mb-8 max-w-[220px]">
          {section.description || "Answer a few questions and we'll build the perfect setup for you."}
        </p>
        
        {section.button_text && (
          <Link href={section.button_url || '#'}>
            <Button variant="dark" className="text-xs px-4 py-2">
              {section.button_text}
            </Button>
          </Link>
        )}
      </div>

      <div className="absolute right-[-40px] bottom-[-20px] w-48 h-56 bg-brand-lime border border-brand-dark rounded-lg rotate-[-5deg] z-0 flex items-center justify-center p-4 text-center overflow-hidden">
        {section.media?.url ? (
           <Image src={section.media.url} alt={section.title || ''} fill className="object-cover" />
        ) : (
          <p className="font-bold text-xs opacity-50">Setup<br/>Placeholder</p>
        )}
      </div>
    </section>
  );
}
