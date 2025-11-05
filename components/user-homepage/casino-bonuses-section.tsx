'use client';

import { memo, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useGetAllCasinosQuery } from '@/app/lib/data-access/configs/casinos.config';
import { useGetAllBonusesQuery, useGetBonusesByCasinoQuery } from '@/app/lib/data-access/configs/bonuses.config';
import type { Casino } from '@/app/lib/data-access/models/casino.model';
import type { Bonus } from '@/app/lib/data-access/models/bonus.model';

export const CasinoBonusesSection = memo(function CasinoBonusesSection() {
  const { data: casinos = [], isLoading: casinosLoading } = useGetAllCasinosQuery();
  const { data: allBonuses = [] } = useGetAllBonusesQuery();

  // Get one random bonus per casino
  const casinoBonuses = useMemo(() => {
    if (casinosLoading || casinos.length === 0) return [];

    const variants: Array<'light' | 'primary' | 'secondary'> = ['light', 'primary', 'secondary'];
    const result: Array<{
      casino: Casino;
      bonus: Bonus;
      variant: 'light' | 'primary' | 'secondary';
    }> = [];

    // Get unique casinos (only those with bonuses)
    const casinosWithBonuses = casinos.filter(casino => {
      const casinoBonuses = allBonuses.filter(bonus => {
        if (typeof bonus.casino === 'object' && bonus.casino !== null) {
          return (bonus.casino as any)._id === casino._id;
        }
        return bonus.casino === casino._id;
      });
      return casinoBonuses.length > 0;
    });

    // Limit to 4 casinos for the homepage
    const selectedCasinos = casinosWithBonuses.slice(0, 4);

    selectedCasinos.forEach((casino, index) => {
      // Get all bonuses for this casino
      const casinoBonuses = allBonuses.filter(bonus => {
        if (typeof bonus.casino === 'object' && bonus.casino !== null) {
          return (bonus.casino as any)._id === casino._id;
        }
        return bonus.casino === casino._id;
      });

      if (casinoBonuses.length > 0) {
        // Pick a random bonus
        const randomBonus = casinoBonuses[Math.floor(Math.random() * casinoBonuses.length)];
        const variant = variants[index % variants.length];

        result.push({
          casino,
          bonus: randomBonus,
          variant,
        });
      }
    });

    return result;
  }, [casinos, allBonuses, casinosLoading]);

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
    <section className="py-8 sm:py-12 lg:py-16 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Browse our top picks for October
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">Claim the latest casino bonuses</p>
          </div>
          <Button variant="link" className="text-primary text-sm sm:text-base" asChild>
            <Link href="/bonuses">
              See all casino bonuses
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {casinosLoading ? (
            // Loading state
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="border-0 overflow-hidden">
                <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center space-y-3 sm:space-y-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted rounded-lg animate-pulse" />
                  <div className="w-full space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-3 bg-muted rounded animate-pulse w-3/4 mx-auto" />
                  </div>
                  <div className="w-full h-8 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))
          ) : casinoBonuses.length === 0 ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No casino bonuses available at the moment.
            </div>
          ) : (
            casinoBonuses.map((item, index) => {
              const styles = getCardStyles(item.variant);
              const casino = item.casino;
              const bonus = item.bonus;
              const bonusTitle = bonus.title || 'Bonus';
              const casinoName = casino.name || 'Casino';
              const casinoLogo = casino.logo || casino.image || '/assets/images/logo.png';
              const reviewLink = casino.reviewUrl || (casino._id ? `/casinos/${casino._id}/review` : '#');
              
              return (
                <Card
                  key={casino._id || index}
                  className={`${styles.cardClass} border-0 overflow-hidden hover:shadow-xl transition-shadow`}
                >
                  <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center space-y-3 sm:space-y-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-background rounded-lg flex items-center justify-center shadow-sm">
                      <img
                        src={casinoLogo}
                        alt={casinoName}
                        width={110}
                        height={110}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className={`font-semibold text-xs sm:text-sm mb-1 sm:mb-2 ${styles.titleClass} line-clamp-2`}>
                        {bonusTitle}
                      </h3>
                      <p className={`text-xs ${styles.subtitleClass}`}>
                        {casinoName}
                      </p>
                    </div>
                    <Button 
                      className={`w-full text-xs sm:text-sm ${styles.buttonClass}`}
                      asChild
                    >
                      <Link href={reviewLink}>
                        Play Now
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
});
