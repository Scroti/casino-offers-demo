"use client";

import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  icon?: LucideIcon | null;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOption[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

export const FilterModal = memo(function FilterModal({
  isOpen,
  onClose,
  filters,
  activeFilter,
  onFilterChange,
}: FilterModalProps) {
  const handleFilterSelect = (filterId: string) => {
    onFilterChange(filterId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Options</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-4">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;

            return (
              <Button
                key={filter.id}
                variant={isActive ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => handleFilterSelect(filter.id)}
              >
                {Icon && <Icon className="h-4 w-4 mr-2" />}
                {filter.label}
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
});

