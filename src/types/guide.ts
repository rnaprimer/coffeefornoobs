export interface Guide {
  id: string;
  slug: string;
  title: string;
  coverImageText: string;
  author: string;
  readingTime: string;
  content: string;
  featuredProducts: string[]; // array of product slugs
  relatedGuides: string[]; // array of guide slugs
  categoryId: string;
}
