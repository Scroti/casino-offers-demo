"use client";

import { useState } from "react";
import { CasinoBonusCard } from "@/components/ui/casino-bonus-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllBonusesQuery } from "@/app/lib/data-access/configs/bonuses.config";
import type { Bonus } from "@/app/lib/data-access/models/bonus.model";
import { Filter, CheckCircle2 } from "lucide-react";

interface BonusesPageProps {
  filter?: string;
}

export default function BonusesPage({ filter }: BonusesPageProps) {
  const { data: bonuses = [], isLoading } = useGetAllBonusesQuery();
  const [selectedFilter, setSelectedFilter] = useState(filter || "all");
  const [sortBy, setSortBy] = useState("recommended");

  const filteredByType = (() => {
    if (selectedFilter === "all" || selectedFilter === "recommended" || selectedFilter === "latest") return bonuses;
    if (selectedFilter === "no-deposit" || selectedFilter === "deposit" || selectedFilter === "cashback") {
      return bonuses.filter((b) => b.type === selectedFilter);
    }
    if (selectedFilter === "exclusive") return bonuses.filter((b) => b.isExclusive);
    return bonuses;
  })();

  const filters = [
    { id: "all", label: `All (${bonuses.length})`, icon: null },
    { id: "deposit", label: "Deposit", icon: null },
    { id: "no-deposit", label: "No deposit", icon: null },
    { id: "cashback", label: "Cashback", icon: null },
    { id: "recommended", label: "Recommended", icon: CheckCircle2 },
    { id: "latest", label: "Latest", icon: null },
    { id: "exclusive", label: "Exclusive", icon: null },
  ];

  const activeFilterCount = selectedFilter !== "all" ? 1 : 0;

  // Extract casino name from title (assuming format like "200 FREE SPINS on Book of Wealth - SpinBetter")
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
    <div className="container py-5 px-5 mx-auto max-w-7xl">
      <h1 className="text-4xl font-bold mb-6">Bonuses</h1>

      {/* Filter Section */}
      <div className="mb-6 space-y-4">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filterItem) => {
            const Icon = filterItem.icon;
            const isActive = selectedFilter === filterItem.id;
            
            return (
              <Button
                key={filterItem.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filterItem.id)}
                className={isActive ? "bg-primary text-primary-foreground" : ""}
              >
                {Icon && <Icon className="h-3 w-3 mr-1" />}
                {filterItem.label}
              </Button>
            );
          })}
        </div>

        {/* Results Count & Controls */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {filteredByType.length} bonuses found {activeFilterCount ? `(1 active filter)` : ""}
          </div>
          
          <div className="flex items-center gap-4">
            {/* Sort By */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Recommended" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="highest">Highest Value</SelectItem>
                  <SelectItem value="lowest">Lowest Value</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Button */}
            {activeFilterCount > 0 && (
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter {activeFilterCount}
              </Button>
            )}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="w-full text-center text-lg py-12">Loading bonuses...</div>
      )}
      {(!isLoading && filteredByType.length === 0) && (
        <div className="w-full text-center text-lg py-12">No bonuses found.</div>
      )}

      {/* Stacked bonuses - one under the other */}
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
    </div>
  );
}
