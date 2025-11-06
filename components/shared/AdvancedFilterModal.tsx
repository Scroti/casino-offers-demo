"use client";

import { memo, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { X } from "lucide-react";
import { useI18n } from "@/context/i18n.context";

export interface FilterCategory {
  id: string;
  label: string;
  options: FilterOption[];
}

export interface FilterOption {
  id: string;
  label: string;
  value?: string | number | boolean;
}

export interface AdvancedFilterState {
  [categoryId: string]: string[];
}

interface AdvancedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: FilterCategory[];
  activeFilters: AdvancedFilterState;
  onFilterChange: (filters: AdvancedFilterState) => void;
  onApply: () => void;
  onClear: () => void;
}

export const AdvancedFilterModal = memo(function AdvancedFilterModal({
  isOpen,
  onClose,
  categories,
  activeFilters,
  onFilterChange,
  onApply,
  onClear,
}: AdvancedFilterModalProps) {
  const { t } = useI18n();
  const [localFilters, setLocalFilters] = useState<AdvancedFilterState>(activeFilters);

  // Sync local filters when modal opens or activeFilters change
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(activeFilters);
    }
  }, [isOpen, activeFilters]);

  const handleToggleOption = (categoryId: string, optionId: string) => {
    setLocalFilters((prev) => {
      const categoryFilters = prev[categoryId] || [];
      const isSelected = categoryFilters.includes(optionId);
      
      return {
        ...prev,
        [categoryId]: isSelected
          ? categoryFilters.filter((id) => id !== optionId)
          : [...categoryFilters, optionId],
      };
    });
  };

  const handleClearCategory = (categoryId: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [categoryId]: [],
    }));
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onApply();
  };

  const handleClear = () => {
    const cleared: AdvancedFilterState = {};
    categories.forEach((cat) => {
      cleared[cat.id] = [];
    });
    setLocalFilters(cleared);
    onFilterChange(cleared);
    onClear();
  };

  const getActiveFilterCount = () => {
    return Object.values(localFilters).reduce((sum, filters) => sum + filters.length, 0);
  };

  const getCategoryCount = (categoryId: string) => {
    return localFilters[categoryId]?.length || 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('bonuses.advancedFilters')}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-4 max-h-[60vh]">
          <div className="space-y-4 py-4">
            {categories.map((category, categoryIndex) => {
              const categoryFilters = localFilters[category.id] || [];
              const count = getCategoryCount(category.id);
              
              return (
                <div key={category.id}>
                  <div className="mb-3">
                    <Label className="text-base font-semibold">{category.label}</Label>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={count > 0 ? "default" : "outline"}
                        className="w-full justify-between"
                      >
                        <span>
                          {count > 0 ? `${count} ${t('bonuses.selected')}` : t('bonuses.selectOptions')}
                        </span>
                        {count > 0 && (
                          <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                            {count}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-[300px] overflow-y-auto">
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <DropdownMenuLabel className="px-0">{category.label}</DropdownMenuLabel>
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
                            {t('common.clear')}
                          </Button>
                        )}
                      </div>
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
                  
                  {categoryIndex < categories.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-end gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {getActiveFilterCount() > 0 && (
              <span>{getActiveFilterCount()} {t('bonuses.filtersSelected')}</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClear} disabled={getActiveFilterCount() === 0}>
              {t('bonuses.clearAll')}
            </Button>
            <Button onClick={handleApply}>
              {t('bonuses.applyFilters')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

