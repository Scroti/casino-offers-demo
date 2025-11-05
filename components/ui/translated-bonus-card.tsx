"use client";

/**
 * Bonus Card with automatic translation
 * Uses LibreTranslate to translate database content on-the-fly
 */

import { useState, useEffect } from "react";
import { useTranslateApi } from "@/hooks/use-translate-api";
import { CasinoBonusCard, type CasinoBonusCardProps } from "./casino-bonus-card";
import { Skeleton } from "@/components/ui/skeleton";

interface TranslatedBonusCardProps extends Omit<CasinoBonusCardProps, 'title' | 'description' | 'bonusInstructions'> {
  // Accept original untranslated data
  title: string;
  description?: { title?: string; subtitle?: string; content?: string };
  bonusInstructions?: string;
  // Other accordion fields that need translation
  wageringRequirement?: { value?: string; subtitle?: string; content?: string };
  bonusValue?: { value?: string; subtitle?: string; content?: string };
  maxBet?: { value?: string; subtitle?: string; content?: string };
  expiration?: { value?: string; subtitle?: string; content?: string };
  claimSpeed?: { value?: string; subtitle?: string; content?: string };
  termsConditions?: { value?: string; subtitle?: string; content?: string };
  customSections?: Array<{ title: string; content: string; subtitle?: string; icon?: string }>;
}

export function TranslatedBonusCard(props: TranslatedBonusCardProps) {
  const { t, translateBonus, isTranslating } = useTranslateApi('libretranslate');
  const [translated, setTranslated] = useState<CasinoBonusCardProps>(props as any);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const translate = async () => {
      if (isInitialized) return;
      
      setIsInitialized(true);
      
      try {
        // Translate the entire bonus object
        const bonusData = {
          title: props.title,
          description: props.description,
          bonusInstructions: props.bonusInstructions,
          wageringRequirement: props.wageringRequirement,
          bonusValue: props.bonusValue,
          maxBet: props.maxBet,
          expiration: props.expiration,
          claimSpeed: props.claimSpeed,
          termsConditions: props.termsConditions,
          customSections: props.customSections,
        };
        
        const translatedData = await translateBonus(bonusData);
        
        setTranslated({
          ...props,
          title: translatedData.title || props.title,
          description: translatedData.description || props.description,
          bonusInstructions: translatedData.bonusInstructions || props.bonusInstructions,
          wageringRequirement: translatedData.wageringRequirement || props.wageringRequirement,
          bonusValue: translatedData.bonusValue || props.bonusValue,
          maxBet: translatedData.maxBet || props.maxBet,
          expiration: translatedData.expiration || props.expiration,
          claimSpeed: translatedData.claimSpeed || props.claimSpeed,
          termsConditions: translatedData.termsConditions || props.termsConditions,
          customSections: translatedData.customSections || props.customSections,
        });
      } catch (error) {
        console.error('Translation error:', error);
        // Fallback to original props
        setTranslated(props as any);
      }
    };

    translate();
  }, [props.title, props.description, translateBonus, isInitialized]);

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

  return <CasinoBonusCard {...translated} />;
}

