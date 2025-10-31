"use client";

import { useGetCasinoByIdQuery } from "@/app/lib/data-access/configs/casinos.config";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import {
  Home,
  Gift,
  Star,
  Shield,
  MessageSquare,
  CreditCard,
  Globe,
  MessageSquareMore,
  HeadphonesIcon as Headphones,
  Info,
  Play,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ExternalLink,
  Camera,
  TrendingUp,
  TrendingDown,
  HelpCircle,
  Zap,
  Target,
  Heart,
  Crown,
  Gem,
  Sparkles,
  X,
  ChevronRight,
} from "lucide-react";
import { getPaymentLogo } from "@/lib/payment-logos";
import PaymentMethodItem from "@/components/ui/payment-method-item";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TabType = "overview" | "bonuses" | "reviews" | "safety" | "discussion" | "payments";

export default function CasinoReviewPage({ casinoId }: { casinoId: string }) {
  const router = useRouter();
  const { data: casino, isLoading, error } = useGetCasinoByIdQuery(casinoId);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading casino review...</p>
        </div>
      </div>
    );
  }

  if (error || !casino) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-screen">
          <p>Casino not found</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview" as TabType, label: "Overview", icon: Home, count: null },
    { id: "bonuses" as TabType, label: "Bonuses", icon: Gift, count: casino.bonusText ? 6 : 0 },
    { id: "reviews" as TabType, label: "User reviews", icon: Star, count: 142 },
    { id: "safety" as TabType, label: "Safety Index explained", icon: Shield, count: null },
    { id: "discussion" as TabType, label: "Discussion", icon: MessageSquare, count: 266 },
    { id: "payments" as TabType, label: "Payment methods", icon: CreditCard, count: casino.paymentMethods?.length || 0 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <div className="border-b bg-muted/50 sticky top-0 z-10">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold">{casino.name}</h2>
            </div>
            <div className="flex flex-wrap items-center gap-1 overflow-x-auto w-full sm:w-auto -mx-2 px-2 sm:mx-0 sm:px-0">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-1 sm:gap-2 text-xs sm:text-sm",
                      activeTab === tab.id && "bg-primary text-primary-foreground"
                    )}
                  >
                    <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                    {tab.count !== null && tab.count > 0 && (
                      <Badge variant="secondary" className="ml-1 text-[10px] sm:text-xs">
                        {tab.count}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 sm:gap-6">
          {/* Left Sidebar */}
          <aside className="space-y-4 order-1">
            <Card className="p-3 sm:p-4">
              {/* Casino Logo */}
              <div className="flex flex-col items-center mb-3 sm:mb-4">
                {casino.logo && casino.logo.startsWith('http') ? (
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-2">
                    <Image
                      src={casino.logo}
                      alt={casino.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-foreground text-background flex items-center justify-center rounded-lg mb-2">
                    <span className="text-xl sm:text-2xl font-bold">
                      {casino.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <h3 className="text-xs sm:text-sm font-semibold text-center">{casino.name} Review</h3>
              </div>

              {/* Rating */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mb-3">
                <div className="bg-primary text-primary-foreground px-3 py-2 sm:px-4 sm:py-3 rounded-lg flex items-center gap-2">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                  <span className="text-xl sm:text-2xl font-bold">
                    {casino.safetyIndex ? casino.safetyIndex.toFixed(1) : '8.7'}/10
                  </span>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="text-[10px] sm:text-xs font-semibold mb-1">SAFETY INDEX</div>
                  <Badge className="bg-primary text-primary-foreground text-[10px] sm:text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    HIGH
                  </Badge>
                  <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">by Casino Guru</div>
                  <Badge variant="outline" className="mt-1 text-[10px] sm:text-xs">FAIR SAFE</Badge>
                </div>
              </div>

              {/* User Feedback */}
              <div className="space-y-2 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-xs font-semibold">USER FEEDBACK:</span>
                  <span className="text-[10px] sm:text-xs">MIXED</span>
                  <Info className="h-3 w-3 text-muted-foreground" />
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">Rated by 142 users</div>
              </div>

              {/* Player Acceptance */}
              <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b">
                <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                <span className="text-[10px] sm:text-xs">Accepts players from Romania</span>
                <span className="text-base sm:text-lg">🇷🇴</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 mb-3 sm:mb-4">
                <Button
                  className="w-full bg-primary text-primary-foreground text-xs sm:text-sm"
                  size="sm"
                  onClick={() => {
                    if (casino.visitUrl) window.open(casino.visitUrl, '_blank');
                  }}
                >
                  <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Visit Casino
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full text-xs sm:text-sm"
                  size="sm"
                  onClick={() => router.push('/casinos')}
                >
                  Browse recommended casinos
                </Button>
              </div>

              {/* Payment Methods */}
              {casino.paymentMethods && casino.paymentMethods.length > 0 && (
                <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[10px] sm:text-xs font-semibold uppercase">PAYMENT METHODS:</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-[10px] sm:text-xs h-auto p-0"
                      onClick={() => setActiveTab('payments')}
                    >
                      Show all ({casino.paymentMethods.length})
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
                    {casino.paymentMethods.slice(0, 8).map((payment: any, idx: number) => (
                      <PaymentMethodItem
                        key={idx}
                        payment={payment}
                        logoUrl={getPaymentLogo(payment.name)}
                        textSize="text-[7px] sm:text-[8px]"
                        containerClass="h-8 sm:h-10 w-full"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Withdrawal Limits */}
              <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b">
                <div className="text-[10px] sm:text-xs font-semibold mb-1">WITHDRAWAL LIMITS</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">per day</div>
                <div className="text-xs sm:text-sm font-bold">€1,500</div>
              </div>

              {/* Company Information */}
              <div className="space-y-2 sm:space-y-3 text-[10px] sm:text-xs">
                <div>
                  <div className="font-semibold mb-1">OWNER:</div>
                  <div className="text-muted-foreground">Sprut Group B.V.</div>
                </div>
                <div>
                  <div className="font-semibold mb-1">OPERATOR:</div>
                  <div className="text-muted-foreground">Sprut Group B.V.</div>
                </div>
                <div>
                  <div className="font-semibold mb-1">ESTABLISHED:</div>
                  <div className="text-muted-foreground">2018</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 font-semibold mb-1">
                    ESTIMATED ANNUAL REVENUES:
                    <Info className="h-3 w-3" />
                  </div>
                  <div className="text-muted-foreground">&gt; 20,000,000 lei</div>
                </div>
                <div className="pt-2 sm:pt-3 border-t">
                  <div className="font-semibold mb-2">LICENSING AUTHORITIES:</div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-muted-foreground">Curaçao (GCB)</span>
                  </div>
                </div>
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="space-y-4 sm:space-y-6 order-2">
            {activeTab === "overview" && <OverviewTab casino={casino} />}
            {activeTab === "bonuses" && <BonusesTab casino={casino} />}
            {activeTab === "reviews" && <ReviewsTab casino={casino} />}
            {activeTab === "safety" && <SafetyTab casino={casino} />}
            {activeTab === "discussion" && <DiscussionTab casino={casino} />}
            {activeTab === "payments" && <PaymentsTab casino={casino} />}
          </main>
        </div>
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ casino }: { casino: any }) {
  return (
    <div className="space-y-6">
      {/* Review Introduction */}
      <Card className="p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">{casino.name} Review</h1>
        <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
          Our review team has evaluated this casino according to our casino review methodology.
          We've considered the casino's terms and conditions, licenses, player complaints, customer
          support, fairness of games and many other factors. Read more about how we review online
          casinos.
        </p>
        <Button variant="link" className="p-0 text-sm">
          Read more
        </Button>
      </Card>

      {/* Bonuses Section */}
      {casino.bonusText && (
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <h2 className="text-xl sm:text-2xl font-bold">Bonuses</h2>
            </div>
          </div>
          <div className="space-y-4">
            {casino.isExclusive && (
              <div className="border-l-4 border-primary pl-4 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-primary text-primary-foreground">NO DEPOSIT BONUS</Badge>
                </div>
                <p className="font-semibold">{casino.bonusText}</p>
                {casino.bonusSubtext && (
                  <p className="text-sm text-muted-foreground">no deposit, €0.1/spin</p>
                )}
                <Button variant="link" className="p-0 mt-2">
                  Bonus T&C
                </Button>
              </div>
            )}
            <div className="border-l-4 border-primary pl-4 py-2">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-primary text-primary-foreground">DEPOSIT BONUS</Badge>
              </div>
              <p className="font-semibold">100% up to €300 and 30 extra spins (€0.1/spin)</p>
              <Button variant="link" className="p-0 mt-2">
                Bonus T&C
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Games Section */}
      {casino.availableGames && casino.availableGames.length > 0 && (
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <h2 className="text-xl sm:text-2xl font-bold">Games</h2>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                  Show all
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-80 max-h-96 overflow-y-auto">
                <div className="p-2">
                  <div className="text-xs font-semibold mb-2 pb-1 border-b">
                    Available Games ({casino.availableGames.length})
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {casino.availableGames.map((game: any, idx: number) => {
                      const GameIcon = getGameIcon(game.name);
                      return (
                        <div
                          key={idx}
                          className={cn(
                            "flex flex-col items-center gap-1 p-2 rounded-md border bg-background relative",
                            !game.available && "opacity-50"
                          )}
                        >
                          {game.available ? (
                            <CheckCircle2 className="h-3 w-3 text-primary absolute top-1 right-1 z-10" />
                          ) : (
                            <MinusCircle className="h-3 w-3 text-muted-foreground absolute top-1 right-1 z-10" />
                          )}
                          <GameIcon className={cn(
                            "h-6 w-6",
                            game.available ? "text-primary" : "text-muted-foreground"
                          )} />
                          <span className="text-[10px] text-center font-medium leading-tight text-foreground">{game.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
            {casino.availableGames.slice(0, 9).map((game: any, idx: number) => {
              const GameIcon = getGameIcon(game.name);
              return (
                <div
                  key={idx}
                  className={cn(
                    "flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-3 rounded-md border bg-background relative",
                    !game.available && "opacity-50"
                  )}
                >
                  {game.available ? (
                    <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-primary absolute top-0.5 right-0.5 sm:top-1 sm:right-1 z-10" />
                  ) : (
                    <MinusCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground absolute top-0.5 right-0.5 sm:top-1 sm:right-1 z-10" />
                  )}
                  <GameIcon className={cn(
                    "h-6 w-6 sm:h-8 sm:w-8",
                    game.available ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className="text-[10px] sm:text-xs text-center font-medium text-foreground leading-tight">{game.name}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Language Options */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          <h2 className="text-xl sm:text-2xl font-bold">Language options</h2>
        </div>
        <div className="space-y-3">
          {casino.websiteLanguages && casino.websiteLanguages.length > 0 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-2 sm:p-3 border rounded-md">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg">🇷🇴</span>
                <span className="text-sm sm:text-base">Romanian website</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
                    All languages ({casino.websiteLanguages.length})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-64 max-h-96 overflow-y-auto">
                  <div className="p-2 space-y-1">
                    <div className="text-xs font-semibold mb-2 pb-1 border-b">
                      Website Languages ({casino.websiteLanguages.length})
                    </div>
                    {casino.websiteLanguages.map((lang: string, idx: number) => (
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-2 sm:p-3 border rounded-md">
              <div className="flex items-center gap-2">
                <Headphones className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-sm sm:text-base">English customer support</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
                    All languages ({casino.customerSupportLanguages.length})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-64 max-h-96 overflow-y-auto">
                  <div className="p-2 space-y-1">
                    <div className="text-xs font-semibold mb-2 pb-1 border-b">
                      Customer Support Languages ({casino.customerSupportLanguages.length})
                    </div>
                    {casino.customerSupportLanguages.map((lang: string, idx: number) => (
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-2 sm:p-3 border rounded-md">
              <div className="flex items-center gap-2">
                <MessageSquareMore className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-sm sm:text-base">English live chat</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
                    All languages ({casino.liveChatLanguages.length})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-64 max-h-96 overflow-y-auto">
                  <div className="p-2 space-y-1">
                    <div className="text-xs font-semibold mb-2 pb-1 border-b">
                      Live Chat Languages ({casino.liveChatLanguages.length})
                    </div>
                    {casino.liveChatLanguages.map((lang: string, idx: number) => (
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
      </Card>

      {/* Game Providers */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <h2 className="text-xl sm:text-2xl font-bold">Game providers</h2>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                Show all (149)
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-96 max-h-96 overflow-y-auto">
              <div className="p-2">
                <div className="text-xs font-semibold mb-2 pb-1 border-b">
                  Game Providers (149)
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {['NETENT', 'NOLIMIT', 'Yggdrasil', 'Blueprint', 'Evolution', 'Pragmatic', 'Microgaming', 'Betsoft', 'Playtech', 'IGT', 'Red Tiger', 'Thunderkick'].map((provider, idx) => (
                    <div key={idx} className="border rounded-md p-2 bg-muted/50 flex items-center justify-center h-12 sm:h-16">
                      <span className="text-[10px] sm:text-xs font-semibold text-center leading-tight">{provider}</span>
                    </div>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          {['NETENT', 'NOLIMIT', 'Yggdrasil', 'Blueprint', 'Evolution', 'Pragmatic'].map((provider, idx) => (
            <div key={idx} className="border rounded-md p-2 sm:p-3 bg-muted/50 flex items-center justify-center h-12 sm:h-16">
              <span className="text-[10px] sm:text-xs font-semibold text-center leading-tight">{provider}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Casino Screenshots */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Camera className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          <h2 className="text-xl sm:text-2xl font-bold">Casino screenshots</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="relative aspect-video bg-muted rounded-md overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 flex items-center justify-center bg-muted/80">
                <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="sm" variant="secondary" className="h-7 w-7 sm:h-9 sm:w-9 p-0">
                  <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Positives, Negatives, Interesting Facts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Positives */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <h3 className="text-lg sm:text-xl font-bold">POSITIVES</h3>
          </div>
          <ul className="space-y-2">
            {casino.features?.filter((f: any) => f.type === 'positive').length > 0 ? (
              casino.features.filter((f: any) => f.type === 'positive').map((feature: any, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{feature.text}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">No positive features listed</li>
            )}
          </ul>
        </Card>

        {/* Negatives */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
            <h3 className="text-lg sm:text-xl font-bold">NEGATIVES</h3>
          </div>
          <ul className="space-y-2">
            {casino.features?.filter((f: any) => f.type === 'negative').length > 0 ? (
              casino.features.filter((f: any) => f.type === 'negative').map((feature: any, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <span>{feature.text}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">No negative features listed</li>
            )}
          </ul>
        </Card>

        {/* Interesting Facts */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            <h3 className="text-lg sm:text-xl font-bold">INTERESTING FACTS</h3>
          </div>
          <ul className="space-y-2">
            {casino.features?.filter((f: any) => f.type === 'neutral').length > 0 ? (
              casino.features.filter((f: any) => f.type === 'neutral').map((feature: any, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span>{feature.text}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">No interesting facts listed</li>
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}

// Bonuses Tab Component
function BonusesTab({ casino }: { casino: any }) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Bonuses</h2>
      <p className="text-muted-foreground">Bonuses content will go here...</p>
    </Card>
  );
}

// Reviews Tab Component
function ReviewsTab({ casino }: { casino: any }) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">User reviews</h2>
      <p className="text-muted-foreground">User reviews content will go here...</p>
    </Card>
  );
}

// Safety Tab Component
function SafetyTab({ casino }: { casino: any }) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Safety Index explained</h2>
      <p className="text-muted-foreground">Safety index explanation will go here...</p>
    </Card>
  );
}

// Discussion Tab Component
function DiscussionTab({ casino }: { casino: any }) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Discussion</h2>
      <p className="text-muted-foreground">Discussion content will go here...</p>
    </Card>
  );
}

// Payments Tab Component
function PaymentsTab({ casino }: { casino: any }) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Payment methods</h2>
      <div className="grid grid-cols-4 gap-3">
        {casino.paymentMethods?.map((payment: any, idx: number) => (
          <PaymentMethodItem
            key={idx}
            payment={payment}
            logoUrl={getPaymentLogo(payment.name)}
            textSize="text-xs"
            containerClass="h-16 w-full"
          />
        ))}
      </div>
    </Card>
  );
}

// Helper function for game icons
function getGameIcon(gameName: string) {
  const name = gameName.toLowerCase();
  if (name.includes('slot')) return Zap;
  if (name.includes('roulette')) return Target;
  if (name.includes('blackjack')) return Heart;
  if (name.includes('poker')) return Crown;
  if (name.includes('baccarat')) return Gem;
  if (name.includes('bingo')) return Sparkles;
  return X;
}

