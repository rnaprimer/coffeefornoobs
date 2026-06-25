import { Bean } from '../types/bean';

export const beans: Bean[] = [
  {
    id: 'b1',
    slug: 'attikan-estate',
    brand: 'Blue Tokai',
    roasterSlug: 'blue-tokai',
    name: 'Attikan Estate',
    price: 499,
    origin: 'Biligirirangan Hills, Karnataka',
    process: 'Washed',
    roastLevel: 'Medium Dark',
    tastingNotes: ['Dark Chocolate', 'Figs', 'Roasted Nuts'],
    brewingRecommendations: ['French Press', 'Moka Pot', 'Espresso'],
    relatedBeans: ['house-blend'],
    imageText: 'Attikan Estate Bag'
  },
  {
    id: 'b2',
    slug: 'house-blend',
    brand: 'Subko',
    roasterSlug: 'subko',
    name: 'House Blend',
    price: 650,
    origin: 'Various Estates, India',
    process: 'Washed / Natural Blend',
    roastLevel: 'Medium',
    tastingNotes: ['Milk Chocolate', 'Caramel', 'Orange Zest'],
    brewingRecommendations: ['Pour Over', 'Aeropress'],
    relatedBeans: ['attikan-estate'],
    imageText: 'Subko House Blend'
  },
  {
    id: 'b3',
    slug: 'classic-espresso',
    brand: 'Third Wave',
    roasterSlug: 'third-wave',
    name: 'Classic Espresso',
    price: 499,
    origin: 'Chikmagalur',
    process: 'Washed',
    roastLevel: 'Dark',
    tastingNotes: ['Cocoa', 'Walnut', 'Molasses'],
    brewingRecommendations: ['Espresso', 'Moka Pot'],
    relatedBeans: ['attikan-estate'],
    imageText: 'Classic Espresso Bag'
  }
];

export const bestBeans = beans;
