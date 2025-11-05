import { generateMetadata as genMeta } from '@/lib/utils/seo';

export const metadata = genMeta({
  title: 'Casino News - Latest Gambling & Casino Updates',
  description: 'Stay updated with the latest casino news, gambling industry updates, new game releases, and casino promotions. Your source for all casino-related news.',
  keywords: ['casino news', 'gambling news', 'casino updates', 'iGaming news', 'casino industry'],
  url: '/news',
});

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

