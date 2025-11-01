"use client";

import { useState, useMemo, memo } from "react";
import { CasinoCard } from "@/components/ui/casino-card/index";
import { useGetAllCasinosQuery } from "@/app/lib/data-access/configs/casinos.config";
import type { Casino } from "@/app/lib/data-access/models/casino.model";
import { CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FilterSection } from "@/components/shared/FilterSection";
import { Skeleton } from "@/components/ui/skeleton";

function CasinosPage() {
  const { data: casinos = [], isLoading } = useGetAllCasinosQuery();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");

  const filteredCasinos = useMemo(() => {
    if (selectedFilter === "all") return casinos;
    if (selectedFilter === "recommended") {
      return casinos.filter((c) => (c.safetyIndex || 0) >= 8.0);
    }
    if (selectedFilter === "newly-opened") {
      return casinos.filter((c) => {
        if (!c.createdAt) return false;
        const created = new Date(c.createdAt);
        const daysDiff = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff <= 30;
      });
    }
    if (selectedFilter === "big-brands") {
      return casinos.filter(
        (c) => (c.safetyIndex || 0) >= 7.5 && (c.features?.length || 0) >= 3
      );
    }
    return casinos;
  }, [casinos, selectedFilter]);

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

  const filters = useMemo(() => [
    { id: "all", label: `All (${casinos.length})`, icon: null },
    { id: "recommended", label: "Recommended", icon: CheckCircle2 },
    { id: "newly-opened", label: "Newly opened", icon: null },
    { id: "big-brands", label: "Big brands", icon: null },
  ], [casinos.length]);

  const sortOptions = useMemo(() => [
    { value: "recommended", label: "Recommended" },
    { value: "safety-high", label: "Safety: High to Low" },
    { value: "safety-low", label: "Safety: Low to High" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
  ], []);

  const activeFilterCount = selectedFilter !== "all" ? 1 : 0;

  return (
    <div className="container py-3 px-3 sm:py-5 sm:px-5 mx-auto max-w-7xl">
      <PageHeader title="Casinos" />

      <FilterSection
        activeFilter={selectedFilter}
        filters={filters}
        onFilterChange={setSelectedFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOptions={sortOptions}
        resultsCount={sortedCasinos.length}
        activeFilterCount={activeFilterCount}
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

export default memo(CasinosPage);
