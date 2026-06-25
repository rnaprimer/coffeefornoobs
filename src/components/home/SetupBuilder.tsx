import React from 'react';
import Button from '../ui/Button';

export default function SetupBuilder() {
  return (
    <section className="bg-brand-lime text-brand-dark w-full lg:w-[320px] xl:w-[400px] border-l-0 lg:border-l-4 border-brand-dark p-8 lg:p-10 shrink-0 relative overflow-hidden flex flex-col">
      <div className="z-10 flex-1">
        <h2 className="text-3xl font-black uppercase tracking-tight leading-[0.9] mb-4">
          Coffee Setup<br/>Builder
        </h2>
        <p className="text-sm font-medium mb-8 max-w-[220px]">
          Answer a few questions and we'll build the perfect setup for you.
        </p>
        
        <Button variant="dark" className="text-xs px-4 py-2">
          Build My Setup
        </Button>
      </div>

      <div className="absolute right-[-40px] bottom-[-20px] w-48 h-56 bg-brand-lime border-4 border-brand-dark shadow-[4px_4px_0px_#111111] rounded-lg rotate-[-5deg] z-0 flex items-center justify-center p-4 text-center">
        <p className="font-bold text-xs opacity-50">Setup<br/>Placeholder</p>
      </div>
    </section>
  );
}
