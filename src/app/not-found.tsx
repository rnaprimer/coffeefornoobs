import React from 'react';
import Link from 'next/link';
import Container from '../components/layout/Container';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-white flex items-center justify-center py-20">
      <Container>
        <div className="max-w-2xl mx-auto text-center border-4 border-brand-dark p-12 bg-brand-lime shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]">
          <h1 className="text-8xl font-black uppercase text-brand-dark mb-6">404</h1>
          <h2 className="text-3xl font-black uppercase text-brand-dark mb-6">Page Not Found</h2>
          <p className="text-xl text-brand-dark font-medium mb-8">
            Looks like you've tried to brew something that doesn't exist. Let's get you back to the good stuff.
          </p>
          <Link href="/" className="inline-block px-8 py-4 bg-brand-dark text-brand-white font-black uppercase tracking-widest border-4 border-brand-dark hover:bg-brand-pink hover:text-brand-dark transition-colors">
            Go Home
          </Link>
        </div>
      </Container>
    </div>
  );
}
