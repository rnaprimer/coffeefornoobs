import React from 'react';
import Container from '../../../components/layout/Container';
import PageHeader from '../../../components/shared/PageHeader';

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-brand-white pb-20">
      <PageHeader 
        title="Learn" 
        description="Your curriculum for coffee mastery." 
      />
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border-4 border-brand-dark p-8 bg-brand-lime shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
            <h2 className="text-3xl font-black uppercase text-brand-dark mb-4">Coffee Basics</h2>
            <p className="font-medium text-brand-dark mb-6">Learn about beans, processing methods, and how freshness affects your cup.</p>
            <ul className="space-y-4 font-bold text-brand-dark underline">
              <li><a href="#">What is Specialty Coffee?</a></li>
              <li><a href="#">Understanding Roast Levels</a></li>
              <li><a href="#">Why Grind Fresh?</a></li>
            </ul>
          </div>
          <div className="border-4 border-brand-dark p-8 bg-brand-pink shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
            <h2 className="text-3xl font-black uppercase text-brand-dark mb-4">Brewing Methods</h2>
            <p className="font-medium text-brand-dark mb-6">Master the techniques for different brewers.</p>
            <ul className="space-y-4 font-bold text-brand-dark underline">
              <li><a href="/guides/how-to-make-coffee-in-a-french-press">French Press Mastery</a></li>
              <li><a href="/guides/aeropress-guide-for-beginners">Aeropress for Beginners</a></li>
              <li><a href="#">Pour Over Fundamentals</a></li>
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
}
