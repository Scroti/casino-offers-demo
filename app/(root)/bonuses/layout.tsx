import { generateMetadata as genMeta } from '@/lib/utils/seo';

export const metadata = genMeta({
  title: 'Casino Bonuses - Best Online Casino Bonus Offers',
  description: 'Browse the best online casino bonuses including no deposit bonuses, welcome bonuses, and exclusive offers. Find the perfect bonus for your favorite casino.',
  keywords: ['casino bonuses', 'no deposit bonus', 'welcome bonus', 'casino offers', 'bonus codes'],
  url: '/bonuses',
});

export default function BonusesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

