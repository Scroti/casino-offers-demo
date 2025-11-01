"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, LucideIcon } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  icon?: LucideIcon | null;
}

interface SortOption {
  value: string;
  label: string;
}

interface FilterSectionProps {
  activeFilter: string;
  filters: FilterOption[];
  onFilterChange: (filterId: string) => void;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
  sortOptions?: SortOption[];
  resultsCount: number;
  activeFilterCount?: number;
}

export const FilterSection = memo(function FilterSection({
  activeFilter,
  filters,
  onFilterChange,
  sortBy,
  onSortChange,
  sortOptions,
  resultsCount,
  activeFilterCount = 0,
}: FilterSectionProps) {
  return (
    <div className="mb-6 space-y-4">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.id;
          
          return (
            <Button
              key={filter.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange(filter.id)}
            >
              {Icon && <Icon className="h-3 w-3 mr-1" />}
              {filter.label}
            </Button>
          );
        })}
      </div>

      {/* Results Count & Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {resultsCount} results found {activeFilterCount > 0 ? `(${activeFilterCount} active filter)` : ""}
        </div>
        
        {sortBy && onSortChange && sortOptions && (
          <div className="flex items-center gap-4">
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

            {activeFilterCount > 0 && (
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter {activeFilterCount}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

