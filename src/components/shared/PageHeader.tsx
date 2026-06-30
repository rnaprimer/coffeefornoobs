import React from 'react';
import Container from '../layout/Container';

interface PageHeaderProps {
  title: string;
  description?: string;
  illustrationSrc?: string;
}

export default function PageHeader({ title, description, illustrationSrc }: PageHeaderProps) {
  return (
    <div className="bg-brand-pink border-b border-brand-dark">
      <Container className="flex flex-col md:flex-row items-center justify-between py-12 md:py-24 relative overflow-hidden">
        <div className="z-10 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-brand-dark mb-4 leading-[0.9]">
            {title}
          </h1>
          {description && (
            <p className="text-lg md:text-xl font-medium text-brand-dark max-w-md">
              {description}
            </p>
          )}
        </div>
        {illustrationSrc && (
          <div className="mt-8 md:mt-0 md:absolute md:right-0 md:-bottom-8 md:h-[120%] flex items-end">
            <img 
              src={illustrationSrc} 
              alt="Illustration" 
              className="h-64 md:h-full object-contain object-bottom max-w-[300px] md:max-w-[450px]" 
            />
          </div>
        )}
      </Container>
    </div>
  );
}
