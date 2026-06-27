import React from 'react';
import Container from '../../../components/layout/Container';
import PageHeader from '../../../components/shared/PageHeader';
import GearFilters from '../../../components/gear/GearFilters';
import GearGrid from '../../../components/gear/GearGrid';
import { getProducts, getCategories } from '../../../lib/queries/products';

export default async function GearPage() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-brand-white pb-20">
      <PageHeader 
        title="Coffee Gear" 
        description="The best coffee equipment, reviewed and recommended for beginners." 
      />
      <Container>
        <GearFilters categories={categories} activeCategory="all" />
        <GearGrid products={products} />
      </Container>
    </div>
  );
}

