'use client';

import { memo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Coins, Crown, Gem, Heart, Sparkles, Star, Target, Trophy, Zap,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/context/i18n.context';
import { Section } from '@/components/shared/section';
import { SectionHeader } from '@/components/shared/section-header';
import { PremiumCard } from '@/components/shared/premium-card';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  labelKey: string;
  icon: LucideIcon;
}

interface CategoryItem {
  nameKey: string;
  icon: LucideIcon;
  descKey: string;
  count: string;
  tagKey: string;
}

const TABS: TabItem[] = [
  { id: 'casino-games',    labelKey: 'games.casinoGames',    icon: Zap },
  { id: 'live-games',      labelKey: 'games.liveGames',       icon: Target },
  { id: 'payment-methods', labelKey: 'games.paymentMethods',  icon: Coins },
  { id: 'bonuses',         labelKey: 'bonuses.title',          icon: Trophy },
];

const CATEGORIES: CategoryItem[] = [
  { nameKey: 'games.slots',     icon: Zap,      descKey: 'games.spinTheReels',     count: '500+', tagKey: 'games.mostPopular' },
  { nameKey: 'games.roulette',  icon: Target,   descKey: 'games.betOnLuckyNumber', count: '50+',  tagKey: 'games.classic' },
  { nameKey: 'games.blackjack', icon: Heart,    descKey: 'games.beatTheDealer',    count: '30+',  tagKey: 'games.strategic' },
  { nameKey: 'games.poker',     icon: Crown,    descKey: 'games.masterPoker',      count: '100+', tagKey: 'games.skillBased' },
  { nameKey: 'games.baccarat',  icon: Gem,      descKey: 'games.simpleYetElegant', count: '20+',  tagKey: 'games.elegant' },
  { nameKey: 'games.sicBo',     icon: Sparkles, descKey: 'games.rollTheDice',      count: '15+',  tagKey: 'games.exciting' },
];

export const GameCategoriesSection = memo(function GameCategoriesSection() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  return (
    <Section background="muted">
      <SectionHeader
        eyebrow={{ icon: Star, text: t('games.exploreByCategory') }}
        title={
          <>
            {t('games.discoverGamingExperience')}{' '}
            <span className="gradient-text">{t('games.gamingExperience')}</span>
          </>
        }
        cta={{ label: t('games.seeAllCasinoGames'), href: '/games' }}
      />

      <TabBar
        tabs={TABS.map((tab) => ({ ...tab, label: t(tab.labelKey) }))}
        activeId={activeTab}
        onChange={setActiveTab}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-10">
        {CATEGORIES.map((cat) => (
          <CategoryCard
            key={cat.nameKey}
            icon={cat.icon}
            name={t(cat.nameKey)}
            description={t(cat.descKey)}
            countLabel={`${cat.count} ${t('games.games')}`}
            tag={t(cat.tagKey)}
          />
        ))}
      </div>

      <div className="text-center">
        <Button size="lg" className="shadow-lg shadow-primary/20 gap-2" asChild>
          <Link href="/games">
            <Sparkles className="w-4 h-4" />
            {t('games.exploreAllCasinoGames')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </Section>
  );
});

function TabBar({
  tabs,
  activeId,
  onChange,
}: {
  tabs: Array<TabItem & { label: string }>;
  activeId: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-8 sm:mb-10">
      {tabs.map(({ id, label, icon: Icon }) => {
        const active = activeId === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
              'border transition-all duration-200',
              active
                ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
                : 'bg-card text-muted-foreground border-border/60 hover:border-primary/40 hover:text-foreground',
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

function CategoryCard({
  icon: Icon,
  name,
  description,
  countLabel,
  tag,
}: {
  icon: LucideIcon;
  name: string;
  description: string;
  countLabel: string;
  tag: string;
}) {
  return (
    <PremiumCard className="p-4 text-center cursor-pointer">
      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3
                      group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
        <Icon className="w-5 h-5" />
      </div>

      <h4 className="font-semibold text-foreground text-xs sm:text-sm mb-1">{name}</h4>
      <p className="text-[11px] text-muted-foreground mb-3 line-clamp-2">{description}</p>

      <div className="space-y-1">
        <div className="text-[10px] font-bold text-primary bg-primary/8 rounded-full px-2 py-0.5">
          {countLabel}
        </div>
        <div className="text-[10px] text-muted-foreground border border-border/50 rounded-full px-2 py-0.5">
          {tag}
        </div>
      </div>
    </PremiumCard>
  );
}
