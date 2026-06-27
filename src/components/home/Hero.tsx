import React from 'react';
import { ArrowRight, Search } from 'lucide-react';
import Button from '../ui/Button';
import { HomepageSection } from '@/types/homepage';
import Link from 'next/link';
import Image from 'next/image';

interface HeroProps {
  section: HomepageSection;
}

export default function Hero({ section }: HeroProps) {
  return (
    <section className="w-full flex flex-col lg:flex-row border-b border-brand-dark">
      {/* Left side (Pink) */}
      <div className="bg-brand-pink flex-1 p-8 lg:p-16 relative overflow-hidden flex flex-col justify-center">
        <div className="max-w-xl z-10">
          <p className="font-bold text-sm tracking-widest uppercase mb-4">{section.subtitle || 'Welcome Back, Brewer'}</p>
          
          <h1 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-6 whitespace-pre-line">
            {section.title || 'Coffee\nFor Noobs'}
          </h1>
          
          <p className="text-lg font-medium mb-8 max-w-md leading-relaxed">
            {section.description || 'Honest gear recommendations, easy brewing guides and everything a beginner needs to make amazing coffee.'}
          </p>
          
          <div className="flex flex-wrap gap-4 mb-8">
            {section.button_text && (
              <Link href={section.button_url || '#'}>
                <Button variant="primary" icon={ArrowRight}>{section.button_text}</Button>
              </Link>
            )}
            <Button variant="secondary" className="bg-brand-pink hover:bg-brand-white">Browse Gear</Button>
          </div>

        </div>

        {/* Tilted placeholder illustration */}
        {section.media?.url ? (
          <div className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2 w-[350px] h-[450px] bg-brand-white brutal-border rotate-3 shadow-[8px_8px_0px_#111111] items-center justify-center text-center p-4 z-0">
             <Image src={section.media.url} alt={section.title || ''} fill className="object-cover" />
          </div>
        ) : (
          <div className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2 w-[350px] h-[450px] bg-brand-white brutal-border rotate-3 shadow-[8px_8px_0px_#111111] items-center justify-center text-center p-4 z-0">
            <p className="font-bold">Walking Guy<br/>Illustration Placeholder</p>
          </div>
        )}
      </div>

      {/* Right side (Beginner Setups) */}
      <div className="w-full lg:w-[400px] bg-brand-white flex flex-col border-l-0 lg:border-l border-brand-dark shrink-0">
        <div className="p-6 border-b border-brand-dark bg-brand-white">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Beginner<br/>Setups</h2>
          <p className="text-sm font-medium">Curated setups for every budget.</p>
        </div>
        
        <div className="flex flex-col flex-1">
          {/* Setup 1 */}
          <div className="p-6 border-b border-brand-dark bg-brand-white hover:bg-gray-50 cursor-pointer flex flex-col group flex-1 justify-center">
            <h3 className="font-bold text-lg mb-4">₹2,000 SETUP</h3>
            <div className="flex items-end justify-between">
              <div className="flex items-end gap-2">
                <div className="w-8 h-16 border-2 border-brand-dark bg-gray-100 group-hover:bg-brand-pink transition-colors"></div>
                <div className="w-10 h-12 border-2 border-brand-dark bg-gray-100 group-hover:bg-brand-pink transition-colors"></div>
                <div className="w-6 h-10 border-2 border-brand-dark bg-gray-100 group-hover:bg-brand-pink transition-colors"></div>
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-brand-dark flex items-center justify-center group-hover:bg-brand-lime transition-colors">
                <ArrowRight size={16} />
              </div>
            </div>
          </div>
          
          {/* Setup 2 */}
          <div className="p-6 border-b border-brand-dark bg-brand-white hover:bg-gray-50 cursor-pointer flex flex-col group flex-1 justify-center">
            <h3 className="font-bold text-lg mb-4">₹5,000 SETUP</h3>
            <div className="flex items-end justify-between">
              <div className="flex items-end gap-2">
                <div className="w-10 h-20 border-2 border-brand-dark bg-gray-100 group-hover:bg-brand-pink transition-colors"></div>
                <div className="w-12 h-14 border-2 border-brand-dark bg-gray-100 group-hover:bg-brand-pink transition-colors"></div>
                <div className="w-16 h-8 border-2 border-brand-dark bg-gray-100 group-hover:bg-brand-pink transition-colors"></div>
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-brand-dark flex items-center justify-center group-hover:bg-brand-lime transition-colors">
                <ArrowRight size={16} />
              </div>
            </div>
          </div>

          {/* Setup 3 */}
          <div className="p-6 border-b border-brand-dark bg-brand-white hover:bg-gray-50 cursor-pointer flex flex-col group flex-1 justify-center">
            <h3 className="font-bold text-lg mb-4">₹10,000 SETUP</h3>
            <div className="flex items-end justify-between">
              <div className="flex items-end gap-2">
                <div className="w-12 h-16 border-2 border-brand-dark bg-gray-100 group-hover:bg-brand-pink transition-colors"></div>
                <div className="w-10 h-24 border-2 border-brand-dark bg-gray-100 group-hover:bg-brand-pink transition-colors"></div>
                <div className="w-12 h-12 border-2 border-brand-dark bg-gray-100 group-hover:bg-brand-pink transition-colors"></div>
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-brand-dark flex items-center justify-center group-hover:bg-brand-lime transition-colors">
                <ArrowRight size={16} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-brand-lime flex items-center justify-center font-bold text-sm uppercase cursor-pointer hover:bg-yellow-400 transition-colors">
            View All Setups <ArrowRight size={16} className="ml-2" />
          </div>
        </div>
      </div>
    </section>
  );
}
