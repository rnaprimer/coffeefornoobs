import React from 'react';
import Container from '../../../components/layout/Container';
import PageHeader from '../../../components/shared/PageHeader';
import BeanGrid from '../../../components/beans/BeanGrid';
import { beans } from '../../../data/beans';
import { roasters } from '../../../data/roasters';

export default function BeansPage() {
  return (
    <div className="min-h-screen bg-brand-white pb-20">
      <PageHeader 
        title="Coffee Beans" 
        description="Discover the best specialty coffee beans roasted in India." 
      />
      <Container>
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <span className="font-bold text-brand-dark">Roaster:</span>
            <button className="px-4 py-2 font-bold uppercase bg-brand-lime border-2 border-brand-dark shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
              All Roasters
            </button>
            {roasters.map((roaster) => (
              <button key={roaster.id} className="px-4 py-2 font-bold uppercase bg-brand-white border-2 border-brand-dark shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:bg-brand-pink transition-colors">
                {roaster.name}
              </button>
            ))}
          </div>
        </div>

        <BeanGrid beans={beans} />
      </Container>
    </div>
  );
}
