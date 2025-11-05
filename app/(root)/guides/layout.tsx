import { generateMetadata as genMeta } from '@/lib/utils/seo';

export const metadata = genMeta({
  title: 'Casino Guides - Expert Gambling Guides & Tips',
  description: 'Learn everything about online casinos with our comprehensive guides. Expert tips on bonuses, games, strategies, and safe gambling practices.',
  keywords: ['casino guides', 'gambling guides', 'casino tips', 'online gambling guide', 'casino strategies'],
  url: '/guides',
});

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

