"use client";

import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
import { AdvancedFilterModal } from "./AdvancedFilterModal";
import type { AdvancedFilterState, FilterCategory } from "./AdvancedFilterModal";

interface SortOption {
  value: string;
  label: string;
}

interface FilterSectionProps {
  sortBy?: string;
  onSortChange?: (sort: string) => void;
  sortOptions?: SortOption[];
  resultsCount: number;
  // Filter categories
  filterCategories?: FilterCategory[];
  activeFilters?: AdvancedFilterState;
  onFilterChange?: (filters: AdvancedFilterState) => void;
}

export const FilterSection = memo(function FilterSection({
  sortBy,
  onSortChange,
  sortOptions,
  resultsCount,
  filterCategories,
  activeFilters,
  onFilterChange,
}: FilterSectionProps) {
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const getTotalFilterCount = () => {
    if (!activeFilters) return 0;
    return Object.values(activeFilters).reduce((sum, filters) => sum + filters.length, 0);
  };

  const filterCount = getTotalFilterCount();

  return (
    <div className="mb-6 space-y-4">
      {/* Results Count & Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="text-sm text-muted-foreground">
          {resultsCount} results found {filterCount > 0 ? `(${filterCount} active filter${filterCount > 1 ? 's' : ''})` : ""}
        </div>
        
        {sortBy && onSortChange && sortOptions && (
          <div className="flex items-center gap-4">
            {/* Filter Button */}
            {filterCategories && filterCategories.length > 0 && activeFilters && onFilterChange && (
              <Button
                variant={filterCount > 0 ? "default" : "outline"}
                size="sm"
                className="gap-2"
                onClick={() => setFilterModalOpen(true)}
              >
                <Filter className="h-4 w-4" />
                Filter
                {filterCount > 0 && ` (${filterCount})`}
              </Button>
            )}

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Recommended" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {filterCategories && filterCategories.length > 0 && activeFilters && onFilterChange && (
        <AdvancedFilterModal
          isOpen={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          categories={filterCategories}
          activeFilters={activeFilters}
          onFilterChange={onFilterChange}
          onApply={() => setFilterModalOpen(false)}
          onClear={() => {}}
        />
      )}
    </div>
  );
});

