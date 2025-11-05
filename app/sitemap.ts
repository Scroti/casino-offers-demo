import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/utils/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/bonuses`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/casinos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/games`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic routes - fetch from API
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api/v1';
    
    // Fetch casinos
    let casinos: any[] = [];
    try {
      const casinosRes = await fetch(`${apiUrl}/casinos`, { next: { revalidate: 3600 } });
      if (casinosRes.ok) {
        casinos = await casinosRes.json();
      }
    } catch (error) {
      console.error('Failed to fetch casinos for sitemap:', error);
    }

    // Fetch bonuses
    let bonuses: any[] = [];
    try {
      const bonusesRes = await fetch(`${apiUrl}/bonuses`, { next: { revalidate: 3600 } });
      if (bonusesRes.ok) {
        bonuses = await bonusesRes.json();
      }
    } catch (error) {
      console.error('Failed to fetch bonuses for sitemap:', error);
    }

    // Fetch games
    let games: any[] = [];
    try {
      const gamesRes = await fetch(`${apiUrl}/games/active`, { next: { revalidate: 3600 } });
      if (gamesRes.ok) {
        games = await gamesRes.json();
      }
    } catch (error) {
      console.error('Failed to fetch games for sitemap:', error);
    }

    // Fetch guides
    let guides: any[] = [];
    try {
      const guidesRes = await fetch(`${apiUrl}/guides`, { next: { revalidate: 3600 } });
      if (guidesRes.ok) {
        guides = await guidesRes.json();
      }
    } catch (error) {
      console.error('Failed to fetch guides for sitemap:', error);
    }

    // Build dynamic routes
    const dynamicRoutes: MetadataRoute.Sitemap = [
      // Casino review pages
      ...casinos.map((casino) => ({
        url: `${baseUrl}/casinos/${casino._id}/review`,
        lastModified: casino.updatedAt ? new Date(casino.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
      // Game pages
      ...games.map((game) => ({
        url: `${baseUrl}/games/${game.gameId || game._id}`,
        lastModified: game.updatedAt ? new Date(game.updatedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
      // Guide pages
      ...guides
        .filter((guide) => guide.isPublished && guide.slug)
        .map((guide) => ({
          url: `${baseUrl}/guides/${guide.slug}`,
          lastModified: guide.publishedAt ? new Date(guide.publishedAt) : guide.updatedAt ? new Date(guide.updatedAt) : new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        })),
    ];

    return [...staticRoutes, ...dynamicRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticRoutes;
  }
}

