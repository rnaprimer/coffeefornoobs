import React from 'react';
import { Camera, Video, MessageSquare, Mail } from 'lucide-react';
import Container from '../layout/Container';
import Button from '../ui/Button';
import { HomepageSection } from '@/types/homepage';
import Image from 'next/image';

interface NewsletterProps {
  section: HomepageSection;
}

export default function Newsletter({ section }: NewsletterProps) {
  return (
    <section className="bg-brand-pink relative">
      <Container className="flex flex-col lg:flex-row py-16 gap-12 lg:gap-24">
        
        {/* Left: Newsletter Form */}
        <div className="flex-1 max-w-md">
          <h2 className="text-4xl font-black uppercase tracking-tighter leading-[0.9] mb-4 whitespace-pre-line">
            {section.title || 'Good Coffee.\nGood Life.'}
          </h2>
          <p className="text-sm font-medium mb-6">
            {section.description || 'Join 10,000+ beginners learning and brewing better coffee every week.'}
          </p>
          <form className="flex border border-brand-dark bg-brand-white rounded-full overflow-hidden">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-3 outline-none bg-transparent font-medium text-sm"
              required
            />
            <button 
              type="submit" 
              className="bg-brand-lime px-6 py-3 font-bold text-sm uppercase border-l border-brand-dark hover:bg-yellow-400 transition-colors"
            >
              {section.button_text || 'Subscribe'}
            </button>
          </form>
        </div>

        {/* Middle: Links */}
        <div className="flex flex-1 gap-16 lg:justify-center">
          <div className="flex flex-col gap-3">
            <h4 className="font-black text-xs uppercase tracking-widest mb-2">Explore</h4>
            <a href="#" className="text-xs font-bold hover:underline decoration-2">Gear</a>
            <a href="#" className="text-xs font-bold hover:underline decoration-2">Guides</a>
            <a href="#" className="text-xs font-bold hover:underline decoration-2">Beans</a>
            <a href="#" className="text-xs font-bold hover:underline decoration-2">Learn</a>
            <a href="#" className="text-xs font-bold hover:underline decoration-2">Comparisons</a>
            <a href="#" className="text-xs font-bold hover:underline decoration-2">Setup Builder</a>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-black text-xs uppercase tracking-widest mb-2">Help</h4>
            <a href="#" className="text-xs font-bold hover:underline decoration-2">About Us</a>
            <a href="#" className="text-xs font-bold hover:underline decoration-2">Contact</a>
            <a href="#" className="text-xs font-bold hover:underline decoration-2">FAQ</a>
            <a href="#" className="text-xs font-bold hover:underline decoration-2">Shipping</a>
            <a href="#" className="text-xs font-bold hover:underline decoration-2">Returns</a>
            <a href="#" className="text-xs font-bold hover:underline decoration-2">Privacy Policy</a>
            <a href="#" className="text-xs font-bold hover:underline decoration-2">Terms & Conditions</a>
          </div>
        </div>

        {/* Right: Socials & Illustration */}
        <div className="flex flex-col gap-6 items-start lg:items-end">
          <h4 className="font-black text-xs uppercase tracking-widest">Follow Us</h4>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full border border-brand-dark flex items-center justify-center hover:bg-brand-white transition-colors">
              <Camera size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-brand-dark flex items-center justify-center hover:bg-brand-white transition-colors">
              <Video size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-brand-dark flex items-center justify-center hover:bg-brand-white transition-colors">
              <MessageSquare size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-brand-dark flex items-center justify-center hover:bg-brand-white transition-colors">
              <Mail size={18} />
            </a>
          </div>

          <div className="mt-8 w-32 h-40 bg-brand-white border border-brand-dark flex flex-col items-center justify-center text-center p-2 rounded-lg">
            <span className="font-bold text-[10px]">Coffee Pot<br/>Illustration</span>
          </div>
        </div>

      </Container>
    </section>
  );
}
