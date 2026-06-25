import React from 'react';
import Container from '../../../components/layout/Container';
import PageHeader from '../../../components/shared/PageHeader';

export default function SetupBuilderPage() {
  return (
    <div className="min-h-screen bg-brand-white pb-20">
      <PageHeader 
        title="Setup Builder" 
        description="Find the perfect coffee gear for your budget and lifestyle." 
      />
      <Container>
        <div className="max-w-2xl mx-auto border-4 border-brand-dark p-8 bg-brand-white shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-brand-dark uppercase">Step 1 of 3</span>
              <div className="h-4 flex-1 mx-4 border-2 border-brand-dark bg-brand-pink">
                <div className="h-full bg-brand-lime border-r-2 border-brand-dark w-1/3"></div>
              </div>
            </div>
            <h2 className="text-3xl font-black uppercase text-brand-dark mb-4">What's your budget?</h2>
            <p className="font-medium text-brand-dark mb-6">Don't worry, we've got great setups for every price range.</p>
          </div>
          
          <div className="space-y-4">
            <button className="w-full p-4 border-2 border-brand-dark text-left font-bold uppercase hover:bg-brand-lime transition-colors">
              Under ₹5,000 (Just the essentials)
            </button>
            <button className="w-full p-4 border-2 border-brand-dark text-left font-bold uppercase bg-brand-lime shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] transition-transform -translate-y-1 translate-x-1">
              ₹5,000 - ₹15,000 (The sweet spot)
            </button>
            <button className="w-full p-4 border-2 border-brand-dark text-left font-bold uppercase hover:bg-brand-lime transition-colors">
              ₹15,000+ (Take my money)
            </button>
          </div>

          <div className="mt-12 flex justify-end">
            <button className="px-8 py-3 bg-brand-dark text-brand-white font-bold uppercase tracking-wide border-2 border-brand-dark hover:bg-brand-pink hover:text-brand-dark transition-colors">
              Next Step &rarr;
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}
