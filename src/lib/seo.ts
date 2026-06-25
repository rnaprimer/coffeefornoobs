import { Metadata } from 'next';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

export function constructMetadata({
  title,
  description,
  image = '/images/og-default.png', // Add a default placeholder in future
  url = 'https://coffeefornoobs.com'
}: SEOProps): Metadata {
  return {
    title: `${title} | Coffee For Noobs`,
    description,
    openGraph: {
      title: `${title} | Coffee For Noobs`,
      description,
      url,
      siteName: 'Coffee For Noobs',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Coffee For Noobs`,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    }
  };
}
