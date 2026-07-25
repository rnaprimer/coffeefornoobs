export type SchemaOrgType =
  | 'Organization'
  | 'WebSite'
  | 'Product'
  | 'Article'
  | 'FAQPage'
  | 'BreadcrumbList';

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Coffee For Noobs',
    url: 'https://coffeefornoobs.com',
    logo: 'https://coffeefornoobs.com/images/og-default.png',
  };
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Coffee For Noobs',
    url: 'https://coffeefornoobs.com',
  };
}

export function generateProductSchema({
  name,
  description,
  image,
  brand,
  price,
  currency = 'USD',
  url,
}: {
  name: string;
  description: string;
  image?: string;
  brand: string;
  price: number;
  currency?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: currency,
      price: price,
      availability: 'https://schema.org/InStock',
    },
  };
}

export function generateArticleSchema({
  headline,
  description,
  image,
  authorName = 'Coffee For Noobs',
  datePublished,
  dateModified,
  url,
}: {
  headline: string;
  description: string;
  image?: string;
  authorName?: string;
  datePublished: string;
  dateModified?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image,
    author: {
      '@type': 'Organization',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Coffee For Noobs',
      logo: {
        '@type': 'ImageObject',
        url: 'https://coffeefornoobs.com/images/og-default.png',
      },
    },
    datePublished,
    dateModified: dateModified || datePublished,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
