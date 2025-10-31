"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getPaymentLogo } from "@/lib/payment-logos";
import {
  Globe,
  MessageSquare,
  Headphones,
  Info,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Gift,
  Play,
  BookOpen,
  Zap,
  Target,
  Heart,
  Crown,
  Gem,
  Sparkles,
  Circle,
  X,
} from "lucide-react";
import type { Casino } from "@/app/lib/data-access/models/casino.model";
import { cn } from "@/lib/utils";

// Payment Method Item Component with error handling
function PaymentMethodItem({ 
  payment, 
  logoUrl, 
  textSize, 
  containerClass 
}: { 
  payment: { name: string }; 
  logoUrl: string; 
  textSize: string; 
  containerClass: string;
}) {
  const [imageError, setImageError] = useState(false);
  
  if (!logoUrl || imageError) {
    return (
      <div className={cn("border rounded-md p-0.5 bg-background flex items-center justify-center", containerClass)}>
        <span className={cn("text-center leading-tight text-foreground", textSize)}>{payment.name}</span>
      </div>
    );
  }
  
  return (
    <div className={cn("relative border rounded-md p-0.5 bg-background flex items-center justify-center", containerClass)}>
      <Image
        src={logoUrl}
        alt={payment.name}
        fill
        className="object-contain p-1"
        unoptimized
        onError={() => setImageError(true)}
      />
    </div>
  );
}

interface CasinoCardProps {
  casino: Casino;
  onVisitCasino?: () => void;
  onReadReview?: () => void;
}

// Game icon mapping
const getGameIcon = (gameName: string) => {
  const name = gameName.toLowerCase();
  if (name.includes('slot')) return Zap;
  if (name.includes('roulette')) return Target;
  if (name.includes('blackjack')) return Heart;
  if (name.includes('poker')) return Crown;
  if (name.includes('baccarat')) return Gem;
  if (name.includes('bingo')) return Sparkles;
  if (name.includes('betting') || name.includes('no betting')) return X;
  return Circle;
};

