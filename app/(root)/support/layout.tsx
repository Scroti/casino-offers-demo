import { generateMetadata as genMeta } from '@/lib/utils/seo';

export const metadata = genMeta({
  title: 'Support - Contact Us',
  description: 'Get help and support from Playwise Guru. Contact our team for questions, feedback, or assistance with casino bonuses and reviews.',
  keywords: ['casino support', 'contact', 'help', 'customer service'],
  url: '/support',
});

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

