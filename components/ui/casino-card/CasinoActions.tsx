"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Play, BookOpen } from "lucide-react";

interface CasinoActionsProps {
  visitUrl?: string;
  reviewId?: string;
  onVisitCasino?: () => void;
  onReadReview?: () => void;
}

export const CasinoActions = memo(function CasinoActions({ 
  visitUrl, 
  reviewId,
  onVisitCasino, 
  onReadReview 
}: CasinoActionsProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button
        onClick={() => {
          if (visitUrl) window.open(visitUrl, '_blank');
          onVisitCasino?.();
        }}
        className="flex-1 text-xs sm:text-sm h-11 sm:h-9"
        size="sm"
      >
        <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
        Visit Casino
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          if (reviewId) {
            router.push(`/casinos/${reviewId}/review`);
          }
          onReadReview?.();
        }}
        className="flex-1 text-xs sm:text-sm h-11 sm:h-9"
        size="sm"
      >
        <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
        Read Review
      </Button>
    </div>
  );
});

