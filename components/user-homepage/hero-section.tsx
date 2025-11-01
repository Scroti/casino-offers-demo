'use client';

import { memo } from 'react';
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
    <section className="relative py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Helping you find{' '}
              <span className="text-primary relative inline-block">
                safe
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary/30"></span>
              </span>
              {' '}casinos
            </h1>
            <p className="text-muted-foreground text-lg">
              Since 1995, we&apos;ve been helping players find their perfect casinos.
              Explore our expert reviews, smart tools, and trusted guides, and
              play with confidence.
            </p>
          </div>

          {/* Right side - Feature cards */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group relative border-2 hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden bg-card"
                >
                  <a href={feature.href} className="block">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-lg bg-primary/10 text-primary">
                          <Icon className="w-6 h-6" />
                        </div>
                        {feature.label && (
                          <Badge variant="default" className="font-bold">
                            {feature.label}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-foreground font-semibold text-sm">
                          {feature.title}
                        </h3>
                        <ArrowRight className="text-muted-foreground w-5 h-5 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                      </div>
                    </CardContent>
                  </a>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
});
