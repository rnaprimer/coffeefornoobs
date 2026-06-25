import { Product } from '../types/product';

export const products: Product[] = [
  {
    id: 'p1',
    slug: 'timemore-c2',
    name: 'Timemore C2 Hand Grinder',
    price: 4799,
    rating: 4.8,
    reviews: 120,
    badge: 'BEST SELLER',
    imageText: 'Grinder',
    description: 'An excellent entry-level manual grinder with stainless steel burrs, offering consistent grinds for pour-over and Aeropress.',
    pros: ['Great value for money', 'Consistent grind distribution', 'Fast grinding speed'],
    cons: ['Not suitable for espresso', 'Small capacity (25g)'],
    specs: {
      'Burr Type': '38mm Conical Steel',
      'Capacity': '25g',
      'Weight': '430g',
      'Material': 'Aluminum Alloy'
    },
    relatedProducts: ['hario-v60', 'aeropress-original'],
    guideSlugs: ['best-grinders-under-5000'],
    categoryId: 'grinders'
  },
  {
    id: 'p2',
    slug: 'hario-v60',
    name: 'Hario V60 Pour Over Kit',
    price: 2199,
    rating: 4.7,
    reviews: 98,
    badge: '',
    imageText: 'V60',
    description: 'The iconic pour-over brewer. This kit includes everything you need to start brewing clean, complex cups of coffee.',
    pros: ['Inexpensive', 'Clean cup profile', 'Easy to clean'],
    cons: ['Requires gooseneck kettle', 'Steep learning curve'],
    specs: {
      'Material': 'Plastic/Glass',
      'Filters': 'Paper (Size 02)',
      'Capacity': '1-4 Cups'
    },
    relatedProducts: ['timemore-c2'],
    guideSlugs: ['pour-over-guide'],
    categoryId: 'pour-over'
  },
  {
    id: 'p3',
    slug: 'aeropress-original',
    name: 'AeroPress Original',
    price: 3299,
    rating: 4.9,
    reviews: 215,
    badge: '',
    imageText: 'Aeropress',
    description: 'A versatile, travel-friendly brewer that uses pressure to extract a rich, smooth cup in under two minutes.',
    pros: ['Extremely versatile', 'Durable and portable', 'Forgiving for beginners'],
    cons: ['Only makes 1-2 cups at a time', 'Lots of small parts'],
    specs: {
      'Material': 'BPA-free Plastic',
      'Capacity': '8 oz (237 ml)',
      'Weight': '226g'
    },
    relatedProducts: ['timemore-c2'],
    guideSlugs: ['aeropress-guide-for-beginners'],
    categoryId: 'aeropress'
  }
];

export const recommendedProducts = products;
