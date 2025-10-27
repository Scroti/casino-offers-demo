import { CasinoBonusesSection } from "@/components/user-homepage/casino-bonuses-section";
import { FreeGamesSection } from "@/components/user-homepage/free-games-section";
import { HeroSection } from "@/components/user-homepage/hero-section";


export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <CasinoBonusesSection />
      <FreeGamesSection />
    </main>
  );
}
