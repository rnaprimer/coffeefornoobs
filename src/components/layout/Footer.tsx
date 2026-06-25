import React from 'react';
import Link from 'next/link';
import Container from './Container';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-white py-6 border-t-[4px] border-black">
      <Container className="flex flex-col md:flex-row justify-between items-center text-xs font-bold uppercase tracking-widest">
        <p>© 2024 COFFEEFORNOOBS. ALL RIGHTS RESERVED.</p>
        <p className="text-brand-lime mt-4 md:mt-0">BREW BETTER. STAY CURIOUS. ☕</p>
      </Container>
    </footer>
  );
}
