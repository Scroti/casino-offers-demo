"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Gift,
  Cog,
  Coins,
  Banknote,
  Calendar,
  Clock,
  Info,
  Star,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Globe,
  ChevronDown,
  ChevronUp,
  Play,
  MessageSquare,
} from "lucide-react";
import * as LucideIcons from "lucide-react";

export interface BonusAccordionContent {
  // New flexible shape from backend
  value?: string;
  title?: string;
  subtitle?: string;
  content?: string;
  expandedContent?: string;
}

export interface CasinoBonusCardProps {
  // Bonus Info
  bonusType: "no-deposit" | "deposit" | "cashback";
  title: string;
  description?: { title?: string; subtitle?: string; content?: string };
  isExclusive?: boolean;

  
  // Bonus Details with expanded content
  wageringRequirement?: BonusAccordionContent;
  bonusValue?: BonusAccordionContent;
  maxBet?: BonusAccordionContent;
  expiration?: BonusAccordionContent;
  claimSpeed?: BonusAccordionContent;
  termsConditions?: BonusAccordionContent;
  
  // Casino Info
  casinoName: string;
  casinoLogo?: string;
  casinoImage?: string;
  safetyIndex?: number;
  countryFlag?: string;
  countryCode?: string;
  
  // CTA
  promoCode?: string;
  bonusInstructions?: string;
  reviewLink?: string;
  
  // Actions
  onGetBonus?: () => void;
  onCopyCode?: () => void;
  onReadReview?: () => void;
  onFeedbackYes?: () => void;
  onFeedbackNo?: () => void;
  customSections?: Array<{ title: string; content: string; subtitle?: string; icon?: string }>;
  href?: string;
}

