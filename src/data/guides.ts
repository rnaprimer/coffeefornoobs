import { Guide } from '../types/guide';

export const guides: Guide[] = [
  {
    id: 'g1',
    slug: 'how-to-make-coffee-in-a-french-press',
    title: 'How to Make Coffee in a French Press',
    coverImageText: 'French Press Brew',
    author: 'CoffeeForNoobs Team',
    readingTime: '5 min read',
    content: 'The French Press is one of the easiest and most forgiving brewing methods. It produces a full-bodied, rich cup of coffee. Step 1: Coarsely grind your coffee. Step 2: Add water just off the boil. Step 3: Wait 4 minutes. Step 4: Plunge and enjoy.',
    featuredProducts: ['timemore-c2'],
    relatedGuides: ['aeropress-guide-for-beginners'],
    categoryId: 'french-press'
  },
  {
    id: 'g2',
    slug: 'aeropress-guide-for-beginners',
    title: 'Aeropress Guide for Beginners',
    coverImageText: 'Aeropress Plunge',
    author: 'CoffeeForNoobs Team',
    readingTime: '6 min read',
    content: 'The Aeropress is a versatile brewer. Use the inverted method for more control over steep time. Add coffee, add water, stir, steep for 2 minutes, flip, and plunge.',
    featuredProducts: ['aeropress-original', 'timemore-c2'],
    relatedGuides: ['how-to-make-coffee-in-a-french-press'],
    categoryId: 'aeropress'
  },
  {
    id: 'g3',
    slug: 'best-grinders-under-5000',
    title: 'Best Coffee Grinders Under ₹5,000',
    coverImageText: 'Hand Grinders',
    author: 'CoffeeForNoobs Team',
    readingTime: '8 min read',
    content: 'A good grinder is the most important piece of coffee gear. We test the best budget hand grinders available in India, including the Timemore C2 and Kingrinder P1.',
    featuredProducts: ['timemore-c2'],
    relatedGuides: ['how-to-make-coffee-in-a-french-press'],
    categoryId: 'grinders'
  }
];
