import type { Casino } from "@/app/lib/data-access/models/casino.model";
import type { Bonus } from "@/app/lib/data-access/models/bonus.model";
import type { FilterCategory } from "@/components/shared/AdvancedFilterModal";

/**
 * Extract unique values from casino arrays for filtering
 */
export function extractUniqueValues<T>(
  casinos: Casino[],
  getValue: (casino: Casino) => T[] | undefined
): string[] {
  const values = new Set<string>();
  casinos.forEach((casino) => {
    const items = getValue(casino);
    if (items && Array.isArray(items)) {
      items.forEach((item) => {
        if (typeof item === "string" && item.trim()) {
          values.add(item.trim());
        }
      });
    }
  });
  return Array.from(values).sort();
}

/**
 * Get filter categories for casinos
 */
export function getCasinoFilterCategories(casinos: Casino[]): FilterCategory[] {
  const paymentMethods = extractUniqueValues(casinos, (c) => c.depositMethods);
  const gameProviders = extractUniqueValues(casinos, (c) => c.gameProviders);
  const currencies = extractUniqueValues(casinos, (c) => c.currencies);
  const languages = extractUniqueValues(casinos, (c) => c.siteLanguages);
  const licenses = extractUniqueValues(casinos, (c) => (c.license ? [c.license] : undefined));
  
  // Safety Index ranges
  const safetyRanges = [
    { id: "safety-9-10", label: "9.0 - 10.0 (Excellent)" },
    { id: "safety-8-9", label: "8.0 - 8.9 (Very Good)" },
    { id: "safety-7-8", label: "7.0 - 7.9 (Good)" },
    { id: "safety-6-7", label: "6.0 - 6.9 (Fair)" },
    { id: "safety-0-6", label: "Below 6.0 (Poor)" },
  ];

  // Wagering ranges
  const wageringOptions = [
    { id: "wagering-0-20", label: "0x - 20x" },
    { id: "wagering-21-30", label: "21x - 30x" },
    { id: "wagering-31-40", label: "31x - 40x" },
    { id: "wagering-41-50", label: "41x - 50x" },
    { id: "wagering-50+", label: "50x+" },
  ];

  const categories: FilterCategory[] = [
    {
      id: "safety-index",
      label: "Safety Index",
      options: safetyRanges,
    },
    {
      id: "payment-methods",
      label: "Payment Methods",
      options: paymentMethods.map((method) => ({
        id: `payment-${method}`,
        label: method,
        value: method,
      })),
    },
    {
      id: "game-providers",
      label: "Game Providers",
      options: gameProviders.map((provider) => ({
        id: `provider-${provider}`,
        label: provider,
        value: provider,
      })),
    },
    {
      id: "currencies",
      label: "Currencies",
      options: currencies.map((currency) => ({
        id: `currency-${currency}`,
        label: currency,
        value: currency,
      })),
    },
    {
      id: "languages",
      label: "Languages",
      options: languages.map((language) => ({
        id: `language-${language}`,
        label: language,
        value: language,
      })),
    },
    {
      id: "wagering",
      label: "Wagering Requirements",
      options: wageringOptions,
    },
    {
      id: "features",
      label: "Features",
      options: [
        { id: "mobile-app", label: "Mobile Application" },
        { id: "sports-betting", label: "Sports Betting" },
        { id: "live-betting", label: "Live Betting" },
        { id: "virtual-sports", label: "Virtual Sports Betting" },
        { id: "withdraw-active-bonus", label: "Withdraw with Active Bonus" },
      ],
    },
    {
      id: "licenses",
      label: "Licenses",
      options: licenses.map((license) => ({
        id: `license-${license}`,
        label: license,
        value: license,
      })),
    },
  ].filter((category) => category.options.length > 0); // Only show categories with options

  return categories;
}

/**
 * Get filter categories for bonuses
 */
