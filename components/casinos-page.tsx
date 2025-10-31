"use client";

import { useState, useMemo } from "react";
import { CasinoCard } from "@/components/ui/casino-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllCasinosQuery } from "@/app/lib/data-access/configs/casinos.config";
import type { Casino } from "@/app/lib/data-access/models/casino.model";
import { Filter, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CasinosPage() {
  const { data: casinos = [], isLoading } = useGetAllCasinosQuery();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");

  // Filter casinos based on selected filter
  const filteredCasinos = useMemo(() => {
    if (selectedFilter === "all") return casinos;
    if (selectedFilter === "recommended") {
      // Filter by high safety index (8.0+)
      return casinos.filter((c) => (c.safetyIndex || 0) >= 8.0);
    }
    if (selectedFilter === "newly-opened") {
      // Filter by recent creation date (last 30 days)
      return casinos.filter((c) => {
        if (!c.createdAt) return false;
        const created = new Date(c.createdAt);
        const daysDiff = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff <= 30;
      });
    }
    if (selectedFilter === "big-brands") {
      // Filter by high safety index and presence of multiple features
      return casinos.filter(
        (c) => (c.safetyIndex || 0) >= 7.5 && (c.features?.length || 0) >= 3
      );
    }
    return casinos;
  }, [casinos, selectedFilter]);

  // Sort casinos
  const sortedCasinos = useMemo(() => {
    const sorted = [...filteredCasinos];
    
    switch (sortBy) {
      case "recommended":
        // Sort by safety index descending, then by name
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

  const filters = [
    { id: "all", label: `All (${casinos.length})`, icon: null },
    { id: "recommended", label: "Recommended", icon: CheckCircle2 },
    { id: "newly-opened", label: "Newly opened", icon: null },
    { id: "big-brands", label: "Big brands", icon: null },
  ];

  const activeFilterCount = selectedFilter !== "all" ? 1 : 0;

  return (
    <div className="container py-3 px-3 sm:py-5 sm:px-5 mx-auto max-w-7xl">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">Casinos</h1>

      {/* Filter Section */}
      <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
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
                className={cn(
                  isActive ? "bg-primary text-primary-foreground" : "",
                  "text-xs sm:text-sm"
                )}
              >
                {Icon && <Icon className="h-3 w-3 mr-1" />}
                <span className="hidden sm:inline">{filterItem.label}</span>
                <span className="sm:hidden">{filterItem.label.split(' ')[0]}</span>
              </Button>
            );
          })}
        </div>

        {/* Results Count & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="text-xs sm:text-sm text-muted-foreground">
            {sortedCasinos.length} casino{sortedCasinos.length !== 1 ? 's' : ''} found{" "}
            {activeFilterCount ? `based on ${activeFilterCount} filter` : ""}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            {/* Sort By */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px] text-xs sm:text-sm">
                  <SelectValue placeholder="Recommended" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="safety-high">Safety: High to Low</SelectItem>
                  <SelectItem value="safety-low">Safety: Low to High</SelectItem>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z to A</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Button */}
            {activeFilterCount > 0 && (
              <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                <Filter className="h-4 w-4" />
                Filter {activeFilterCount}
              </Button>
            )}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="w-full text-center text-sm sm:text-lg py-8 sm:py-12">Loading casinos...</div>
      )}
      {!isLoading && sortedCasinos.length === 0 && (
        <div className="w-full text-center text-sm sm:text-lg py-8 sm:py-12">No casinos found.</div>
      )}

      {/* Stacked casinos - one under the other */}
      <div className="flex flex-col gap-4 sm:gap-6">
        {sortedCasinos.map((casino: Casino, index) => (
          <CasinoCard
            key={casino._id || index}
            casino={casino}
            onVisitCasino={() => {
              if (casino.visitUrl) window.open(casino.visitUrl, "_blank");
            }}
            onReadReview={() => {
              // Navigation is handled by router.push in the button onClick
            }}
          />
        ))}
      </div>
    </div>
  );
}

