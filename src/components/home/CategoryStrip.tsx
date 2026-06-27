import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Container from '../layout/Container';
import { Category } from '@/types/category';
import Link from 'next/link';

interface CategoryStripProps {
  categories: Category[];
}

export default function CategoryStrip({ categories }: CategoryStripProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full bg-brand-white border-b border-brand-dark py-2 flex items-center">
      <Container className="w-full flex items-center relative px-12">
        <button className="absolute left-4 w-8 h-8 rounded-full border border-brand-dark bg-brand-lime flex items-center justify-center hover:bg-yellow-400 transition-colors z-10">
          <ChevronLeft size={16} />
        </button>
        
        <div className="flex-1 flex justify-between items-center overflow-x-auto no-scrollbar gap-8 px-4">
          {categories.map((category) => {
            // @ts-ignore
            const Icon = (category.icon_name && LucideIcons[category.icon_name]) || LucideIcons.Coffee;
            return (
              <Link href={`/categories/${category.slug}`} key={category.id}>
                <div className="flex flex-col items-center justify-center gap-2 cursor-pointer group min-w-max">
                  <div className="w-12 h-12 flex items-center justify-center text-brand-dark group-hover:text-brand-lime transition-colors">
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-dark group-hover:underline decoration-2 underline-offset-4">
                    {category.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <button className="absolute right-4 w-8 h-8 rounded-full border border-brand-dark bg-brand-lime flex items-center justify-center hover:bg-yellow-400 transition-colors z-10">
          <ChevronRight size={16} />
        </button>
      </Container>
    </div>
  );
}
