'use client';

import { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Zap,
  Target,
  Heart,
  Crown,
  Gem,
  Sparkles,
  Star,
  Trophy,
  Coins
} from 'lucide-react';
import { useI18n } from '@/context/i18n.context';

export const GameCategoriesSection = memo(function GameCategoriesSection() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('casino-games');

  const tabs = [
    { id: 'casino-games', label: t('games.casinoGames'), icon: Zap },
    { id: 'live-games', label: t('games.liveGames'), icon: Target },
    { id: 'payment-methods', label: t('games.paymentMethods'), icon: Coins },
    { id: 'bonuses', label: t('bonuses.title'), icon: Trophy },
  ];

  const gameCategories = [
    {
      name: t('games.slots'),
      icon: Zap,
      description: t('games.spinTheReels'),
      games: '500+ ' + t('games.games'),
      popularity: t('games.mostPopular'),
    },
    {
      name: t('games.roulette'),
      icon: Target,
      description: t('games.betOnLuckyNumber'),
      games: '50+ ' + t('games.variants'),
      popularity: t('games.classic'),
    },
    {
      name: t('games.blackjack'),
      icon: Heart,
      description: t('games.beatTheDealer'),
      games: '30+ ' + t('games.tables'),
      popularity: t('games.strategic'),
    },
    {
      name: t('games.poker'),
      icon: Crown,
      description: t('games.masterPoker'),
      games: '100+ ' + t('games.variants'),
      popularity: t('games.skillBased'),
    },
    {
      name: t('games.baccarat'),
      icon: Gem,
      description: t('games.simpleYetElegant'),
      games: '20+ ' + t('games.tables'),
      popularity: t('games.elegant'),
    },
    {
      name: t('games.sicBo'),
      icon: Sparkles,
      description: t('games.rollTheDice'),
      games: '15+ ' + t('games.variants'),
      popularity: t('games.exciting'),
    },
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 bg-muted/50">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              <Star className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{t('games.exploreByCategory')}</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
              {t('games.discoverGamingExperience')} <span className="text-primary">{t('games.gamingExperience')}</span>
            </h2>
            
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
              {t('games.gameCategoryDescription')}
            </p>
          </div>
          
          <Button variant="link" className="text-primary text-sm sm:text-base">
            {t('games.seeAllCasinoGames')}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
        
        {/* Enhanced Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'bg-background text-foreground border-border hover:bg-muted'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Main Content - Game Categories */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
            {t('games.findSafePlaces')} <span className="text-primary">{t('games.gamesYoullLove')}</span>
          </h3>
          
          {/* Game Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {gameCategories.map((category, index) => (
              <Card 
                key={index}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border border-border bg-card"
              >
                <CardContent className="p-3 sm:p-4 text-center">
                  {/* Icon with theme colors */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                    <category.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                  </div>
                  
                  <h4 className="font-semibold text-foreground mb-1 sm:mb-2 text-xs sm:text-sm">{category.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2 sm:mb-3">{category.description}</p>
                  
                  <div className="space-y-1">
                    <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs w-full">
                      {category.games}
                    </Badge>
                    <Badge variant="outline" className="text-primary border-primary text-xs w-full">
                      {category.popularity}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-lg"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {t('games.exploreAllCasinoGames')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
});