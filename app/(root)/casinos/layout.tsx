import { generateMetadata as genMeta } from '@/lib/utils/seo';

export const metadata = genMeta({
  title: 'Online Casinos - Best Casino Reviews & Ratings',
  description: 'Discover the best online casinos with detailed reviews, ratings, and safety indexes. Compare bonuses, games, and features to find your perfect casino.',
  keywords: ['online casinos', 'casino reviews', 'casino ratings', 'best casinos', 'safe casinos'],
  url: '/casinos',
});

export default function CasinosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

