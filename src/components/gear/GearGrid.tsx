import React from 'react';
import { Product } from '../../types/product';
import ProductCard from '../ui/ProductCard';

interface GearGridProps {
  products: Product[];
}

export default function GearGrid({ products }: GearGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          slug={product.slug}
          name={product.name}
          price={product.price}
          rating={product.rating}
          reviews={product.reviews}
          badge={product.badge}
          imageText={product.imageText}
        />
      ))}
    </div>
  );
}
