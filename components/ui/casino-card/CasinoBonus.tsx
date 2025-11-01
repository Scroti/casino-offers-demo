"use client";

import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Gift } from "lucide-react";

interface CasinoBonusProps {
  bonusText?: string;
  bonusSubtext?: string;
  isExclusive?: boolean;
}

export const CasinoBonus = memo(function CasinoBonus({ 
  bonusText, 
  bonusSubtext, 
  isExclusive 
}: CasinoBonusProps) {
  if (!bonusText) return null;

  return (
    <div className="space-y-1 mb-2">
      {isExclusive && (
        <Badge className="text-[10px] sm:text-xs bg-primary text-primary-foreground">
          <Gift className="h-3 w-3 mr-1" />
          Exclusive Bonus
        </Badge>
      )}
      <div className="flex items-center gap-1.5">
        <Gift className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary flex-shrink-0" />
        <span className="text-sm sm:text-base font-bold text-foreground leading-tight">
          {isExclusive ? 'BONUS:' : ''} {bonusText}
        </span>
      </div>
      {bonusSubtext && (
        <p className="text-[9px] sm:text-[10px] text-muted-foreground ml-4 sm:ml-5">
          *{bonusSubtext}
        </p>
      )}
    </div>
  );
});