export function getBonusFilterCategories(bonuses: Bonus[]): FilterCategory[] {
  // Extract unique bonus types
  const types = new Set<string>();
  bonuses.forEach((bonus) => {
    if (bonus.type) types.add(bonus.type);
  });

  // Safety Index ranges
  const safetyRanges = [
    { id: "safety-9-10", label: "9.0 - 10.0 (Excellent)" },
    { id: "safety-8-9", label: "8.0 - 8.9 (Very Good)" },
    { id: "safety-7-8", label: "7.0 - 7.9 (Good)" },
    { id: "safety-6-7", label: "6.0 - 6.9 (Fair)" },
    { id: "safety-0-6", label: "Below 6.0 (Poor)" },
  ];

  // Rating ranges
  const ratingRanges = [
    { id: "rating-4-5", label: "4.0 - 5.0 (Excellent)" },
    { id: "rating-3-4", label: "3.0 - 3.9 (Good)" },
    { id: "rating-2-3", label: "2.0 - 2.9 (Fair)" },
    { id: "rating-0-2", label: "Below 2.0 (Poor)" },
  ];

  const categories: FilterCategory[] = [
    {
      id: "type",
      label: "Bonus Type",
      options: Array.from(types).map((type) => ({
        id: `type-${type}`,
        label: type.charAt(0).toUpperCase() + type.slice(1).replace("-", " "),
        value: type,
      })),
    },
    {
      id: "safety-index",
      label: "Safety Index",
      options: safetyRanges,
    },
    {
      id: "rating",
      label: "Rating",
      options: ratingRanges,
    },
    {
      id: "features",
      label: "Features",
      options: [
        { id: "exclusive", label: "Exclusive Bonuses" },
      ],
    },
  ].filter((category) => category.options.length > 0);

  return categories;
}

/**
 * Apply casino filters
 */
export function applyCasinoFilters(
  casinos: Casino[],
  filters: Record<string, string[]>
): Casino[] {
  return casinos.filter((casino) => {
    // Safety Index
    if (filters["safety-index"]?.length > 0) {
      const safetyIndex = casino.safetyIndex || 0;
      const matches = filters["safety-index"].some((range) => {
        if (range === "safety-9-10") return safetyIndex >= 9.0 && safetyIndex <= 10.0;
        if (range === "safety-8-9") return safetyIndex >= 8.0 && safetyIndex < 9.0;
        if (range === "safety-7-8") return safetyIndex >= 7.0 && safetyIndex < 8.0;
        if (range === "safety-6-7") return safetyIndex >= 6.0 && safetyIndex < 7.0;
        if (range === "safety-0-6") return safetyIndex < 6.0;
        return false;
      });
      if (!matches) return false;
    }

    // Payment Methods
    if (filters["payment-methods"]?.length > 0) {
      const selectedMethods = filters["payment-methods"].map((id) => id.replace("payment-", ""));
      const casinoMethods = casino.depositMethods || [];
      const hasMatch = selectedMethods.some((method) =>
        casinoMethods.some((cm) => cm.toLowerCase().includes(method.toLowerCase()))
      );
      if (!hasMatch) return false;
    }

    // Game Providers
    if (filters["game-providers"]?.length > 0) {
      const selectedProviders = filters["game-providers"].map((id) => id.replace("provider-", ""));
      const casinoProviders = casino.gameProviders || [];
      const hasMatch = selectedProviders.some((provider) =>
        casinoProviders.some((cp) => cp.toLowerCase().includes(provider.toLowerCase()))
      );
      if (!hasMatch) return false;
    }

    // Currencies
    if (filters["currencies"]?.length > 0) {
      const selectedCurrencies = filters["currencies"].map((id) => id.replace("currency-", ""));
      const casinoCurrencies = casino.currencies || [];
      const hasMatch = selectedCurrencies.some((currency) =>
        casinoCurrencies.some((cc) => cc.toLowerCase().includes(currency.toLowerCase()))
      );
      if (!hasMatch) return false;
    }

    // Languages
    if (filters["languages"]?.length > 0) {
      const selectedLanguages = filters["languages"].map((id) => id.replace("language-", ""));
      const casinoLanguages = casino.siteLanguages || [];
      const hasMatch = selectedLanguages.some((language) =>
        casinoLanguages.some((cl) => cl.toLowerCase().includes(language.toLowerCase()))
      );
      if (!hasMatch) return false;
    }

    // Wagering
    if (filters["wagering"]?.length > 0) {
      const wagering = casino.wagering || "";
      const matches = filters["wagering"].some((range) => {
        const wageringNum = parseInt(wagering.replace(/[^0-9]/g, "")) || 0;
        if (range === "wagering-0-20") return wageringNum >= 0 && wageringNum <= 20;
        if (range === "wagering-21-30") return wageringNum >= 21 && wageringNum <= 30;
        if (range === "wagering-31-40") return wageringNum >= 31 && wageringNum <= 40;
        if (range === "wagering-41-50") return wageringNum >= 41 && wageringNum <= 50;
        if (range === "wagering-50+") return wageringNum > 50;
        return false;
      });
      if (!matches) return false;
    }

    // Features
    if (filters["features"]?.length > 0) {
      const hasMobileApp = filters["features"].includes("mobile-app") && casino.mobileApplication;
      const hasSportsBetting = filters["features"].includes("sports-betting") && casino.sportsBetting;
      const hasLiveBetting = filters["features"].includes("live-betting") && casino.liveBetting;
      const hasVirtualSports = filters["features"].includes("virtual-sports") && casino.virtualSportsBetting;
      const hasWithdrawActiveBonus = filters["features"].includes("withdraw-active-bonus") && casino.withdrawWithActiveBonus;
      
      const featureMatches = [
        hasMobileApp,
        hasSportsBetting,
        hasLiveBetting,
        hasVirtualSports,
        hasWithdrawActiveBonus,
      ].filter(Boolean);
      
      if (featureMatches.length === 0) return false;
    }

    // Licenses
    if (filters["licenses"]?.length > 0) {
      const selectedLicenses = filters["licenses"].map((id) => id.replace("license-", ""));
      if (!casino.license || !selectedLicenses.includes(casino.license)) return false;
    }

    return true;
  });
}