export function CasinoBonusCard({
  bonusType,
  title,
  description,
  isExclusive = false,
  casinoImage,
  wageringRequirement,
  bonusValue,
  maxBet,
  expiration,
  claimSpeed,
  termsConditions,
  casinoName,
  casinoLogo,
  safetyIndex,
  countryFlag,
  countryCode,
  promoCode,
  bonusInstructions,
  reviewLink,
  onGetBonus,
  onCopyCode,
  onReadReview,
  onFeedbackYes,
  onFeedbackNo,
  customSections = [],
  href,
}: CasinoBonusCardProps) {
  // Add icons to accordion content
  const wageringWithIcon = wageringRequirement && wageringRequirement.value ? {
    title: `Wagering requirements: ${wageringRequirement.value}`,
    subtitle: wageringRequirement.subtitle,
    expandedContent: wageringRequirement.content || '',
    icon: Cog,
  } : null;
  const bonusValueWithIcon = bonusValue && bonusValue.value ? {
    title: `Value of bonus: ${bonusValue.value}`,
    subtitle: bonusValue.subtitle,
    expandedContent: bonusValue.content || '',
    icon: Coins,
  } : null;
  const maxBetWithIcon = maxBet && maxBet.value ? {
    title: `Maximum bet: ${maxBet.value}`,
    subtitle: maxBet.subtitle,
    expandedContent: maxBet.content || '',
    icon: Banknote,
  } : null;
  const expirationWithIcon = expiration && expiration.value ? {
    title: `Bonus expiration: ${expiration.value}`,
    subtitle: expiration.subtitle,
    expandedContent: expiration.content || '',
    icon: Calendar,
  } : null;
  const claimSpeedWithIcon = claimSpeed && claimSpeed.value ? {
    title: `Claim speed: ${claimSpeed.value}`,
    subtitle: claimSpeed.subtitle,
    expandedContent: claimSpeed.content || '',
    icon: Clock,
  } : null;
  const termsWithIcon = termsConditions && (termsConditions.value || termsConditions.content) ? {
    title: 'Terms & Conditions',
    subtitle: termsConditions.subtitle,
    expandedContent: termsConditions.content || '',
    icon: Info,
  } : null;

  // Use destructuring & fallback for description
  const descObj: {title?: string; subtitle?: string; content?: string} = 
    description && typeof description === 'object'
      ? description
      : typeof description === 'string'
      ? { content: description }
      : {};
  const descFeature = (descObj.title || descObj.content)
    ? {
        icon: Gift,
        title: descObj.title ?? '',
        subtitle: descObj.subtitle,
        expandedContent: descObj.content ?? '',
      }
    : null;
  const bonusFeatures = [
    descFeature,
    wageringWithIcon,
    bonusValueWithIcon,
    maxBetWithIcon,
    expirationWithIcon,
    claimSpeedWithIcon,
    termsWithIcon,
  ].filter(Boolean);

  // Merge with customSections (dynamic accordions after mandatory ones)
  const allFeatures = [
    ...bonusFeatures,
    ...customSections.map(section => {
      const IconComponent = (section.icon && (LucideIcons as any)[section.icon]) || Cog;
      return {
        icon: IconComponent,
        title: section.title,
        subtitle: section.subtitle,
        expandedContent: section.content,
      };
    })
  ];

  // Only show sections that have meaningful title and content
  const visibleFeatures = allFeatures.filter((f: any) => {
    const title = 'title' in f ? String(f.title || '').trim() : '';
    const content = 'expandedContent' in f ? String(f.expandedContent || '').trim() : '';
    // Allow the first item (description) to show based on title only, others require content
    return title && (content || f === allFeatures[0]);
  });

  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const safetyColor =
    typeof safetyIndex === 'number'
      ? safetyIndex >= 8.5
        ? "text-primary"
        : safetyIndex >= 7
        ? "text-foreground"
        : "text-destructive"
      : undefined;
  const safetyLabel =
    typeof safetyIndex === 'number'
      ? safetyIndex >= 8.5
        ? "HIGH"
        : safetyIndex >= 7
        ? "MEDIUM"
        : "LOW"
      : undefined;

  return (
    <Card className="w-full border-border/50 hover:shadow-xl transition-all duration-300 bg-card/90 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-border/50">
          {/* Left Section - Bonus Details */}
          <div className="flex-1 p-6 lg:pr-4">
            {/* Header */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {bonusType.replace("-", " ").toUpperCase()} BONUS
                </div>
                {countryFlag && (
                  <span className="text-xl" role="img" aria-label={`${countryCode || 'Country'} flag`}>
                    {countryFlag}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-foreground">{title}</h3>
                {isExclusive && (
                  <Badge variant="default">
                    <span className="mr-1">💎</span>
                    Exclusive
                  </Badge>
                )}
              </div>
            </div>

            {/* Bonus Features List with Accordions */}
            <div className="space-y-0">
              {visibleFeatures.map((feature, index) => {
                if (!feature) return null;
                
                const Icon = 'icon' in feature ? feature.icon : Info;
                const featureTitle = 'title' in feature ? feature.title : '';
                const featureSubtitle = 'subtitle' in feature ? feature.subtitle : undefined;
                const featureContent = 'expandedContent' in feature ? feature.expandedContent : '';
                const isOpen = openItems[index] || false;
                
                return (
                  <Collapsible
                    key={index}
                    open={isOpen}
                    onOpenChange={() => toggleItem(index)}
                  >
                    <CollapsibleTrigger asChild>
                      <div className="flex items-start gap-3 py-3 group cursor-pointer hover:bg-muted/30 px-2 -mx-2 rounded-md transition-colors w-full">
                        <Icon className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0 group-hover:text-primary transition-colors" />
                        <div className="flex-1 min-w-0 text-left">
                          <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {featureTitle}
                          </div>
                          {featureSubtitle && (
                            <div className="text-xs text-muted-foreground mt-0.5">{featureSubtitle}</div>
                          )}
                        </div>
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 transition-opacity" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                      <div className="px-7 pb-4 pt-0">
                        <div
                          className="text-sm text-muted-foreground leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: featureContent }}
                        />
                      </div>
                    </CollapsibleContent>
                    <div className="border-b border-border/50" />
                  </Collapsible>
                );
              })}
            </div>
          </div>

          {/* Right Section - Casino Info & CTA */}
          <div className="lg:w-[320px] lg:min-w-[320px] flex flex-col">
            {/* Bonus Image */}
            {casinoImage && (
              <div className="mx-2  h-40 overflow-hidden flex-shrink-0 rounded-t-lg">
                {reviewLink ? (
                  <a href={reviewLink} target="_blank" rel="noopener noreferrer">
                    <img
                      src={casinoImage}
                      alt={title}
                      className="w-full h-full object-cover object-center"
                    />
                  </a>
                ) : href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    <img
                      src={casinoImage}
                      alt={title}
                      className="w-full h-full object-cover object-center"
                    />
                  </a>
                ) : (
                  <img
                    src={casinoImage}
                    alt={title}
                    className="w-full h-full object-cover object-center"
                  />
                )}
              </div>
            )}

            {/* Content Card */}
            <div className="flex-1 mx-2 bg-card border border-border/50 rounded-b-lg">
              <div className="p-4 space-y-4">
                {/* Safety Index */}
                {typeof safetyIndex === 'number' && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground font-semibold">SAFETY INDEX:</span>
                    <span className="font-bold">{safetyIndex}</span>
                    {safetyLabel && (
                      <span className={`font-semibold ${safetyColor}`}>{safetyLabel}</span>
                    )}
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}

                {/* How to Get Bonus */}
                {promoCode && (
                  <div className="border border-dashed border-border p-3 rounded-lg space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-foreground">
                      HOW TO GET BONUS?
                    </div>
                    <div className="text-sm text-foreground">{bonusInstructions || "Message live chat with promo code"}</div>
                    <div className="flex items-center justify-between bg-muted px-3 py-2 rounded-md">
                      <span className="font-bold text-primary">{promoCode}</span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          navigator.clipboard.writeText(promoCode);
                          onCopyCode?.();
                        }}
                        className="h-6 w-6"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    {bonusInstructions && (
                      <button className="text-xs text-primary hover:underline">
                        Show step by step instructions
                      </button>
                    )}
                  </div>
                )}

                {/* Review Link */}
                {reviewLink && (
                  <button
                    onClick={onReadReview}
                    className="text-sm text-foreground hover:underline flex items-center gap-1"
                  >
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Read {casinoName} Casino review
                  </button>
                )}

                {/* Get Bonus Button */}
                <Button
                  onClick={onGetBonus}
                  className="w-full"
                  size="lg"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Get Bonus
                </Button>

                {/* Feedback Section */}
                <div className="space-y-2">
                  <div className="text-sm text-foreground">Has bonus worked for you?</div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onFeedbackYes}
                      className="flex-1"
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Yes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onFeedbackNo}
                      className="flex-1"
                    >
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      No
                    </Button>
                    <Button variant="ghost" size="icon-sm" className="h-8 w-8">
                      <Globe className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
