'use client';

import { memo } from 'react';
import Link from 'next/link';
import { ArrowRight, Coins, Dices, Newspaper, ShieldCheck, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/context/i18n.context';
import { RotatingWord } from '@/components/shared/rotating-word';
import { PremiumCard } from '@/components/shared/premium-card';
import { Reveal } from '@/components/shared/reveal';
import type { LucideIcon } from 'lucide-react';

const ROTATING_KEYS = [
  'hero.phraseSafe',
  'hero.phraseTrusted',
  'hero.phraseBest',
  'hero.phraseTopRated',
] as const;

interface FeatureItem {
  icon: LucideIcon;
  badge?: string;
  titleKey: string;
  href: string;
}

const FEATURES: FeatureItem[] = [
  { icon: Dices,     badge: 'FREE', titleKey: 'games.freeCasinoGames',  href: '/games' },
  { icon: Star,                     titleKey: 'games.casinoReviews',    href: '/bonuses' },
  { icon: Newspaper,                titleKey: 'games.latestNews',       href: '/news' },
  { icon: Coins,                    titleKey: 'games.realMoneyCasinos', href: '/casinos' },
];

export const HeroSection = memo(function HeroSection() {
  const { t } = useI18n();
  const words = ROTATING_KEYS.map((k) => t(k));

  return (
    <section className="relative overflow-hidden py-14 sm:py-20 lg:py-28 px-4">
      <HeroBackground />

      <div className="relative container mx-auto max-w-7xl">
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px] gap-10 lg:gap-16 items-center">

          {/* Headline */}
          <div className="space-y-6 sm:space-y-8 max-w-2xl w-full">
            <Reveal direction="up">
              <TrustBadge label={t('hero.trustedBadge')} />
            </Reveal>

            <Reveal direction="up" delay={80}>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] break-words">
                <span className="block">{t('hero.title')}</span>
                <span className="block min-h-[1.05em]">
                  <RotatingWord words={words} className="gradient-text" />
                </span>
              </h1>
            </Reveal>

            <Reveal direction="up" delay={160}>
              <p className="text-muted-foreground text-base sm:text-lg lg:text-xl leading-relaxed">
                {t('hero.subtitle')}
              </p>
            </Reveal>

            <Reveal direction="up" delay={240}>
              <div className="flex flex-wrap gap-3 pt-1">
                <Button size="lg" className="shadow-lg shadow-primary/20 gap-2 group/cta" asChild>
                  <Link href="/casinos">
                    {t('common.getStarted')}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-0.5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/bonuses">{t('hero.viewBonuses')}</Link>
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Feature cards */}
          <Reveal direction="up" delay={320} className="w-full">
            <div className="grid grid-cols-2 gap-3">
              {FEATURES.map((f) => (
                <FeatureCard key={f.titleKey} {...f} title={t(f.titleKey)} explore={t('common.explore')} />
              ))}
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
});

function HeroBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_40%,_oklch(0.637_0.237_25.331_/_0.13)_0%,_transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_15%_80%,_oklch(0.637_0.237_25.331_/_0.07)_0%,_transparent_70%)]" />
      <div className="absolute top-12 right-8 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none animate-float-glow" />
      <div className="absolute bottom-8 left-4 w-48 h-48 rounded-full bg-orange-400/5 blur-3xl pointer-events-none" />
    </>
  );
}

function TrustBadge({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/25 bg-primary/8 text-primary text-xs sm:text-sm font-semibold">
      <ShieldCheck className="w-3.5 h-3.5" />
      {label}
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  badge,
  title,
  href,
  explore,
}: FeatureItem & { title: string; explore: string }) {
  return (
    <PremiumCard href={href} withTopGlow={false} className="p-5 backdrop-blur-sm bg-card/70">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        {badge && (
          <span className="px-2 py-0.5 text-[10px] font-bold bg-primary text-primary-foreground rounded-full tracking-wide">
            {badge}
          </span>
        )}
      </div>

      <p className="font-semibold text-foreground text-sm leading-snug">{title}</p>

      <div className="mt-2.5 flex items-center gap-1 text-primary text-xs font-medium
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span>{explore}</span>
        <ArrowRight className="w-3 h-3" />
      </div>
    </PremiumCard>
  );
}