/**
 * Apply bonus filters
 */
export function applyBonusFilters(
  bonuses: Bonus[],
  filters: Record<string, string[]>
): Bonus[] {
  return bonuses.filter((bonus) => {
    // Type
    if (filters["type"]?.length > 0) {
      const selectedTypes = filters["type"].map((id) => id.replace("type-", ""));
      if (!bonus.type || !selectedTypes.includes(bonus.type)) return false;
    }

    // Safety Index
    if (filters["safety-index"]?.length > 0) {
      const safetyIndex = bonus.safetyIndex || 0;
      const matches = filters["safety-index"].some((range) => {
        if (range === "safety-9-10") return safetyIndex >= 9.0 && safetyIndex <= 10.0;
        if (range === "safety-8-9") return safetyIndex >= 8.0 && safetyIndex < 9.0;
        if (range === "safety-7-8") return safetyIndex >= 7.0 && safetyIndex < 8.0;
        if (range === "safety-6-7") return safetyIndex >= 6.0 && safetyIndex < 7.0;
        if (range === "safety-0-6") return safetyIndex < 6.0;
        return false;
      });
      if (!matches) return false;
    }

    // Rating
    if (filters["rating"]?.length > 0) {
      const rating = bonus.rating || 0;
      const matches = filters["rating"].some((range) => {
        if (range === "rating-4-5") return rating >= 4.0 && rating <= 5.0;
        if (range === "rating-3-4") return rating >= 3.0 && rating < 4.0;
        if (range === "rating-2-3") return rating >= 2.0 && rating < 3.0;
        if (range === "rating-0-2") return rating < 2.0;
        return false;
      });
      if (!matches) return false;
    }

    // Features
    if (filters["features"]?.length > 0) {
      if (filters["features"].includes("exclusive") && !bonus.isExclusive) return false;
    }

    return true;
  });
}

