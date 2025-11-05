"use client";

import { useState, useMemo, memo, Suspense } from "react";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
import { CasinoBonusCard } from "@/components/ui/casino-bonus-card";
import { useGetAllBonusesQuery } from "@/app/lib/data-access/configs/bonuses.config";
import type { Bonus } from "@/app/lib/data-access/models/bonus.model";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterSection } from "@/components/shared/FilterSection";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth.context";
import { useI18n } from "@/context/i18n.context";
import { useEmailCampaign } from "@/hooks/use-email-campaign";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  getBonusFilterCategories, 
  applyBonusFilters,
  type AdvancedFilterState 
} from "@/lib/utils/filter-categories";
import { useCountryDetection } from "@/hooks/use-country-detection";
import { getCachedCountries } from "@/lib/services/countries-api";
import { useEffect } from "react";

const extractCasinoName = (title: string) => {
  const parts = title.split("-");
  return parts.length > 1 ? parts[parts.length - 1].trim() : "Casino";
};

const extractBonusType = (type: string) => {
  // Handle various bonus type formats
  const normalizedType = type?.toLowerCase().trim();
  if (normalizedType === "no-deposit" || normalizedType === "no deposit" || normalizedType === "nodeposit") {
    return "no-deposit";
  }
  if (normalizedType === "deposit") {
    return "deposit";
  }
  if (normalizedType === "cashback" || normalizedType === "cash back") {
    return "cashback";
  }
  if (normalizedType === "other" || normalizedType === "others") {
    return "other";
  }
  // Return the original type if it doesn't match known types
  return type || "other";
};

