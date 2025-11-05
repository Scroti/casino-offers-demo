"use client";

import { memo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";
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
  const isMobile = useIsMobile();
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <div className="w-full flex flex-col sm:flex-row border border-border rounded-lg overflow-hidden bg-background shadow-sm pb-4">
      {/* Left Section - Logo/Image Full Cover */}
      <div className="relative w-full sm:w-[35%] h-48 sm:h-auto sm:self-stretch overflow-hidden rounded-t-lg sm:rounded-t-none sm:rounded-l-lg sm:rounded-r-none rounded-b-lg sm:rounded-b-none">
        <CasinoLogo logo={casino.logo} image={casino.image} name={casino.name} />
        
        {/* Apple-style Liquid Glass Overlay with Safety Index - Bottom of Image */}
        {casino.safetyIndex && (
          <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none rounded-b-lg sm:rounded-bl-lg sm:rounded-br-none overflow-hidden">
            {/* Liquid glass backdrop with enhanced blur */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/70 to-black/50 backdrop-blur-2xl backdrop-saturate-150 rounded-b-lg sm:rounded-bl-lg sm:rounded-br-none shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_-4px_24px_rgba(0,0,0,0.4)]" />
            {/* Top border glow */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent shadow-[0_1px_2px_rgba(255,255,255,0.1)]" />
            {/* Subtle reflection */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent opacity-30 rounded-b-lg sm:rounded-bl-lg sm:rounded-br-none" />
            {/* Content */}
            <div className="relative flex items-center justify-between px-4 py-3 pointer-events-auto">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-white/90 uppercase tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  Safety Index
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                    {casino.safetyIndex.toFixed(1)}
                  </span>
                  <span className="text-xs text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">/10</span>
                </div>
              </div>
              <Badge className="bg-red-600/95 backdrop-blur-sm text-white px-3 py-1.5 text-xs font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] border border-red-500/40 rounded-md relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-40" />
                <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">HIGH</span>
              </Badge>
            </div>
          </div>
        )}
      </div>

      {/* Right Section - Details */}
      <div className="flex-1 p-3 sm:p-4 bg-background pb-4 sm:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_1.5fr] gap-3 sm:gap-4 h-full">
          {/* Main Info Column */}
          <div className="flex flex-col justify-between">
            <div className="space-y-1.5">
              {/* Casino Name */}
              <h3 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
                {casino.name}
              </h3>

              {/* Features */}
             {isMobile? null : <CasinoFeatures features={casino.features} />}
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

          {/* Side Info Column - Desktop: Always visible, Mobile: Collapsible */}
          {isMobile ? (
            <Collapsible open={isInfoOpen} onOpenChange={setIsInfoOpen} className="mt-3">
              <CollapsibleTrigger className="w-full flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent transition-colors">
                <span className="text-sm font-semibold">Payment Methods, Languages & Games</span>
                {isInfoOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-3 pt-4 border-t">
                {/* Features - Show on Mobile */}
                {casino.features && casino.features.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground">
                      Features:
                    </h4>
                    <CasinoFeatures features={casino.features} />
                  </div>
                )}
                <LanguageOptions 
                  websiteLanguages={casino.websiteLanguages}
                  liveChatLanguages={casino.liveChatLanguages}
                  customerSupportLanguages={casino.customerSupportLanguages}
                />
                <AvailableGames games={casino.availableGames || []} />
                <PaymentMethods payments={casino.paymentMethods || []} />
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <div className="space-y-2 sm:space-y-3 border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 pl-0 sm:pl-4 mt-3 sm:mt-0">
              <LanguageOptions 
                websiteLanguages={casino.websiteLanguages}
                liveChatLanguages={casino.liveChatLanguages}
                customerSupportLanguages={casino.customerSupportLanguages}
              />
              <AvailableGames games={casino.availableGames || []} />
              <PaymentMethods payments={casino.paymentMethods || []} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

