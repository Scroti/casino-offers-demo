"use client";

import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { FilterCategory, AdvancedFilterState } from "./AdvancedFilterModal";

interface FilterDropdownsProps {
  categories: FilterCategory[];
  activeFilters: AdvancedFilterState;
  onFilterChange: (filters: AdvancedFilterState) => void;
}

export const FilterDropdowns = memo(function FilterDropdowns({
  categories,
  activeFilters,
  onFilterChange,
}: FilterDropdownsProps) {
  const handleToggleOption = (categoryId: string, optionId: string) => {
    const categoryFilters = activeFilters[categoryId] || [];
    const isSelected = categoryFilters.includes(optionId);

    onFilterChange({
      ...activeFilters,
      [categoryId]: isSelected
        ? categoryFilters.filter((id) => id !== optionId)
        : [...categoryFilters, optionId],
    });
  };

  const handleClearCategory = (categoryId: string) => {
    onFilterChange({
      ...activeFilters,
      [categoryId]: [],
    });
  };

  const getCategoryCount = (categoryId: string) => {
    return activeFilters[categoryId]?.length || 0;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {categories.map((category) => {
        const count = getCategoryCount(category.id);
        const categoryFilters = activeFilters[category.id] || [];

        return (
          <DropdownMenu key={category.id}>
            <DropdownMenuTrigger asChild>
              <Button
                variant={count > 0 ? "default" : "outline"}
                size="sm"
                className="gap-2"
              >
                {category.label}
                {count > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    {count}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel className="flex items-center justify-between px-2 py-1.5">
                <span>{category.label}</span>
                {count > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearCategory(category.id);
                    }}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[250px] overflow-y-auto">
                {category.options.map((option) => {
                  const isSelected = categoryFilters.includes(option.id);

                  return (
                    <DropdownMenuCheckboxItem
                      key={option.id}
                      checked={isSelected}
                      onCheckedChange={() => handleToggleOption(category.id, option.id)}
                    >
                      {option.label}
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}
    </div>
  );
});