function BonusesPageContent() {
  const { data: bonuses = [], isLoading } = useGetAllBonusesQuery();
  const { user, accessToken, hydrated } = useAuth();
  const { t } = useI18n();
  const { isFromCampaign } = useEmailCampaign();
  const { userCountry, isDetecting } = useCountryDetection();
  const [sortBy, setSortBy] = useState("recommended");
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterState>({});
  const [countryNameMap, setCountryNameMap] = useState<Record<string, string>>({});
  
  const isLoggedIn = hydrated && (accessToken || user);
  // Allow access if logged in OR from valid campaign
  const canAccessBonuses = isLoggedIn || isFromCampaign;

  // Load country name mapping
  useEffect(() => {
    const loadCountryNames = async () => {
      try {
        const countries = await getCachedCountries();
        const map: Record<string, string> = {};
        countries.forEach(c => {
          map[c.code] = c.name;
        });
        setCountryNameMap(map);
      } catch (error) {
        console.error('Failed to load country names:', error);
      }
    };
    loadCountryNames();
  }, []);

  // Get filter categories
  const filterCategories = useMemo(() => {
    return getBonusFilterCategories(bonuses);
  }, [bonuses]);

  // Helper function to check if bonus's casino is available in user's country
  // If a bonus is assigned to a casino that is available in a country, the bonus is also available
  const isBonusAvailableInCountry = (bonus: Bonus): boolean => {
    if (!userCountry) return true; // If no country detected, show all bonuses
    
    // If bonus has no casino reference, show it (can't determine availability, so show to be safe)
    if (!bonus.casino) return true;
    
    // If casino is populated (object), check its availability
    if (typeof bonus.casino === 'object' && bonus.casino !== null) {
      const casino = bonus.casino as any;
      const availableCountries: string[] = Array.isArray(casino.availableCountries) ? casino.availableCountries : [];
      const restrictedCountries: string[] = Array.isArray(casino.restrictedCountries) ? casino.restrictedCountries : [];
      
      // Normalize user's country for matching
      const normalizedUserCountry = userCountry.toLowerCase().trim();
      const normalizedCountryName = countryNameMap[userCountry]?.toLowerCase().trim() || '';
      
      // Check if user's country is restricted
      if (restrictedCountries.length > 0) {
        const isRestricted = restrictedCountries.some((country: string) => {
          if (!country) return false;
          const normalizedCountry = country.toLowerCase().trim();
          
          // Match by exact code, name, or partial match
          return normalizedCountry === normalizedUserCountry || 
                 normalizedCountry === normalizedCountryName ||
                 (normalizedCountryName && normalizedCountry === normalizedCountryName) ||
                 normalizedCountry.includes(normalizedUserCountry) ||
                 normalizedUserCountry.includes(normalizedCountry) ||
                 (normalizedCountryName && (normalizedCountry.includes(normalizedCountryName) || normalizedCountryName.includes(normalizedCountry)));
        });
        
        if (isRestricted) return false;
      }
      
      // If no available countries specified, assume it's available (unless restricted)
      if (availableCountries.length === 0) return true;
      
      // Check if user's country is in available countries
      return availableCountries.some((country: string) => {
        if (!country) return false;
        const normalizedCountry = country.toLowerCase().trim();
        
        // Match by exact code, name, or partial match
        return normalizedCountry === normalizedUserCountry || 
               normalizedCountry === normalizedCountryName ||
               (normalizedCountryName && normalizedCountry === normalizedCountryName) ||
               normalizedCountry.includes(normalizedUserCountry) ||
               normalizedUserCountry.includes(normalizedCountry) ||
               (normalizedCountryName && (normalizedCountry.includes(normalizedCountryName) || normalizedCountryName.includes(normalizedCountry)));
      });
    }
    
    // If casino is just an ID (string), show it (can't determine availability without casino data)
    // This shouldn't happen if backend populates correctly, but show it to be safe
    return true;
  };

  const filteredByType = useMemo(() => {
    let filtered = bonuses;

    // For logged-in users, filter by country automatically
    if (isLoggedIn && userCountry && !isDetecting) {
      filtered = filtered.filter((bonus) => isBonusAvailableInCountry(bonus));
    }

    // Apply advanced filters
    const hasAdvancedFilters = Object.values(advancedFilters).some(filters => filters.length > 0);
    if (hasAdvancedFilters) {
      filtered = applyBonusFilters(filtered, advancedFilters);
    }

    return filtered;
  }, [bonuses, advancedFilters, isLoggedIn, userCountry, isDetecting, countryNameMap]);

  const sortedBonuses = useMemo(() => {
    const sorted = [...filteredByType];
    
    // Helper function to extract numeric value from price or bonusValue
    const extractNumericValue = (bonus: Bonus): number => {
      // Try to extract from bonusValue first
      if (bonus.bonusValue?.value) {
        const match = bonus.bonusValue.value.match(/(\d+(?:\.\d+)?)/);
        if (match) return parseFloat(match[1]);
      }
      // Fallback to price
      if (bonus.price) {
        const match = bonus.price.match(/(\d+(?:\.\d+)?)/);
        if (match) return parseFloat(match[1]);
      }
      return 0;
    };
    
    switch (sortBy) {
      case "recommended":
        return sorted.sort((a, b) => {
          // Sort by rating (high to low), then by safety index, then by name
          const ratingDiff = (b.rating || 0) - (a.rating || 0);
          if (ratingDiff !== 0) return ratingDiff;
          const safetyDiff = (b.safetyIndex || 0) - (a.safetyIndex || 0);
          if (safetyDiff !== 0) return safetyDiff;
          return a.title.localeCompare(b.title);
        });
      case "highest":
        return sorted.sort((a, b) => {
          const valueA = extractNumericValue(a);
          const valueB = extractNumericValue(b);
          if (valueB !== valueA) return valueB - valueA;
          return a.title.localeCompare(b.title);
        });
      case "lowest":
        return sorted.sort((a, b) => {
          const valueA = extractNumericValue(a);
          const valueB = extractNumericValue(b);
          if (valueA !== valueB) return valueA - valueB;
          return a.title.localeCompare(b.title);
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
  }, [filteredByType, sortBy]);

  const sortOptions = [
    { value: "recommended", label: "Recommended" },
    { value: "highest", label: "Highest Value" },
    { value: "lowest", label: "Lowest Value" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
  ];

  // Show login prompt if not logged in and not from campaign
  if (hydrated && !canAccessBonuses) {
    return (
      <div className="container py-5 px-5 mx-auto max-w-7xl">
        <PageHeader title={t('bonuses.title')} />
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-foreground">
              {t('bonuses.loginRequired')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-md">
              {t('bonuses.loginPrompt')}
            </p>
          </div>
          <Link href="/login">
            <Button size="lg">
              {t('bonuses.loginButton')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 px-5 mx-auto max-w-7xl">
      <PageHeader title={t('bonuses.title')} />

      <FilterSection
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOptions={sortOptions}
        resultsCount={sortedBonuses.length}
        filterCategories={filterCategories}
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

      {!isLoading && canAccessBonuses && sortedBonuses.length > 0 && (
        <div className="flex flex-col gap-6">
          {sortedBonuses.map((bonus: Bonus, index) => (
            <CasinoBonusCard
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

export default function BonusesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <p>Loading bonuses...</p>
      </div>
    }>
      <BonusesPageContent />
    </Suspense>
  );
}
