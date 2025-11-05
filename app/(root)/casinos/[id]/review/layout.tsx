import { generateMetadata as genMeta } from '@/lib/utils/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<ReturnType<typeof genMeta>> {
  const { id } = await params;
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api/v1';
  
  try {
    const res = await fetch(`${apiUrl}/casinos/${id}`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const casino = await res.json();
      return genMeta({
        title: `${casino.name} Review - Casino Review & Rating`,
        description: `Read our comprehensive review of ${casino.name}. Discover bonuses, games, safety index, and all features. ${casino.description || ''}`,
        keywords: [`${casino.name} review`, 'casino review', 'casino rating', 'online casino', casino.name],
        url: `/casinos/${id}/review`,
        image: casino.image || casino.logo,
        type: 'article',
      });
    }
  } catch (error) {
    console.error('Failed to fetch casino for metadata:', error);
  }

  return genMeta({
    title: 'Casino Review',
    description: 'Read our comprehensive casino review with ratings, bonuses, and features.',
    url: `/casinos/${id}/review`,
  });
}

export default function CasinoReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

