import React from 'react';
import Link from 'next/link';
import { Search, ShoppingCart } from 'lucide-react';
import Container from './Container';

export default function Navbar() {
  return (
    <nav className="w-full bg-brand-white brutal-border-b h-16 flex items-center sticky top-0 z-50">
      <Container className="w-full flex items-center justify-between">
        <Link href="/" className="font-black text-2xl uppercase tracking-tight">
          Coffee<br/><span className="text-xl leading-none block -mt-1">For Noobs</span>
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
          <div className="hidden lg:flex items-center border-2 border-brand-dark rounded-full px-4 py-1.5 bg-gray-50">
            <Search size={16} className="text-gray-500 mr-2" />
            <input 
              type="text" 
              placeholder="Search guides, gear, and coffee..." 
              className="bg-transparent border-none outline-none text-sm w-48 font-medium"
            />
          </div>
          <button className="flex items-center font-bold text-sm bg-brand-lime brutal-border rounded-full px-4 py-1.5 brutal-shadow hover:brutal-shadow-hover">
            <span className="mr-2">57</span>
            <ShoppingCart size={18} className="mr-1" />
            CART <span className="ml-1 px-1.5 py-0.5 bg-brand-dark text-brand-white rounded-full text-xs">2</span>
          </button>
        </div>
      </Container>
    </nav>
  );
}
