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

export const GameCategoriesSection = memo(function GameCategoriesSection() {
  const [activeTab, setActiveTab] = useState('casino-games');

  const tabs = [
    { id: 'casino-games', label: 'Casino games', icon: Zap },
    { id: 'live-games', label: 'Live games', icon: Target },
    { id: 'payment-methods', label: 'Payment methods', icon: Coins },
    { id: 'bonuses', label: 'Bonuses', icon: Trophy },
  ];

  const gameCategories = [
    {
      name: 'Slots',
      icon: Zap,
      description: 'Spin the reels and win big',
      games: '500+ Games',
      popularity: 'Most Popular',
    },
    {
      name: 'Roulette',
      icon: Target,
      description: 'Bet on your lucky number',
      games: '50+ Variants',
      popularity: 'Classic',
    },
    {
      name: 'Blackjack',
      icon: Heart,
      description: 'Beat the dealer to 21',
      games: '30+ Tables',
      popularity: 'Strategic',
    },
    {
      name: 'Poker',
      icon: Crown,
      description: 'Master the art of poker',
      games: '100+ Variants',
      popularity: 'Skill-Based',
    },
    {
      name: 'Baccarat',
      icon: Gem,
      description: 'Simple yet elegant',
      games: '20+ Tables',
      popularity: 'Elegant',
    },
    {
      name: 'Sic Bo',
      icon: Sparkles,
      description: 'Roll the dice and win',
      games: '15+ Variants',
      popularity: 'Exciting',
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
              <span>Explore by Category</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
              Discover Your Perfect <span className="text-primary">Gaming Experience</span>
            </h2>
            
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
              Whether you're looking for the best casino games, thrilling live dealer experiences, 
              trusted payment methods, or the biggest bonuses, we've got you covered.
            </p>
          </div>
          
          <Button variant="link" className="text-primary text-sm sm:text-base">
            See all casino games
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
            Find safe places to play <span className="text-primary">games you'll love</span>
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
            Explore All Casino Games
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
});