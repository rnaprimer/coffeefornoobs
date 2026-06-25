import React from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

export default function GearSection() {
  return (
    <section className="bg-brand-pink flex-1 lg:w-1/2 p-8 lg:p-12 relative overflow-hidden flex flex-col justify-center border-b-4 lg:border-b-0 border-brand-dark">
      <div className="max-w-md z-10">
        <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-6">
          The Right<br />Gear.<br />Zero<br />Guesswork.
        </h2>
        <p className="text-lg font-medium mb-8 leading-relaxed max-w-sm">
          Handpicked gear that's beginner friendly and budget smart.
        </p>
        
        <Button variant="secondary" icon={ArrowRight} className="bg-brand-pink hover:bg-brand-white">
          Browse All Gear
        </Button>
      </div>

      {/* Tilted placeholder illustration */}
      <div className="hidden xl:flex absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 w-[280px] h-[320px] bg-brand-white border-4 border-brand-dark rotate-2 shadow-[6px_6px_0px_#111111] items-center justify-center text-center p-4 z-0">
        <p className="font-bold">Black Kettle<br/>Placeholder</p>
      </div>
    </section>
  );
}
