export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  badge?: string;
  imageText: string;
  description: string;
  pros: string[];
  cons: string[];
  specs: Record<string, string>;
  relatedProducts: string[]; // array of product slugs
  guideSlugs: string[]; // array of guide slugs
  categoryId: string;
}
