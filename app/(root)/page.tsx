import { CasinoBonusesSection } from "@/components/user-homepage/casino-bonuses-section";
import { FreeGamesSection } from "@/components/user-homepage/free-games-section";
import { GameCategoriesSection } from "@/components/user-homepage/game-categories-section";
import { HeroSection } from "@/components/user-homepage/hero-section";
import { WhyChooseUsSection } from "@/components/user-homepage/why-choose-us-section";

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
