'use client';

import { memo, useState, useEffect, useRef } from 'react';
import { useI18n } from '@/context/i18n.context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Dices, 
  Star, 
  Newspaper, 
  Coins 
} from 'lucide-react';

export const HeroSection = memo(function HeroSection() {
  const { t } = useI18n();
  const words = ['safe', 'trusted', 'best', 'reliable', 'top-rated', 'casinos'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setIsAnimating(false);
      }, 250); // Half of animation duration
    }, 3000); // Change word every 3 seconds

    return () => clearInterval(interval);
  }, [words.length]);

  useEffect(() => {
    // Measure the actual width of the rendered word
    if (measureRef.current) {
      const width = measureRef.current.offsetWidth;
      setContainerWidth(width);
    }
  }, [currentWordIndex]);
  const features = [
    {
      icon: Dices,
      label: 'FREE',
      title: 'Free casino games',
      href: '/games/free',
    },
    {
      icon: Star,
      title: 'Casino reviews',
      href: '/bonuses',
    },
    {
      icon: Newspaper,
      title: 'Latest news',
      href: '/news',
    },
    {
      icon: Coins,
      title: 'Real money casinos',
      href: '/casinos',
    },
  ];

  return (
    <section className="relative py-8 sm:py-12 lg:py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 lg:items-center">
          {/* Hero section - Text content */}
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              {t('hero.title')}{' '}
              <br className="sm:hidden" />
              <span 
                className="relative inline-block h-[1.2em] transition-all duration-500 ease-in-out overflow-hidden"
                style={{ 
                  width: containerWidth ? `${containerWidth}px` : 'auto',
                  minWidth: '80px'
                }}
              >
                {/* Hidden span to measure width */}
                <span 
                  ref={measureRef}
                  className="absolute invisible opacity-0 pointer-events-none whitespace-nowrap"
                  aria-hidden="true"
                >
                  {words[currentWordIndex] === 'casinos' ? 'casinos' : `${words[currentWordIndex]} casinos`}
                </span>
                {/* Visible animated word */}
                <span 
                  className={`inline-block absolute left-0 top-0 transition-all duration-500 ease-in-out whitespace-nowrap ${
                    words[currentWordIndex] === 'casinos' ? 'text-white' : 'text-primary'
                  } ${
                    isAnimating 
                      ? 'opacity-0 -translate-y-4 scale-95' 
                      : 'opacity-100 translate-y-0 scale-100'
                  }`}
                >
                  {words[currentWordIndex] === 'casinos' ? 'casinos' : `${words[currentWordIndex]} casinos`}
                </span>
                {words[currentWordIndex] !== 'casinos' && (
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary/30 transition-all duration-500"></span>
                )}
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Feature cards - Scrollable on mobile, grid on desktop */}
          <div className="overflow-x-auto lg:overflow-x-hidden overflow-y-hidden">
            <div className="flex lg:grid lg:grid-cols-2 gap-4 min-w-max lg:min-w-0 pb-2 lg:pb-0">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                    <Card
                      key={index}
                      className="group relative border-2 hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden bg-card flex-shrink-0 w-[280px] lg:w-auto"
                    >
                      <a href={feature.href} className="block">
                        <CardContent className="p-4 sm:p-5 lg:p-6">
                          <div className="flex items-start justify-between mb-2 sm:mb-3 lg:mb-4">
                            <div className="p-2 sm:p-2.5 lg:p-3 rounded-lg bg-primary/10 text-primary">
                              <Icon className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                            </div>
                            {feature.label && (
                              <Badge variant="default" className="font-bold text-xs sm:text-sm">
                                {feature.label}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <h3 className="text-foreground font-semibold text-xs sm:text-sm">
                              {feature.title}
                            </h3>
                            <ArrowRight className="text-muted-foreground w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                          </div>
                        </CardContent>
                      </a>
                    </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
