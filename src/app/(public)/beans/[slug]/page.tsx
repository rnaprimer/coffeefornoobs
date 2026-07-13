import React from 'react';
import { notFound } from 'next/navigation';
import { getBeans, getBeanBySlug } from '../../../../lib/queries/beans';
import Container from '../../../../components/layout/Container';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { constructMetadata } from '../../../../lib/seo';
import { WishlistButton } from '@/components/wishlist/WishlistButton';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const bean = await getBeanBySlug(slug);
  if (!bean) return {};

  return constructMetadata({
    title: `${bean.name} by ${bean.brand}`,
    description: `Origin: ${bean.origin} | Process: ${bean.process} | Roast Level: ${bean.roastLevel}`,
    url: `https://coffeefornoobs.com/beans/${slug}`
  });
}



export default async function BeanDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const bean = await getBeanBySlug(slug);

  if (!bean) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-brand-white pb-20 pt-12">
      <Container>
        <div className="mb-8 text-brand-dark font-bold uppercase text-sm">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/beans" className="hover:underline">Beans</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-lime bg-brand-dark px-2 py-1">{bean.name}</span>
        </div>

        <div className="border-4 border-brand-dark bg-brand-lime shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] mb-12 flex flex-col md:flex-row overflow-hidden">
          <div className="md:w-1/2 p-12 bg-brand-dark flex items-center justify-center relative min-h-[300px]">
            {bean.imageUrl ? (
              <div className="absolute inset-0">
                <Image src={bean.imageUrl} alt={bean.name} fill className="object-cover opacity-80" />
                <div className="absolute inset-0 bg-brand-dark/20 mix-blend-multiply" />
              </div>
            ) : (
              <span className="font-black text-3xl uppercase tracking-widest text-brand-white relative z-10">{bean.imageText}</span>
            )}
          </div>
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-brand-white border-l-4 border-brand-dark">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-4xl md:text-5xl font-black uppercase text-brand-dark">{bean.name}</h1>
              <WishlistButton entityType="bean" entityId={bean.id} />
            </div>
            <p className="text-2xl font-bold text-brand-dark mb-6">by {bean.brand}</p>
            <div className="bg-brand-dark text-brand-pink font-black px-4 py-2 text-xl inline-block self-start mb-8">₹{bean.price}</div>
            
            <div className="space-y-4 mb-8">
              <div className="flex border-b-2 border-brand-dark pb-2">
                <span className="font-bold text-brand-dark w-1/3">Origin</span>
                <span className="font-medium text-brand-dark w-2/3">{bean.origin}</span>
              </div>
              <div className="flex border-b-2 border-brand-dark pb-2">
                <span className="font-bold text-brand-dark w-1/3">Process</span>
                <span className="font-medium text-brand-dark w-2/3">{bean.process}</span>
              </div>
              <div className="flex border-b-2 border-brand-dark pb-2">
                <span className="font-bold text-brand-dark w-1/3">Roast Level</span>
                <span className="font-medium text-brand-dark w-2/3">{bean.roastLevel}</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-black uppercase text-brand-dark mb-2">Tasting Notes</h3>
              <div className="flex flex-wrap gap-2">
                {bean.tastingNotes.map((note) => (
                  <span key={note} className="px-3 py-1 bg-brand-pink border-2 border-brand-dark font-bold text-sm uppercase">
                    {note}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

