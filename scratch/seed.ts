import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Parse .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const [key, val] = line.split('=');
  if (key && val) {
    env[key.trim()] = val.trim();
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseServiceKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseServiceKey || supabaseUrl.includes('your_supabase')) {
  console.error('Please populate your .env.local file with real Supabase credentials first!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log('Seeding categories...');
  const categoriesData = [
    { slug: 'grinders', name: 'Grinders', icon_name: 'Database', description: 'Coffee grinders for all brew methods' },
    { slug: 'french-press', name: 'French Press', icon_name: 'Coffee', description: 'French Press brewers and kits' },
    { slug: 'aeropress', name: 'Aeropress', icon_name: 'Archive', description: 'AeroPress brewers and accessories' },
    { slug: 'pour-over', name: 'Pour Over', icon_name: 'Droplet', description: 'Pour-over drippers and kits' },
    { slug: 'moka-pot', name: 'Moka Pot', icon_name: 'Flame', description: 'Moka Pots and stove-top brewers' },
    { slug: 'kettles', name: 'Kettles', icon_name: 'ThermometerSun', description: 'Gooseneck and temperature control kettles' },
    { slug: 'scales', name: 'Scales', icon_name: 'Scale', description: 'Coffee scales and timers' },
    { slug: 'accessories', name: 'Accessories', icon_name: 'Package', description: 'Cups, filters, and other gear' },
    { slug: 'beans', name: 'Coffee Beans', icon_name: 'Bean', description: 'Specialty coffee beans' }
  ];

  const { data: categories, error: catError } = await supabase
    .from('categories')
    .upsert(categoriesData, { onConflict: 'slug' })
    .select();

  if (catError) {
    console.error('Categories seed error:', catError);
    return;
  }
  console.log(`Seeded ${(categories || []).length} categories.`);

  console.log('Seeding brands...');
  const brandsData = [
    { name: 'Timemore', slug: 'timemore', description: 'Makers of excellent grinders and scales' },
    { name: 'Hario', slug: 'hario', description: 'Legendary Japanese glassware and brewers' },
    { name: 'AeroPress', slug: 'aeropress', description: 'Iconic pressure brewers' },
    { name: 'Blue Tokai', slug: 'blue-tokai', description: 'Specialty coffee roasters and gear' },
    { name: 'Subko', slug: 'subko', description: 'Specialty coffee roasters and bakers' },
    { name: 'Third Wave', slug: 'third-wave', description: 'Mass specialty coffee chains and roasters' }
  ];

  const { data: brands, error: brandError } = await supabase
    .from('brands')
    .upsert(brandsData, { onConflict: 'slug' })
    .select();

  if (brandError) {
    console.error('Brands seed error:', brandError);
    return;
  }
  console.log(`Seeded ${(brands || []).length} brands.`);

  console.log('Seeding products...');
  const productsData = [
    {
      slug: 'timemore-c2',
      name: 'Timemore C2 Hand Grinder',
      price: 4799,
      rating: 4.8,
      reviews: 120,
      badge: 'BEST SELLER',
      image_text: 'Grinder',
      description: 'An excellent entry-level manual grinder with stainless steel burrs, offering consistent grinds for pour-over and Aeropress.',
      short_description: 'An excellent entry-level manual grinder with stainless steel burrs.',
      pros: ['Great value for money', 'Consistent grind distribution', 'Fast grinding speed'],
      cons: ['Not suitable for espresso', 'Small capacity (25g)'],
      specifications: {
        'Burr Type': '38mm Conical Steel',
        'Capacity': '25g',
        'Weight': '430g',
        'Material': 'Aluminum Alloy'
      },
      featured: true,
      status: 'published',
      category_id: (categories || []).find((c: any) => c.slug === 'grinders')?.id,
      brand_id: (brands || []).find((b: any) => b.slug === 'timemore')?.id
    },
    {
      slug: 'hario-v60',
      name: 'Hario V60 Pour Over Kit',
      price: 2199,
      rating: 4.7,
      reviews: 98,
      badge: '',
      image_text: 'V60',
      description: 'The iconic pour-over brewer. This kit includes everything you need to start brewing clean, complex cups of coffee.',
      short_description: 'The iconic pour-over brewer kit.',
      pros: ['Inexpensive', 'Clean cup profile', 'Easy to clean'],
      cons: ['Requires gooseneck kettle', 'Steep learning curve'],
      specifications: {
        'Material': 'Plastic/Glass',
        'Filters': 'Paper (Size 02)',
        'Capacity': '1-4 Cups'
      },
      featured: false,
      status: 'published',
      category_id: (categories || []).find((c: any) => c.slug === 'pour-over')?.id,
      brand_id: (brands || []).find((b: any) => b.slug === 'hario')?.id
    },
    {
      slug: 'aeropress-original',
      name: 'AeroPress Original',
      price: 3299,
      rating: 4.9,
      reviews: 215,
      badge: '',
      image_text: 'Aeropress',
      description: 'A versatile, travel-friendly brewer that uses pressure to extract a rich, smooth cup in under two minutes.',
      short_description: 'A versatile, travel-friendly pressure brewer.',
      pros: ['Extremely versatile', 'Durable and portable', 'Forgiving for beginners'],
      cons: ['Only makes 1-2 cups at a time', 'Lots of small parts'],
      specifications: {
        'Material': 'BPA-free Plastic',
        'Capacity': '8 oz (237 ml)',
        'Weight': '226g'
      },
      featured: false,
      status: 'published',
      category_id: (categories || []).find((c: any) => c.slug === 'aeropress')?.id,
      brand_id: (brands || []).find((b: any) => b.slug === 'aeropress')?.id
    }
  ];

  const { data: products, error: prodError } = await supabase
    .from('products')
    .upsert(productsData, { onConflict: 'slug' })
    .select();

  if (prodError) {
    console.error('Products seed error:', prodError);
    return;
  }
  console.log(`Seeded ${(products || []).length} products.`);

  // Seed affiliate links for each product
  console.log('Seeding affiliate links...');
  const affiliateLinksData = [];
  for (const product of (products || [])) {
    affiliateLinksData.push(
      {
        product_id: product.id,
        store_name: 'Amazon',
        affiliate_url: `https://amazon.in/dp/mock-${product.slug}`
      },
      {
        product_id: product.id,
        store_name: 'Something Brewing',
        affiliate_url: `https://somethingbrewing.in/mock-${product.slug}`
      }
    );
  }

  const { error: affError } = await supabase
    .from('affiliate_links')
    .upsert(affiliateLinksData);

  if (affError) {
    console.error('Affiliate links seed error:', affError);
  } else {
    console.log('Seeded affiliate links.');
  }

  console.log('Seeding roasters...');
  const roastersData = [
    {
      slug: 'blue-tokai',
      name: 'Blue Tokai Coffee Roasters',
      location: 'Delhi, India',
      description: 'One of the pioneers of specialty coffee in India, offering a wide range of single-estate coffees.'
    },
    {
      slug: 'subko',
      name: 'Subko Specialty Coffee',
      location: 'Mumbai, India',
      description: 'A modern roastery focusing on innovative processing and showcasing Indian coffees globally.'
    },
    {
      slug: 'third-wave',
      name: 'Third Wave Coffee',
      location: 'Bangalore, India',
      description: 'Bringing specialty coffee to the masses with accessible blends and a focus on consistent quality.'
    }
  ];

  const { data: roasters, error: roasterError } = await supabase
    .from('roasters')
    .upsert(roastersData, { onConflict: 'slug' })
    .select();

  if (roasterError) {
    console.error('Roasters seed error:', roasterError);
    return;
  }
  console.log(`Seeded ${(roasters || []).length} roasters.`);

  console.log('Seeding beans...');
  const beansData = [
    {
      slug: 'attikan-estate',
      name: 'Attikan Estate',
      price: 499,
      origin: 'Biligirirangan Hills, Karnataka',
      process: 'Washed',
      roast_level: 'Medium Dark',
      tasting_notes: ['Dark Chocolate', 'Figs', 'Roasted Nuts'],
      brewing_recommendations: ['French Press', 'Moka Pot', 'Espresso'],
      image_text: 'Attikan Estate Bag',
      status: 'published',
      featured: true,
      roaster_id: (roasters || []).find((r: any) => r.slug === 'blue-tokai')?.id
    },
    {
      slug: 'house-blend',
      name: 'House Blend',
      price: 650,
      origin: 'Various Estates, India',
      process: 'Washed / Natural Blend',
      roast_level: 'Medium',
      tasting_notes: ['Milk Chocolate', 'Caramel', 'Orange Zest'],
      brewing_recommendations: ['Pour Over', 'Aeropress'],
      image_text: 'Subko House Blend',
      status: 'published',
      featured: true,
      roaster_id: (roasters || []).find((r: any) => r.slug === 'subko')?.id
    },
    {
      slug: 'classic-espresso',
      name: 'Classic Espresso',
      price: 499,
      origin: 'Chikmagalur',
      process: 'Washed',
      roast_level: 'Dark',
      tasting_notes: ['Cocoa', 'Walnut', 'Molasses'],
      brewing_recommendations: ['Espresso', 'Moka Pot'],
      image_text: 'Classic Espresso Bag',
      status: 'published',
      featured: false,
      roaster_id: (roasters || []).find((r: any) => r.slug === 'third-wave')?.id
    }
  ];

  const { data: beans, error: beanError } = await supabase
    .from('beans')
    .upsert(beansData, { onConflict: 'slug' })
    .select();

  if (beanError) {
    console.error('Beans seed error:', beanError);
    return;
  }
  console.log(`Seeded ${(beans || []).length} beans.`);

  // Seed bean relationships
  console.log('Seeding bean relationships...');
  const attikan = (beans || []).find((b: any) => b.slug === 'attikan-estate');
  const house = (beans || []).find((b: any) => b.slug === 'house-blend');
  const classic = (beans || []).find((b: any) => b.slug === 'classic-espresso');

  if (attikan && house && classic) {
    const beanRels = [
      { bean_id: attikan.id, related_bean_id: house.id },
      { bean_id: house.id, related_bean_id: attikan.id },
      { bean_id: classic.id, related_bean_id: attikan.id }
    ];
    const { error: beanRelError } = await supabase
      .from('bean_relationships')
      .upsert(beanRels);
    if (beanRelError) console.error('Bean relationships error:', beanRelError);
  }

  console.log('Seeding guides...');
  const guidesData = [
    {
      slug: 'how-to-make-coffee-in-a-french-press',
      title: 'How to Make Coffee in a French Press',
      cover_image_text: 'French Press Brew',
      author: 'CoffeeForNoobs Team',
      reading_time: 5,
      content: 'The French Press is one of the easiest and most forgiving brewing methods. It produces a full-bodied, rich cup of coffee. Step 1: Coarsely grind your coffee. Step 2: Add water just off the boil. Step 3: Wait 4 minutes. Step 4: Plunge and enjoy.',
      excerpt: 'The French Press is one of the easiest and most forgiving brewing methods. It produces a full-bodied, rich cup of coffee.',
      status: 'published',
      featured: true,
      category_id: (categories || []).find((c: any) => c.slug === 'french-press')?.id
    },
    {
      slug: 'aeropress-guide-for-beginners',
      title: 'Aeropress Guide for Beginners',
      cover_image_text: 'Aeropress Plunge',
      author: 'CoffeeForNoobs Team',
      reading_time: 6,
      content: 'The Aeropress is a versatile brewer. Use the inverted method for more control over steep time. Add coffee, add water, stir, steep for 2 minutes, flip, and plunge.',
      excerpt: 'The Aeropress is a versatile brewer. Learn how to brew using the inverted method.',
      status: 'published',
      featured: false,
      category_id: (categories || []).find((c: any) => c.slug === 'aeropress')?.id
    },
    {
      slug: 'best-grinders-under-5000',
      title: 'Best Coffee Grinders Under ₹5,000',
      cover_image_text: 'Hand Grinders',
      author: 'CoffeeForNoobs Team',
      reading_time: 8,
      content: 'A good grinder is the most important piece of coffee gear. We test the best budget hand grinders available in India, including the Timemore C2 and Kingrinder P1.',
      excerpt: 'A good grinder is the most important piece of coffee gear. We test the best budget hand grinders available in India.',
      status: 'published',
      featured: true,
      category_id: (categories || []).find((c: any) => c.slug === 'grinders')?.id
    }
  ];

  const { data: guides, error: guideError } = await supabase
    .from('guides')
    .upsert(guidesData, { onConflict: 'slug' })
    .select();

  if (guideError) {
    console.error('Guides seed error:', guideError);
    return;
  }
  console.log(`Seeded ${(guides || []).length} guides.`);

  // Seed guide products
  console.log('Seeding guide products...');
  const c2Product = (products || []).find((p: any) => p.slug === 'timemore-c2');
  const aeropressProduct = (products || []).find((p: any) => p.slug === 'aeropress-original');
  const frenchPressGuide = (guides || []).find((g: any) => g.slug === 'how-to-make-coffee-in-a-french-press');
  const aeropressGuide = (guides || []).find((g: any) => g.slug === 'aeropress-guide-for-beginners');
  const grindersGuide = (guides || []).find((g: any) => g.slug === 'best-grinders-under-5000');

  const guideProds = [];
  if (frenchPressGuide && c2Product) {
    guideProds.push({ guide_id: frenchPressGuide.id, product_id: c2Product.id });
  }
  if (aeropressGuide && aeropressProduct) {
    guideProds.push({ guide_id: aeropressGuide.id, product_id: aeropressProduct.id });
  }
  if (aeropressGuide && c2Product) {
    guideProds.push({ guide_id: aeropressGuide.id, product_id: c2Product.id });
  }
  if (grindersGuide && c2Product) {
    guideProds.push({ guide_id: grindersGuide.id, product_id: c2Product.id });
  }

  if (guideProds.length > 0) {
    const { error: gpError } = await supabase
      .from('guide_products')
      .upsert(guideProds);
    if (gpError) console.error('Guide products error:', gpError);
  }

  // Seed guide relationships
  console.log('Seeding guide relationships...');
  if (frenchPressGuide && aeropressGuide && grindersGuide) {
    const guideRels = [
      { guide_id: frenchPressGuide.id, related_guide_id: aeropressGuide.id },
      { guide_id: aeropressGuide.id, related_guide_id: frenchPressGuide.id },
      { guide_id: grindersGuide.id, related_guide_id: frenchPressGuide.id }
    ];
    const { error: grError } = await supabase
      .from('guide_relationships')
      .upsert(guideRels);
    if (grError) console.error('Guide relationships error:', grError);
  }

  console.log('Seeding comparisons...');
  const comparisonsData = [
    {
      slug: 'timemore-c2-vs-c3',
      title: 'Timemore C2 vs C3: Which should you buy?',
      description: 'A detailed breakdown of the differences between the legendary Timemore C2 and its successor, the C3.',
      content: 'A detailed breakdown of the differences between the legendary Timemore C2 and its successor, the C3.',
      winner: 'timemore-c2',
      recommendation: 'If you are on a strict budget, the C2 is still the king of value. If you plan to brew espresso later, neither is ideal, but the C3 is slightly better.',
      status: 'published',
      product_a_id: (products || []).find((p: any) => p.slug === 'timemore-c2')?.id,
      product_b_id: (products || []).find((p: any) => p.slug === 'timemore-c2')?.id
    }
  ];

  const { error: compError } = await supabase
    .from('comparisons')
    .upsert(comparisonsData, { onConflict: 'slug' });

  if (compError) {
    console.error('Comparisons seed error:', compError);
  } else {
    console.log('Seeded comparisons.');
  }

  console.log('Seeding settings...');
  const settingsData = [
    { key: 'site_name', value: { text: 'Coffee For Noobs' } },
    { key: 'footer_text', value: { text: '© 2026 Coffee For Noobs. Built for beginners, powered by caffeine.' } }
  ];
  const { error: setErr } = await supabase
    .from('settings')
    .upsert(settingsData, { onConflict: 'key' });
  if (setErr) console.error('Settings seed error:', setErr);

  console.log('Seeding homepage settings...');
  const { error: hpSetErr } = await supabase
    .from('homepage_settings')
    .upsert([{
      id: 1,
      meta_title: 'CoffeeForNoobs | Master Your Morning Brew',
      meta_description: 'The easiest way to learn how to brew amazing coffee at home.',
      announcement_enabled: false,
      announcement_text: 'Welcome to the new CoffeeForNoobs!',
    }], { onConflict: 'id' });
  if (hpSetErr) console.error('Homepage settings seed error:', hpSetErr);

  console.log('Seeding homepage sections...');
  const sectionsData = [
    { section_key: 'hero', title: 'Brew Better Coffee', subtitle: 'START YOUR JOURNEY', description: 'Everything you need to know about brewing specialty coffee at home, minus the snobbery.', button_text: 'Get Started', button_url: '/guides', display_order: 1, status: 'published' },
    { section_key: 'categories', title: 'Browse by Category', subtitle: '', description: '', button_text: '', button_url: '', display_order: 2, status: 'published' },
    { section_key: 'setup_builder', title: 'Build Your Setup', subtitle: '', description: 'Answer a few questions and we will recommend the perfect gear for your budget and taste.', button_text: 'Start Builder', button_url: '/builder', display_order: 3, status: 'published' },
    { section_key: 'featured_products', title: 'Recommended Gear', subtitle: 'TESTED & APPROVED', description: 'The best coffee equipment for beginners, hand-tested by our team.', button_text: 'View All Gear', button_url: '/gear', display_order: 4, status: 'published' },
    { section_key: 'featured_guides', title: 'Popular Guides', subtitle: '', description: '', button_text: 'Read More', button_url: '/guides', display_order: 5, status: 'published' },
    { section_key: 'featured_beans', title: 'Best Beans Right Now', subtitle: 'FRESHLY ROASTED', description: 'Our top picks from Indian specialty coffee roasters this month.', button_text: 'Discover Beans', button_url: '/beans', display_order: 6, status: 'published' },
    { section_key: 'newsletter', title: 'Join the Club', subtitle: 'NEWSLETTER', description: 'Get a weekly email with tips, new gear reviews, and freshly roasted bean recommendations.', button_text: 'Subscribe', button_url: '', display_order: 7, status: 'published' },
    { section_key: 'footer_cta', title: 'Ready to brew?', subtitle: '', description: 'Read our comprehensive getting started guide.', button_text: 'Start Here', button_url: '/guides/getting-started', display_order: 8, status: 'published' },
  ];
  const { data: sections, error: hpSecErr } = await supabase
    .from('homepage_sections')
    .upsert(sectionsData, { onConflict: 'section_key' })
    .select();
  if (hpSecErr) console.error('Homepage sections seed error:', hpSecErr);

  console.log('Seeding homepage section items...');
  if (sections && categories && products && guides && beans) {
    const featuredItemsData: any[] = [];
    
    const catSection = sections.find((s: any) => s.section_key === 'categories');
    if (catSection) {
      categories.slice(0, 4).forEach((c: any, idx: number) => {
        featuredItemsData.push({ homepage_section_id: catSection.id, entity_type: 'category', entity_id: c.id, display_order: idx + 1 });
      });
    }

    const prodSection = sections.find((s: any) => s.section_key === 'featured_products');
    if (prodSection) {
      products.slice(0, 3).forEach((p: any, idx: number) => {
        featuredItemsData.push({ homepage_section_id: prodSection.id, entity_type: 'product', entity_id: p.id, display_order: idx + 1 });
      });
    }

    const guideSection = sections.find((s: any) => s.section_key === 'featured_guides');
    if (guideSection) {
      guides.slice(0, 2).forEach((g: any, idx: number) => {
        featuredItemsData.push({ homepage_section_id: guideSection.id, entity_type: 'guide', entity_id: g.id, display_order: idx + 1 });
      });
    }

    const beanSection = sections.find((s: any) => s.section_key === 'featured_beans');
    if (beanSection) {
      beans.slice(0, 2).forEach((b: any, idx: number) => {
        featuredItemsData.push({ homepage_section_id: beanSection.id, entity_type: 'bean', entity_id: b.id, display_order: idx + 1 });
      });
    }

    if (featuredItemsData.length > 0) {
      // Clear all items first to prevent duplicates
      await supabase.from('homepage_section_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const { error: hpItemErr } = await supabase.from('homepage_section_items').insert(featuredItemsData);
      if (hpItemErr) console.error('Homepage items seed error:', hpItemErr);
    }
  }

  console.log('Database seeding successfully finished!');
}

seed();
