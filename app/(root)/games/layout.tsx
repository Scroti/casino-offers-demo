import { generateMetadata as genMeta } from '@/lib/utils/seo';

export const metadata = genMeta({
  title: 'Free Casino Games - Play Online Casino Games',
  description: 'Play free casino games online including slots, table games, and more. No download required. Enjoy the best casino games from top providers.',
  keywords: ['free casino games', 'online casino games', 'slots', 'table games', 'casino games'],
  url: '/games',
});

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