export function CasinoCard({ casino, onVisitCasino, onReadReview }: CasinoCardProps) {
  const router = useRouter();
  const displayedGames = casino.availableGames?.slice(0, 6) || [];
  const allGames = casino.availableGames || [];

  const displayedPayments = casino.paymentMethods?.slice(0, 8) || [];
  const allPayments = casino.paymentMethods || [];

  return (
    <div className="w-full flex flex-col sm:flex-row border border-border rounded-lg overflow-hidden bg-background shadow-sm pb-4">
      {/* Left Section - Logo/Image Full Cover - ~35% on desktop */}
      <div className="relative w-full sm:w-[35%] h-48 sm:h-auto sm:self-stretch overflow-hidden">
        {/* Logo/Image as Background Cover */}
        {casino.logo && casino.logo.startsWith('http') ? (
          <div className="absolute inset-0">
            <Image
              src={casino.logo}
              alt={casino.name}
              fill
              className="object-cover"
              style={{ objectPosition: 'center center' }}
              unoptimized
              priority
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        ) : casino.image && casino.image.startsWith('http') ? (
          <div className="absolute inset-0">
            <Image
              src={casino.image}
              alt={casino.name}
              fill
              className="object-cover"
              style={{ objectPosition: 'center center' }}
              unoptimized
              priority
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-foreground flex items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-1 text-background">
              <div className="text-5xl font-bold leading-none">
                {casino.name.split(' ')[0]?.substring(0, 4).toUpperCase() || casino.name.substring(0, 4).toUpperCase()}
              </div>
              {casino.name.split(' ')[1] && (
                <div 
                  className="text-4xl font-bold leading-none"
                  style={{
                    background: 'linear-gradient(90deg, #ec4899 0%, #f97316 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {casino.name.split(' ')[1]?.substring(0, 4).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

        {/* Right Section - Details - ~60-65% on desktop */}
        <div className="flex-1 p-3 sm:p-4 bg-background pb-4 sm:pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_1.5fr] gap-3 sm:gap-4 h-full">
            {/* Main Info Column - ~62% */}
            <div className="flex flex-col justify-between">
              <div className="space-y-1.5">
                {/* Safety Index - First on Mobile */}
                {casino.safetyIndex && (
                  <div className="flex flex-wrap items-center gap-2 order-first sm:order-none">
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">SAFETY INDEX:</span>
                    <span className="text-sm sm:text-base font-bold text-foreground">{casino.safetyIndex.toFixed(1)}</span>
                    <Badge className="bg-primary text-primary-foreground px-2 py-0.5 text-xs">
                      HIGH
                    </Badge>
                    <Info className="h-3 w-3 sm:h-4 sm:w-4 text-primary cursor-help" />
                  </div>
                )}
                
                {/* Casino Name */}
                <h3 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">{casino.name}</h3>

                {/* Features */}
                {casino.features && casino.features.length > 0 && (
                  <div className="space-y-0.5 mt-1.5">
                    {casino.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[10px] sm:text-xs">
                        {feature.type === 'positive' && (
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        )}
                        {feature.type === 'negative' && (
                          <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                        )}
                        {feature.type === 'neutral' && (
                          <MinusCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        )}
                        <span className={cn(
                          feature.type === 'negative' && 'text-destructive'
                        )}>{feature.text}</span>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* Bonus and Action Buttons - Aligned at bottom */}
              <div className="space-y-2 sm:space-y-3 mt-2 sm:mt-3 pt-2 sm:pt-3 pb-2">
                {casino.bonusText && (
                  <div className="space-y-1 mb-2">
                    {casino.isExclusive && (
                      <Badge className="text-[10px] sm:text-xs bg-primary text-primary-foreground">
                        <Gift className="h-3 w-3 mr-1" />
                        Exclusive Bonus
                      </Badge>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Gift className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary flex-shrink-0" />
                      <span className="text-sm sm:text-base font-bold text-foreground leading-tight">
                        {casino.isExclusive ? 'BONUS:' : ''} {casino.bonusText}
                      </span>
                    </div>
                    {casino.bonusSubtext && (
                      <p className="text-[9px] sm:text-[10px] text-muted-foreground ml-4 sm:ml-5">*{casino.bonusSubtext}</p>
                    )}
                  </div>
                )}
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={() => {
                      if (casino.visitUrl) window.open(casino.visitUrl, '_blank');
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
                      if (casino._id) {
                        router.push(`/casinos/${casino._id}/review`);
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
              </div>
            </div>

            {/* Side Info Column - ~38% */}
            <div className="space-y-2 sm:space-y-3 border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 pl-0 sm:pl-4 mt-3 sm:mt-0">
              {/* Language Options */}
              <div className="space-y-1.5">
                <h4 className="font-semibold text-[10px] sm:text-xs uppercase tracking-wide text-foreground">LANGUAGE OPTIONS:</h4>
                <div className="space-y-1.5 text-[10px] sm:text-xs">
                  {casino.websiteLanguages && casino.websiteLanguages.length > 0 && (
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground">Website:</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-xs sm:text-sm text-primary hover:underline font-medium">
                            {casino.websiteLanguages.length} languages
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[calc(100vw-2rem)] sm:w-48 max-h-64 overflow-y-auto">
                          <div className="p-2 space-y-1">
                            {casino.websiteLanguages.map((lang, idx) => (
                              <div key={idx} className="flex items-center gap-2 py-1 px-2 text-sm">
                                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                                <span>{lang}</span>
                              </div>
                            ))}
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                  {casino.liveChatLanguages && casino.liveChatLanguages.length > 0 && (
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground">Live chat:</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-xs sm:text-sm text-primary hover:underline font-medium">
                            {casino.liveChatLanguages.length} languages
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[calc(100vw-2rem)] sm:w-48 max-h-64 overflow-y-auto">
                          <div className="p-2 space-y-1">
                            {casino.liveChatLanguages.map((lang, idx) => (
                              <div key={idx} className="flex items-center gap-2 py-1 px-2 text-sm">
                                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                                <span>{lang}</span>
                              </div>
                            ))}
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                  {casino.customerSupportLanguages && casino.customerSupportLanguages.length > 0 && (
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Headphones className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground">Customer support:</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-xs sm:text-sm text-primary hover:underline font-medium">
                            {casino.customerSupportLanguages.length} language{casino.customerSupportLanguages.length !== 1 ? 's' : ''}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[calc(100vw-2rem)] sm:w-48 max-h-64 overflow-y-auto">
                          <div className="p-2 space-y-1">
                            {casino.customerSupportLanguages.map((lang, idx) => (
                              <div key={idx} className="flex items-center gap-2 py-1 px-2 text-sm">
                                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                                <span>{lang}</span>
                              </div>
                            ))}
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              </div>

              {/* Available Games */}
              {allGames.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-[10px] sm:text-xs uppercase tracking-wide text-foreground">AVAILABLE GAMES:</h4>
                    {allGames.length > 6 && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-primary hover:underline text-xs font-medium">
                            Show all
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-64 max-h-96 overflow-y-auto">
                          <div className="p-2">
                            <div className="text-xs font-semibold mb-2 pb-1 border-b">Types of games</div>
                            <div className="grid grid-cols-2 sm:grid-cols-2 gap-1">
                              {allGames.map((game, idx) => (
                                <div
                                  key={idx}
                                  className={cn(
                                    "flex items-center gap-1.5 py-1 px-2 text-xs rounded",
                                    !game.available && "opacity-50"
                                  )}
                                >
                                  {game.available ? (
                                    <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                                  ) : (
                                    <MinusCircle className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                  )}
                                  <span>{game.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-3 gap-1 sm:gap-1.5">
                    {displayedGames.map((game, idx) => {
                      const GameIcon = getGameIcon(game.name);
                      return (
                        <div
                          key={idx}
                          className={cn(
                            "flex flex-col items-center justify-center gap-0.5 sm:gap-1 p-1 sm:p-2 rounded-md border bg-background relative",
                            !game.available && "opacity-50"
                          )}
                        >
                          {/* Single checkmark icon in top right corner */}
                          {game.available ? (
                            <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary absolute top-0.5 right-0.5 sm:top-1 sm:right-1 z-10" />
                          ) : (
                            <MinusCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground absolute top-0.5 right-0.5 sm:top-1 sm:right-1 z-10" />
                          )}
                          {/* Game icon centered */}
                          <GameIcon className={cn(
                            "h-5 w-5 sm:h-6 sm:w-6",
                            game.available ? "text-primary" : "text-muted-foreground"
                          )} />
                          <span className="text-[9px] sm:text-[10px] text-center font-medium leading-tight text-foreground">{game.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Payment Methods */}
              {allPayments.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-[10px] sm:text-xs uppercase tracking-wide text-foreground">PAYMENT METHODS:</h4>
                    {allPayments.length > 8 && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-primary hover:underline text-xs font-medium">
                            Show all ({allPayments.length})
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-80 max-h-96 overflow-y-auto">
                          <div className="p-2">
                            <div className="text-xs font-semibold mb-2 pb-1 border-b">
                              Payment methods ({allPayments.length})
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                              {allPayments.map((payment, idx) => {
                                const logoUrl = getPaymentLogo(payment.name);
                                return (
                                  <PaymentMethodItem
                                    key={idx}
                                    payment={payment}
                                    logoUrl={logoUrl}
                                    textSize="text-[10px]"
                                    containerClass="h-12 w-full"
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-4 gap-1 sm:gap-1.5">
                    {displayedPayments.map((payment, idx) => {
                      const logoUrl = getPaymentLogo(payment.name);
                      return (
                        <PaymentMethodItem
                          key={idx}
                          payment={payment}
                          logoUrl={logoUrl}
                          textSize="text-[8px] sm:text-[9px]"
                          containerClass="h-7 sm:h-8 w-full"
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
}
