'use client';

import { memo } from 'react';
import { Award, FileText, Smartphone, TrendingUp, type LucideIcon } from 'lucide-react';
import { appConfig } from '@/components/configs/appConfig';
import { useI18n } from '@/context/i18n.context';
import { Section } from '@/components/shared/section';
import { SectionHeader } from '@/components/shared/section-header';
import { PremiumCard } from '@/components/shared/premium-card';

interface FeatureItem {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  accent: string;
}

interface StatItem {
  value: string;
  labelKey: string;
}

const FEATURES: FeatureItem[] = [
  { icon: Award,      titleKey: 'homepage.helpingPlayers', descKey: 'homepage.helpingPlayersDesc', accent: 'from-primary/20 to-orange-400/10' },
  { icon: FileText,   titleKey: 'homepage.expertWriters',  descKey: 'homepage.expertWritersDesc',  accent: 'from-orange-400/20 to-primary/10' },
  { icon: Smartphone, titleKey: 'homepage.reviewProcess',  descKey: 'homepage.reviewProcessDesc',  accent: 'from-primary/15 to-orange-300/10' },
];

const STATS: StatItem[] = [
  { value: '1M+',   labelKey: 'homepage.playersPerWeek' },
  { value: '100+',  labelKey: 'homepage.countriesServed' },
  { value: '$37M+', labelKey: 'homepage.winningsClaimed' },
  { value: '4.4★',  labelKey: 'homepage.starRating' },
];

export const WhyChooseUsSection = memo(function WhyChooseUsSection() {
  const { t } = useI18n();
  const appName = appConfig.branding.AppName;

  return (
    <Section className="py-12 sm:py-16 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,_oklch(0.637_0.237_25.331_/_0.06)_0%,_transparent_70%)] pointer-events-none" />

      <SectionHeader
        align="center"
        eyebrow={{ icon: TrendingUp, text: `${t('homepage.whyUse')} ${appName}` }}
        title={
          <>
            <span className="gradient-text-subtle">{t('homepage.whyUse')}</span>{' '}
            <span className="gradient-text">{appName}</span>?
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-16 sm:mb-20">
        {FEATURES.map(({ icon, titleKey, descKey, accent }) => (
          <FeatureCard
            key={titleKey}
            icon={icon}
            title={t(titleKey)}
            description={t(descKey)}
            accent={accent}
          />
        ))}
      </div>

      <StatsRow stats={STATS.map((s) => ({ value: s.value, label: t(s.labelKey) }))} />
    </Section>
  );
});

function FeatureCard({
  icon: Icon,
  title,
  description,
  accent,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
}) {
  return (
    <PremiumCard className="p-7">
      <div
        aria-hidden
        className={`absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${accent} blur-2xl
                    opacity-60 group-hover:opacity-100 transition-opacity`}
      />
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-primary/12 text-primary flex items-center justify-center mb-5
                        group-hover:bg-primary/20 transition-colors">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-base sm:text-lg text-foreground mb-2.5">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </PremiumCard>
  );
}

function StatsRow({ stats }: { stats: Array<{ value: string; label: string }> }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border/40">
        {stats.map((s) => (
          <div key={s.label} className="p-6 sm:p-8 text-center hover:bg-primary/4 transition-colors">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold gradient-text mb-1.5">
              {s.value}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground font-medium">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
