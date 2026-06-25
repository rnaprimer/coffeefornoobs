export interface Bean {
  id: string;
  slug: string;
  brand: string;
  roasterSlug: string;
  name: string;
  price: number;
  origin: string;
  process: string;
  roastLevel: string;
  tastingNotes: string[];
  brewingRecommendations: string[];
  relatedBeans: string[]; // array of bean slugs
  imageText: string;
}
