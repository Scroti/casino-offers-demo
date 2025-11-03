"use client";

import { useState, useMemo, memo } from "react";
import { CasinoBonusCard } from "@/components/ui/casino-bonus-card";
import { useGetAllBonusesQuery } from "@/app/lib/data-access/configs/bonuses.config";
import type { Bonus } from "@/app/lib/data-access/models/bonus.model";
import { CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterSection } from "@/components/shared/FilterSection";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth.context";
import { useI18n } from "@/context/i18n.context";
import { useEmailCampaign } from "@/hooks/use-email-campaign";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const extractCasinoName = (title: string) => {
  const parts = title.split("-");
  return parts.length > 1 ? parts[parts.length - 1].trim() : "Casino";
};

const extractBonusType = (type: string) => {
  if (type === "no-deposit") return "no-deposit";
  if (type === "deposit") return "deposit";
  return "cashback";
};

function BonusesPage() {
  const { data: bonuses = [], isLoading } = useGetAllBonusesQuery();
  const { user, accessToken, hydrated } = useAuth();
  const { t } = useI18n();
  const { isFromCampaign } = useEmailCampaign();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");
  
  const isLoggedIn = hydrated && (accessToken || user);
  // Allow access if logged in OR from valid campaign
  const canAccessBonuses = isLoggedIn || isFromCampaign;

  const filteredByType = useMemo(() => {
    if (selectedFilter === "all" || selectedFilter === "recommended" || selectedFilter === "latest") {
      return bonuses;
    }
    if (selectedFilter === "no-deposit" || selectedFilter === "deposit" || selectedFilter === "cashback") {
      return bonuses.filter((b) => b.type === selectedFilter);
    }
    if (selectedFilter === "exclusive") {
      return bonuses.filter((b) => b.isExclusive);
    }
    return bonuses;
  }, [bonuses, selectedFilter]);

  const filters = useMemo(() => [
    { id: "all", label: `All (${bonuses.length})`, icon: null },
    { id: "deposit", label: "Deposit", icon: null },
    { id: "no-deposit", label: "No deposit", icon: null },
    { id: "cashback", label: "Cashback", icon: null },
    { id: "recommended", label: "Recommended", icon: CheckCircle2 },
    { id: "latest", label: "Latest", icon: null },
    { id: "exclusive", label: "Exclusive", icon: null },
  ], [bonuses.length]);

  const sortOptions = [
    { value: "recommended", label: "Recommended" },
    { value: "highest", label: "Highest Value" },
    { value: "lowest", label: "Lowest Value" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
  ];

  const activeFilterCount = selectedFilter !== "all" ? 1 : 0;

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
        activeFilter={selectedFilter}
        filters={filters}
        onFilterChange={setSelectedFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOptions={sortOptions}
        resultsCount={filteredByType.length}
        activeFilterCount={activeFilterCount}
      />

      {isLoading && (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      )}

      {!isLoading && filteredByType.length === 0 && (
        <div className="w-full text-center text-lg py-12 text-muted-foreground">
          {t('bonuses.noBonuses')}
        </div>
      )}

      {!isLoading && canAccessBonuses && filteredByType.length > 0 && (
        <div className="flex flex-col gap-6">
          {filteredByType.map((bonus: Bonus, index) => (
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

export default memo(BonusesPage);
