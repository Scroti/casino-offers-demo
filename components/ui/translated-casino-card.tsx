"use client";

/**
 * Casino Card with automatic translation
 * Uses LibreTranslate to translate database content on-the-fly
 */

import { useState, useEffect } from "react";
import { useTranslateApi } from "@/hooks/use-translate-api";
import { CasinoCard, type CasinoCardProps } from "./casino-card/index";
import { Skeleton } from "@/components/ui/skeleton";

interface TranslatedCasinoCardProps extends Omit<CasinoCardProps, 'casino'> {
  casino: any; // Accept original untranslated casino data
}

export function TranslatedCasinoCard({ casino, ...otherProps }: TranslatedCasinoCardProps) {
  const { translateCasino, isTranslating } = useTranslateApi('libretranslate');
  const [translated, setTranslated] = useState(casino);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const translate = async () => {
      if (isInitialized) return;
      
      setIsInitialized(true);
      
      try {
        const translatedData = await translateCasino(casino);
        setTranslated(translatedData);
      } catch (error) {
        console.error('Translation error:', error);
        // Fallback to original
        setTranslated(casino);
      }
    };

    translate();
  }, [casino, translateCasino, isInitialized]);

  // Show loading state only on initial load
  if (isTranslating && !isInitialized) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  return <CasinoCard casino={translated} {...otherProps} />;
}

