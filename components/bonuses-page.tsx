"use client";

import { useState, useMemo, Suspense } from "react";
import { TranslatedBonusCard } from "@/components/ui/translated-bonus-card";
import { useGetAllBonusesQuery } from "@/app/lib/data-access/configs/bonuses.config";
import type { Bonus } from "@/app/lib/data-access/models/bonus.model";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterSection } from "@/components/shared/FilterSection";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  getBonusFilterCategories, 
  applyBonusFilters,
  type AdvancedFilterState 
} from "@/lib/utils/filter-categories";
import { useI18n } from "@/context/i18n.context";

interface BonusesPageProps {
  filter?: string;
}

function BonusesPageContent({ filter }: BonusesPageProps) {
  const { t } = useI18n();
  const { data: bonuses = [], isLoading } = useGetAllBonusesQuery();
  const [sortBy, setSortBy] = useState("recommended");
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterState>({});

  // Get advanced filter categories
  const advancedFilterCategories = useMemo(() => {
    return getBonusFilterCategories(bonuses);
  }, [bonuses]);

  // Apply advanced filters
  const filteredBonuses = useMemo(() => {
    let filtered = bonuses;

    // Apply quick filter if provided
    if (filter) {
      if (filter === "no-deposit" || filter === "deposit" || filter === "cashback") {
        filtered = filtered.filter((b) => b.type === filter);
      } else if (filter === "exclusive") {
        filtered = filtered.filter((b) => b.isExclusive);
      }
    }

    // Apply advanced filters
    const hasAdvancedFilters = Object.values(advancedFilters).some(filters => filters.length > 0);
    if (hasAdvancedFilters) {
      filtered = applyBonusFilters(filtered, advancedFilters);
    }

    return filtered;
  }, [bonuses, advancedFilters, filter]);

  // Extract casino name from title (assuming format like "200 FREE SPINS on Book of Wealth - SpinBetter")
  const sortedBonuses = useMemo(() => {
    const sorted = [...filteredBonuses];
    
    switch (sortBy) {
      case "recommended":
        return sorted.sort((a, b) => {
          const ratingDiff = (b.rating || 0) - (a.rating || 0);
          if (ratingDiff !== 0) return ratingDiff;
          const safetyDiff = (b.safetyIndex || 0) - (a.safetyIndex || 0);
          if (safetyDiff !== 0) return safetyDiff;
          return a.title.localeCompare(b.title);
        });
      case "highest":
        return sorted.sort((a, b) => {
          const priceA = parseFloat(a.price?.replace(/[^0-9.]/g, '') || '0');
          const priceB = parseFloat(b.price?.replace(/[^0-9.]/g, '') || '0');
          return priceB - priceA;
        });
      case "lowest":
        return sorted.sort((a, b) => {
          const priceA = parseFloat(a.price?.replace(/[^0-9.]/g, '') || '0');
          const priceB = parseFloat(b.price?.replace(/[^0-9.]/g, '') || '0');
          return priceA - priceB;
        });
      case "newest":
        return sorted.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
      case "oldest":
        return sorted.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateA - dateB;
        });
      default:
        return sorted;
    }
  }, [filteredBonuses, sortBy]);

  const sortOptions = useMemo(() => [
    { value: "recommended", label: t('bonuses.recommended') },
    { value: "highest", label: t('bonuses.highestValue') },
    { value: "lowest", label: t('bonuses.lowestValue') },
    { value: "newest", label: t('bonuses.newest') },
    { value: "oldest", label: t('bonuses.oldest') },
  ], [t]);

  const extractCasinoName = (title: string) => {
    const parts = title.split("-");
    return parts.length > 1 ? parts[parts.length - 1].trim() : "Casino";
  };

  const extractBonusType = (type: string) => {
    if (type === "no-deposit") return "no-deposit";
    if (type === "deposit") return "deposit";
    return "cashback";
  };

  return (
    <div className="container py-3 px-3 sm:py-5 sm:px-5 mx-auto max-w-7xl">
      <PageHeader title={t('bonuses.title')} />

      <FilterSection
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOptions={sortOptions}
        resultsCount={sortedBonuses.length}
        filterCategories={advancedFilterCategories}
        activeFilters={advancedFilters}
        onFilterChange={setAdvancedFilters}
      />

      {isLoading && (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      )}

      {!isLoading && sortedBonuses.length === 0 && (
        <div className="w-full text-center text-lg py-12 text-muted-foreground">
          {t('bonuses.noBonuses')}
        </div>
      )}

      {!isLoading && sortedBonuses.length > 0 && (
        <div className="flex flex-col gap-6">
          {sortedBonuses.map((bonus: Bonus, index) => (
            <TranslatedBonusCard
              key={bonus._id || index}
              bonusType={extractBonusType(bonus.type)}
              title={bonus.title}
              description={bonus.description}
              isExclusive={bonus.isExclusive}
              casinoName={bonus.casinoName || extractCasinoName(bonus.title)}
              casinoImage={bonus.casinoImage}
              safetyIndex={bonus.safetyIndex}
              countryFlag={bonus.countryFlag}
              countryCode={bonus.countryCode}
              promoCode={bonus.promoCode}
              bonusInstructions={bonus.bonusInstructions}
              reviewLink={bonus.reviewLink}
              href={bonus.href}
              wageringRequirement={bonus.wageringRequirement}
              bonusValue={bonus.bonusValue}
              maxBet={bonus.maxBet}
              expiration={bonus.expiration}
              claimSpeed={bonus.claimSpeed}
              termsConditions={bonus.termsConditions}
              customSections={bonus.customSections}
              onGetBonus={() => {
                window.open(bonus.href || "#", "_blank");
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BonusesPage({ filter }: BonusesPageProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <p>{t('bonuses.loading')}</p>
      </div>
    }>
      <BonusesPageContent filter={filter} />
    </Suspense>
  );
}
