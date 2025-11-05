"use client";

import { memo } from "react";
import { CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CasinoFeaturesProps {
  features?: Array<{
    type: 'positive' | 'negative' | 'neutral';
    text: string;
  }>;
}

export const CasinoFeatures = memo(function CasinoFeatures({ features }: CasinoFeaturesProps) {
  if (!features || features.length === 0) return null;

  // Show at least 3 features, or all if there are 3 or fewer
  const displayFeatures = features.length <= 3 ? features : features.slice(0, 3);

  return (
    <div className="space-y-0.5 mt-1.5">
      {displayFeatures.map((feature, idx) => (
        <div key={idx} className="flex items-start gap-2 text-[10px] sm:text-xs">
          {feature.type === 'positive' && (
            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-primary mt-0.5 flex-shrink-0" />
          )}
          {feature.type === 'negative' && (
            <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-destructive mt-0.5 flex-shrink-0" />
          )}
          {feature.type === 'neutral' && (
            <MinusCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          )}
          <span className={cn(
            "leading-tight text-[10px] sm:text-xs",
            feature.type === 'negative' && 'text-destructive'
          )}>
            {feature.text}
          </span>
        </div>
      ))}
    </div>
  );
});

