"use client";

import { useState, useMemo, memo, useEffect, Suspense } from "react";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
import { CasinoCard } from "@/components/ui/casino-card/index";
import { useGetAllCasinosQuery } from "@/app/lib/data-access/configs/casinos.config";
import type { Casino } from "@/app/lib/data-access/models/casino.model";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterSection } from "@/components/shared/FilterSection";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  getCasinoFilterCategories, 
  applyCasinoFilters,
  type AdvancedFilterState 
} from "@/lib/utils/filter-categories";
import { useCountryDetection } from "@/hooks/use-country-detection";
import { useAuth } from "@/context/auth.context";
import { getCachedCountries } from "@/lib/services/countries-api";

function CasinosPageContent() {
  const { data: casinos = [], isLoading } = useGetAllCasinosQuery();
  const { user, accessToken, hydrated } = useAuth();
  const { userCountry, countryName, isDetecting } = useCountryDetection();
  const [sortBy, setSortBy] = useState("recommended");
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterState>({});
  const [countryNameMap, setCountryNameMap] = useState<Record<string, string>>({});

  const isLoggedIn = hydrated && (accessToken || user);

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


  // Get advanced filter categories
  const advancedFilterCategories = useMemo(() => {
    return getCasinoFilterCategories(casinos);
  }, [casinos]);

  // Helper function to check if casino is available in user's country
  const isCasinoAvailableInCountry = (casino: Casino): boolean => {
    if (!userCountry) return false;
    
    const availableCountries = casino.availableCountries || [];
    const restrictedCountries = casino.restrictedCountries || [];
    
    // Check if user's country is restricted
    const isRestricted = restrictedCountries.some(country => {
      const normalizedCountry = country.toLowerCase().trim();
      const normalizedUserCountry = userCountry.toLowerCase().trim();
      const normalizedCountryName = countryNameMap[userCountry]?.toLowerCase().trim() || '';
      
      return normalizedCountry === normalizedUserCountry || 
             normalizedCountry === normalizedCountryName ||
             country.toLowerCase().includes(userCountry.toLowerCase()) ||
             country.toLowerCase().includes(countryNameMap[userCountry]?.toLowerCase() || '');
    });
    
    if (isRestricted) return false;
    
    // If no available countries specified, assume it's available (unless restricted)
    if (availableCountries.length === 0) return true;
    
    // Check if user's country is in available countries
    return availableCountries.some(country => {
      const normalizedCountry = country.toLowerCase().trim();
      const normalizedUserCountry = userCountry.toLowerCase().trim();
      const normalizedCountryName = countryNameMap[userCountry]?.toLowerCase().trim() || '';
      
      return normalizedCountry === normalizedUserCountry || 
             normalizedCountry === normalizedCountryName ||
             country.toLowerCase().includes(userCountry.toLowerCase()) ||
             country.toLowerCase().includes(countryNameMap[userCountry]?.toLowerCase() || '');
    });
  };

  const filteredCasinos = useMemo(() => {
    let filtered = casinos;

    // For logged-in users, filter by country automatically
    if (isLoggedIn && userCountry && !isDetecting) {
      filtered = filtered.filter((casino) => isCasinoAvailableInCountry(casino));
    }

    // Apply advanced filters
    const hasAdvancedFilters = Object.values(advancedFilters).some(filters => filters.length > 0);
    if (hasAdvancedFilters) {
      filtered = applyCasinoFilters(filtered, advancedFilters);
    }

    return filtered;
  }, [casinos, advancedFilters, isLoggedIn, userCountry, isDetecting, countryNameMap]);

  const sortedCasinos = useMemo(() => {
    const sorted = [...filteredCasinos];
    
    switch (sortBy) {
      case "recommended":
        return sorted.sort((a, b) => {
          const safetyDiff = (b.safetyIndex || 0) - (a.safetyIndex || 0);
          if (safetyDiff !== 0) return safetyDiff;
          return a.name.localeCompare(b.name);
        });
      case "safety-high":
        return sorted.sort((a, b) => (b.safetyIndex || 0) - (a.safetyIndex || 0));
      case "safety-low":
        return sorted.sort((a, b) => (a.safetyIndex || 0) - (b.safetyIndex || 0));
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
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
  }, [filteredCasinos, sortBy]);

  const sortOptions = useMemo(() => [
    { value: "recommended", label: "Recommended" },
    { value: "safety-high", label: "Safety: High to Low" },
    { value: "safety-low", label: "Safety: Low to High" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
  ], []);

  return (
    <div className="container py-3 px-3 sm:py-5 sm:px-5 mx-auto max-w-7xl">
      <PageHeader title="Casinos" />

      <FilterSection
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOptions={sortOptions}
        resultsCount={sortedCasinos.length}
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

      {!isLoading && sortedCasinos.length === 0 && (
        <div className="w-full text-center text-lg py-12 text-muted-foreground">
          No casinos found.
        </div>
      )}

      {!isLoading && sortedCasinos.length > 0 && (
        <div className="flex flex-col gap-4 sm:gap-6">
          {sortedCasinos.map((casino: Casino, index) => (
            <CasinoCard
              key={casino._id || index}
              casino={casino}
              onVisitCasino={() => {
                if (casino.visitUrl) window.open(casino.visitUrl, "_blank");
              }}
              onReadReview={() => {
                // Navigation handled by router.push in the button onClick
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CasinosPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <p>Loading casinos...</p>
      </div>
    }>
      <CasinosPageContent />
    </Suspense>
  );
}

export default memo(CasinosPage);
