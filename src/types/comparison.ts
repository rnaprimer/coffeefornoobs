export interface Comparison {
  id: string;
  slug: string;
  title: string;
  productA: string; // product slug
  productB: string; // product slug
  description: string;
  winner: string; // product slug
  recommendation: string;
}
