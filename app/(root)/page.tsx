import { generateMetadata as genMeta } from '@/lib/utils/seo';
import { CasinoBonusesSection } from "@/components/user-homepage/casino-bonuses-section";
import { FreeGamesSection } from "@/components/user-homepage/free-games-section";
import { GameCategoriesSection } from "@/components/user-homepage/game-categories-section";
import { HeroSection } from "@/components/user-homepage/hero-section";
import { WhyChooseUsSection } from "@/components/user-homepage/why-choose-us-section";

export const metadata = genMeta({
  title: 'Best Online Casino Bonuses & Reviews',
  description: 'Discover the best online casino bonuses, reviews, and free games. Find exclusive offers, trusted casino reviews, and play free casino games. Your trusted guide for safe and secure online gambling.',
  keywords: ['casino bonuses', 'casino reviews', 'online casino', 'free casino games'],
  url: '/',
});

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <CasinoBonusesSection />
      <FreeGamesSection />
      <GameCategoriesSection />
      <WhyChooseUsSection />
    </main>
  );
}
