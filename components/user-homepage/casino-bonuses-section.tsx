'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export function CasinoBonusesSection() {
  const bonuses = [
    {
      casino: 'Slotoslot',
      logo: 'https://yt3.googleusercontent.com/jzqKeKuso3zfOTytZIPhzwmlJNt0wlWyWQQt99YNeBJHsQOzxXocJNH1uIUA-Pznz9Ij9ji4KA=s900-c-k-c0x00ffffff-no-rj',
      bonus: '300,000 Free Coins & 50 Free Chips',
      variant: 'light' as const,
    },
    {
      casino: 'Gambino Slots',
      logo: '/assets/casinos/gambino.png',
      bonus: '200 Free Spins & 500K Free Coins',
      variant: 'primary' as const,
    },
    {
      casino: 'Heart of Vegas',
      logo: '/assets/casinos/heart-vegas.png',
      bonus: 'Free Chips @ Signup',
      variant: 'secondary' as const,
    },
    {
      casino: 'Vera Vegas',
      logo: '/assets/casinos/vera-vegas.png',
      bonus: 'Free Chips @ Signup',
      variant: 'light' as const,
    },
  ];

  const getCardStyles = (variant: 'light' | 'primary' | 'secondary') => {
    switch (variant) {
      case 'primary':
        return {
          cardClass: 'bg-primary text-primary-foreground',
          titleClass: 'text-primary-foreground',
          subtitleClass: 'text-primary-foreground/80',
          buttonClass: 'bg-background text-foreground hover:bg-background/90',
        };
      case 'secondary':
        return {
          cardClass: 'bg-secondary text-secondary-foreground',
          titleClass: 'text-secondary-foreground',
          subtitleClass: 'text-secondary-foreground/80',
          buttonClass: 'bg-background text-foreground hover:bg-background/90',
        };
      case 'light':
      default:
        return {
          cardClass: 'bg-muted',
          titleClass: 'text-foreground',
          subtitleClass: 'text-muted-foreground',
          buttonClass: 'bg-primary text-primary-foreground hover:bg-primary/90',
        };
    }
  };

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Browse our top picks for October
            </h2>
            <p className="text-muted-foreground">Claim the latest casino bonuses</p>
          </div>
          <Button variant="link" className="text-primary">
            See all casino bonuses
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bonuses.map((bonus, index) => {
            const styles = getCardStyles(bonus.variant);
            
            return (
              <Card
                key={index}
                className={`${styles.cardClass} border-0 overflow-hidden hover:shadow-xl transition-shadow`}
              >
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="w-24 h-24 bg-background rounded-lg flex items-center justify-center shadow-sm">
                    <img
                      src={bonus.logo}
                      alt={bonus.casino}
                      width={110}
                      height={110}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm mb-2 ${styles.titleClass}`}>
                      {bonus.bonus}
                    </h3>
                    <p className={`text-xs ${styles.subtitleClass}`}>
                      {bonus.casino}
                    </p>
                  </div>
                  <Button className={`w-full ${styles.buttonClass}`}>
                    Play Now
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
