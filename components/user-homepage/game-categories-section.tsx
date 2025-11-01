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
    <section className="py-16 px-4 bg-muted/50">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              <span>Explore by Category</span>
            </div>
            
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Discover Your Perfect <span className="text-primary">Gaming Experience</span>
            </h2>
            
            <p className="text-muted-foreground max-w-2xl">
              Whether you're looking for the best casino games, thrilling live dealer experiences, 
              trusted payment methods, or the biggest bonuses, we've got you covered.
            </p>
          </div>
          
          <Button variant="link" className="text-primary">
            See all casino games
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
        
        {/* Enhanced Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
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
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">
            Find safe places to play <span className="text-primary">games you'll love</span>
          </h3>
          
          {/* Game Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {gameCategories.map((category, index) => (
              <Card 
                key={index}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border border-border bg-card"
              >
                <CardContent className="p-4 text-center">
                  {/* Icon with theme colors */}
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <category.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  
                  <h4 className="font-semibold text-foreground mb-2 text-sm">{category.name}</h4>
                  <p className="text-xs text-muted-foreground mb-3">{category.description}</p>
                  
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