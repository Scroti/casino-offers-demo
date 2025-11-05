import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/utils/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/profile/'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}

