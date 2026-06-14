'use client';

import { memo, useMemo } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetAllCasinosQuery } from '@/app/lib/data-access/configs/casinos.config';
import { useGetAllBonusesQuery } from '@/app/lib/data-access/configs/bonuses.config';
import type { Casino } from '@/app/lib/data-access/models/casino.model';
import type { Bonus } from '@/app/lib/data-access/models/bonus.model';
import { useI18n } from '@/context/i18n.context';
import { Section } from '@/components/shared/section';
import { SectionHeader } from '@/components/shared/section-header';
import { PremiumCard } from '@/components/shared/premium-card';
import { SafeImage } from '@/components/shared/safe-image';

const MAX_CARDS = 4;

interface CasinoBonusPair {
  casino: Casino;
  bonus: Bonus | undefined;
}

function bonusBelongsToCasino(bonus: Bonus, casinoId?: string): boolean {
  if (!casinoId) return false;
  const ref = bonus.casino;
  if (ref && typeof ref === 'object') return (ref as { _id?: string })._id === casinoId;
  return ref === casinoId;
}

function pickBonusFor(casino: Casino, bonuses: Bonus[]): Bonus | undefined {
  const matches = bonuses.filter((b) => bonusBelongsToCasino(b, casino._id));
  if (matches.length === 0) return undefined;
  return matches[Math.floor(Math.random() * matches.length)];
}

export const CasinoBonusesSection = memo(function CasinoBonusesSection() {
  const { t } = useI18n();
  const { data: casinos = [], isLoading } = useGetAllCasinosQuery();
  const { data: bonuses = [] } = useGetAllBonusesQuery();

  const pairs = useMemo<CasinoBonusPair[]>(() => {
    if (isLoading || casinos.length === 0) return [];
    return casinos
      .map((casino) => ({ casino, bonus: pickBonusFor(casino, bonuses) }))
      .filter((p) => p.bonus)
      .slice(0, MAX_CARDS);
  }, [casinos, bonuses, isLoading]);

  return (
    <Section background="muted">
      <SectionHeader
        eyebrow={{ icon: Sparkles, text: t('common.topPicks') }}
        title={
          <>
            <span className="gradient-text-subtle">{t('casinos.title')}</span>{' '}
            <span className="gradient-text">{t('bonuses.title')}</span>
          </>
        }
        cta={{ label: t('common.viewAll'), href: '/bonuses' }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: MAX_CARDS }).map((_, i) => <SkeletonCard key={i} />)
          : pairs.length === 0
            ? <EmptyState message={t('bonuses.noBonuses')} />
            : pairs.map(({ casino, bonus }) => (
                <BonusCard
                  key={casino._id}
                  casino={casino}
                  bonus={bonus}
                  fallbackBonusTitle={t('bonuses.welcomeBonus')}
                  ctaLabel={t('common.claimBonus')}
                />
              ))}
      </div>
    </Section>
  );
});

function BonusCard({
  casino,
  bonus,
  fallbackBonusTitle,
  ctaLabel,
}: {
  casino: Casino;
  bonus: Bonus | undefined;
  fallbackBonusTitle: string;
  ctaLabel: string;
}) {
  const logo = casino.logo || casino.image;
  const reviewLink = casino.reviewUrl || (casino._id ? `/casinos/${casino._id}/review` : '#');

  return (
    <PremiumCard className="p-5 flex flex-col items-center text-center gap-4">
      <CasinoLogo src={logo} alt={casino.name} />

      <div className="flex-1 space-y-1">
        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
          {casino.name}
        </p>
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-foreground">
          {bonus?.title || fallbackBonusTitle}
        </h3>
        {bonus?.price && (
          <p className="text-primary font-bold text-base">{bonus.price}</p>
        )}
      </div>

      <Button
        className="w-full text-xs sm:text-sm bg-primary/10 text-primary border border-primary/25
                   hover:bg-primary hover:text-primary-foreground hover:border-primary
                   transition-all duration-200"
        asChild
      >
        <Link href={reviewLink}>{ctaLabel}</Link>
      </Button>
    </PremiumCard>
  );
}

function CasinoLogo({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="relative mt-1">
      <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl border border-border/60 bg-background
                      flex items-center justify-center shadow-sm overflow-hidden p-2">
        <SafeImage src={src} alt={alt} className="w-full h-full object-contain" />
      </div>
      <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background" />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-4">
      <div className="w-16 h-16 rounded-xl skeleton mx-auto" />
      <div className="space-y-2">
        <div className="h-3 skeleton rounded w-3/4 mx-auto" />
        <div className="h-3 skeleton rounded w-1/2 mx-auto" />
      </div>
      <div className="h-9 skeleton rounded-lg" />
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="col-span-full text-center py-12 text-muted-foreground">
      {message}
    </div>
  );
}
