import React from 'react';
import Link from 'next/link';
import { Search, LogIn } from 'lucide-react';
import Container from './Container';
import GlobalSearch from '@/components/search/GlobalSearch';
import { createClient } from '@/lib/supabase/server';
import { UserDropdown } from '@/components/shared/UserDropdown';

export default async function Navbar() {
  const supabase = await createClient();
  let user = null;
  let profile = null;

  if (supabase) {
    const { data } = await supabase.auth.getUser();
    user = data.user;
    if (user) {
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      profile = profileData as any;
    }
  }

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
          {user ? (
            <UserDropdown user={user} profile={profile} />
          ) : (
            <Link 
              href="/login"
              className="flex items-center justify-center px-4 h-10 bg-brand-lime border border-brand-dark rounded-full hover:bg-yellow-400 transition-colors shrink-0 font-bold text-sm uppercase tracking-wider"
            >
              <LogIn size={16} className="mr-2" />
              Login
            </Link>
          )}
        </div>
      </Container>
    </nav>
  );
}
