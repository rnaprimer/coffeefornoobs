import React from 'react';
import Link from 'next/link';
import { Search, ShoppingCart } from 'lucide-react';
import Container from './Container';
import GlobalSearch from '@/components/search/GlobalSearch';

export default function Navbar() {
  return (
    <nav className="w-full bg-brand-white brutal-border-b h-16 flex items-center sticky top-0 z-50">
      <Container className="w-full flex items-center justify-between">
        <Link href="/" className="font-black text-2xl uppercase tracking-tighter leading-none">
          COFFEE<br/><span className="block">FOR NOOBS</span>
        </Link>
        
        <div className="hidden md:flex space-x-6 text-sm font-bold uppercase tracking-wider">
          <Link href="/" className="hover:underline underline-offset-4 decoration-2">Home</Link>
          <Link href="/gear" className="hover:underline underline-offset-4 decoration-2">Gear</Link>
          <Link href="/guides" className="hover:underline underline-offset-4 decoration-2">Guides</Link>
          <Link href="/beans" className="hover:underline underline-offset-4 decoration-2">Beans</Link>
          <Link href="/learn" className="hover:underline underline-offset-4 decoration-2">Learn</Link>
          <Link href="/comparisons" className="hover:underline underline-offset-4 decoration-2">Comparisons</Link>
        </div>

        <div className="flex items-center space-x-4">
          <GlobalSearch />
          <button className="flex items-center font-bold text-sm bg-brand-lime border border-brand-dark rounded-full px-4 py-1.5 hover:bg-yellow-400 transition-colors">
            <ShoppingCart size={16} className="mr-2" />
            CART <span className="ml-2 px-2 py-0.5 bg-brand-dark text-brand-white rounded-full text-[10px]">2</span>
          </button>
        </div>
      </Container>
    </nav>
  );
}
