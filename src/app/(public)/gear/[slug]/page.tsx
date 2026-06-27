import React from 'react';
import { notFound } from 'next/navigation';
import { getProducts, getProductBySlug } from '../../../../lib/queries/products';
import Container from '../../../../components/layout/Container';
import ProductHero from '../../../../components/gear/ProductHero';
import ProductProsCons from '../../../../components/gear/ProductProsCons';
import ProductSpecs from '../../../../components/gear/ProductSpecs';
import Link from 'next/link';
import { Metadata } from 'next';
import { constructMetadata } from '../../../../lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return constructMetadata({
    title: product.name,
    description: product.description,
    url: `https://coffeefornoobs.com/gear/${slug}`
  });
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-brand-white pb-20 pt-12">
      <Container>
        <div className="mb-8 text-brand-dark font-bold uppercase text-sm">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/gear" className="hover:underline">Gear</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-lime bg-brand-dark px-2 py-1">{product.name}</span>
        </div>

        <ProductHero product={product} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-black uppercase text-brand-dark mb-6">Our Review</h2>
            <div className="text-lg mb-12 text-brand-dark font-medium leading-relaxed">
              <p className="mb-4">{product.description}</p>
              <p>This is where the extended static content review for {product.name} would go. It models the future CMS rich text content.</p>
            </div>
            
            <ProductProsCons pros={product.pros} cons={product.cons} />
          </div>
          
          <div className="lg:col-span-1">
            <ProductSpecs specs={product.specs} />
          </div>
        </div>
      </Container>
    </div>
  );
}

