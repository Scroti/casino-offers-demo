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
    <div className="w-full flex flex-col sm:flex-row border border-border rounded-none overflow-hidden bg-background shadow-sm pb-4">
      {/* Left Section - Logo/Image Full Cover */}
      <div className="relative w-full sm:w-[35%] h-48 sm:h-auto sm:self-stretch overflow-hidden rounded-none">
        <CasinoLogo logo={casino.logo} image={casino.image} name={casino.name} />
        
        {/* Apple-style Liquid Glass Overlay with Safety Index - Bottom of Image */}
        {casino.safetyIndex && (
          <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none rounded-none">
            {/* Glass blur backdrop with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/80 to-background/50 backdrop-blur-xl backdrop-saturate-150 rounded-none" />
            {/* Border with glow effect */}
            <div className="absolute inset-0 border-t border-white/30 shadow-[0_-2px_12px_rgba(0,0,0,0.15)] rounded-none" />
            {/* Content */}
            <div className="relative flex items-center justify-between px-4 py-3 pointer-events-auto rounded-none">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-foreground/95 uppercase tracking-wider">
                  Safety Index
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-foreground">
                    {casino.safetyIndex.toFixed(1)}
                  </span>
                  <span className="text-xs text-foreground/70">/10</span>
                </div>
              </div>
              <Badge className="bg-primary/95 backdrop-blur-sm text-primary-foreground px-3 py-1 text-xs font-semibold shadow-lg border border-primary/30 rounded-none">
                HIGH
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
             {!isMobile ? <CasinoFeatures features={casino.features} /> : null}
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
                {/* Key Benefits - Only in Mobile Dropdown */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground">
                    Key Benefits:
                  </h4>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <div className="h-5 w-5 rounded-full bg-destructive flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="h-3 w-3 text-destructive-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-foreground leading-relaxed">
                        Large selection of slot games from top providers
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="h-5 w-5 rounded-full bg-destructive flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="h-3 w-3 text-destructive-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-foreground leading-relaxed">
                        Fast withdrawal processing (24 hours)
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="h-5 w-5 rounded-full bg-destructive flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="h-3 w-3 text-destructive-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-foreground leading-relaxed">
                        24/7 customer support
                      </span>
                    </div>
                  </div>
                </div>
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

