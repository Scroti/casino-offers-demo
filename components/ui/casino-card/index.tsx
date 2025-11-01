"use client";

import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { CasinoLogo } from "./CasinoLogo";
import { CasinoFeatures } from "./CasinoFeatures";
import { CasinoBonus } from "./CasinoBonus";
import { CasinoActions } from "./CasinoActions";
import { LanguageOptions } from "./LanguageOptions";
import { AvailableGames } from "./AvailableGames";
import { PaymentMethods } from "./PaymentMethods";
import type { Casino } from "@/app/lib/data-access/models/casino.model";

interface CasinoCardProps {
  casino: Casino;
  onVisitCasino?: () => void;
  onReadReview?: () => void;
}

export const CasinoCard = memo(function CasinoCard({ 
  casino, 
  onVisitCasino, 
  onReadReview 
}: CasinoCardProps) {
  return (
    <div className="w-full flex flex-col sm:flex-row border border-border rounded-lg overflow-hidden bg-background shadow-sm pb-4">
      {/* Left Section - Logo/Image Full Cover */}
      <div className="relative w-full sm:w-[35%] h-48 sm:h-auto sm:self-stretch overflow-hidden">
        <CasinoLogo logo={casino.logo} image={casino.image} name={casino.name} />
      </div>

      {/* Right Section - Details */}
      <div className="flex-1 p-3 sm:p-4 bg-background pb-4 sm:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_1.5fr] gap-3 sm:gap-4 h-full">
          {/* Main Info Column */}
          <div className="flex flex-col justify-between">
            <div className="space-y-1.5">
              {/* Safety Index */}
              {casino.safetyIndex && (
                <div className="flex flex-wrap items-center gap-2 order-first sm:order-none">
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                    SAFETY INDEX:
                  </span>
                  <span className="text-sm sm:text-base font-bold text-foreground">
                    {casino.safetyIndex.toFixed(1)}
                  </span>
                  <Badge className="bg-primary text-primary-foreground px-2 py-0.5 text-xs">
                    HIGH
                  </Badge>
                  <Info className="h-3 w-3 sm:h-4 sm:w-4 text-primary cursor-help" />
                </div>
              )}
              
              {/* Casino Name */}
              <h3 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
                {casino.name}
              </h3>

              {/* Features */}
              <CasinoFeatures features={casino.features} />
            </div>

            {/* Bonus and Action Buttons */}
            <div className="space-y-2 sm:space-y-3 mt-2 sm:mt-3 pt-2 sm:pt-3 pb-2">
              <CasinoBonus 
                bonusText={casino.bonusText} 
                bonusSubtext={casino.bonusSubtext} 
                isExclusive={casino.isExclusive} 
              />
              <CasinoActions 
                visitUrl={casino.visitUrl}
                reviewId={casino._id}
                onVisitCasino={onVisitCasino}
                onReadReview={onReadReview}
              />
            </div>
          </div>

          {/* Side Info Column */}
          <div className="space-y-2 sm:space-y-3 border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 pl-0 sm:pl-4 mt-3 sm:mt-0">
            <LanguageOptions 
              websiteLanguages={casino.websiteLanguages}
              liveChatLanguages={casino.liveChatLanguages}
              customerSupportLanguages={casino.customerSupportLanguages}
            />
            <AvailableGames games={casino.availableGames || []} />
            <PaymentMethods payments={casino.paymentMethods || []} />
          </div>
        </div>
      </div>
    </div>
  );
});

