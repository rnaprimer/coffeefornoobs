import { Setup } from '../types/setup';

export const setups: Setup[] = [
  {
    id: 's1',
    slug: '2000-setup',
    name: '₹2,000 Setup',
    budget: '₹2,000',
    description: 'The absolute bare minimum to start making decent coffee at home. We focus on the brewer and skip the scale and gooseneck kettle.',
    products: ['french-press', 'pre-ground-coffee']
  },
  {
    id: 's2',
    slug: '5000-setup',
    name: '₹5,000 Setup',
    budget: '₹5,000',
    description: 'The sweet spot for beginners. You get a solid hand grinder and a versatile brewer.',
    products: ['timemore-c2', 'aeropress-original', 'cheap-scale']
  },
  {
    id: 's3',
    slug: '10000-setup',
    name: '₹10,000 Setup',
    budget: '₹10,000',
    description: 'A great pour-over setup. We upgrade to a gooseneck kettle and a high-quality hand grinder.',
    products: ['hario-v60', 'timemore-c2', 'gooseneck-kettle', 'coffee-scale']
  }
];
