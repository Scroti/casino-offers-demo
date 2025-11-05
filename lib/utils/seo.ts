import type { Metadata } from 'next';

export const siteConfig = {
  name: 'Playwise Guru',
  description: 'Discover the best online casino bonuses, reviews, and free games. Trusted guides for safe and secure online gambling.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://playwiseguru.com',
  ogImage: '/assets/images/logo.png',
  twitterHandle: '@playwiseguru',
  keywords: [
    'online casino',
    'casino bonuses',
    'casino reviews',
    'free casino games',
    'casino guides',
    'online gambling',
    'casino offers',
    'best casino bonuses',
    'no deposit bonus',
    'casino slots',
  ],
};

interface GenerateMetadataOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noIndex?: boolean;
}

export function generateMetadata(options: GenerateMetadataOptions = {}): Metadata {
  const {
    title,
    description,
    keywords = [],
    image,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    noIndex = false,
  } = options;

  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const metaDescription = description || siteConfig.description;
  const metaKeywords = [...siteConfig.keywords, ...keywords].join(', ');
  const metaUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
  const metaImage = image ? (image.startsWith('http') ? image : `${siteConfig.url}${image}`) : `${siteConfig.url}${siteConfig.ogImage}`;

  return {
    title: fullTitle,
    description: metaDescription,
    keywords: metaKeywords,
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      type,
      url: metaUrl,
      title: fullTitle,
      description: metaDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      publishedTime,
      modifiedTime,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: metaDescription,
      images: [metaImage],
      creator: siteConfig.twitterHandle,
    },
    alternates: {
      canonical: metaUrl,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateJsonLd({
  type = 'WebSite',
  name,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author,
}: {
  type?: string;
  name?: string;
  description?: string;
  url?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}) {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type,
    name: name || siteConfig.name,
    description: description || siteConfig.description,
    url: url || siteConfig.url,
    image: image || `${siteConfig.url}${siteConfig.ogImage}`,
  };

  if (type === 'Article' || type === 'BlogPosting') {
    return {
      ...baseSchema,
      datePublished: datePublished || new Date().toISOString(),
      dateModified: dateModified || new Date().toISOString(),
      author: author ? {
        '@type': 'Person',
        name: author,
      } : undefined,
    };
  }

  return baseSchema;
}

