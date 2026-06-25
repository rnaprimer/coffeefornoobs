import React from 'react';
import Container from '../layout/Container';

interface PageHeaderProps {
  title: string;
  description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="bg-brand-pink py-16 border-b-4 border-brand-dark mb-12">
      <Container>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-brand-dark mb-4">
          {title}
        </h1>
        {description && (
          <p className="text-xl md:text-2xl font-bold text-brand-dark max-w-3xl">
            {description}
          </p>
        )}
      </Container>
    </div>
  );
}
