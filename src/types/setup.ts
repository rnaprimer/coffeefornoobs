export interface Setup {
  id: string;
  slug: string;
  name: string;
  budget: string;
  description: string;
  products: string[]; // array of product slugs
}
