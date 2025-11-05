export interface Casino {
  _id?: string;
  
  // General Information
  name: string; // Brand name
  founded?: string;
  url?: string;
  facebook?: string;
  advantages?: string[]; // List of advantages
  affiliateSoftware?: string;
  license?: string;
  owner?: string;
  companyAddress?: string;
  accessibility?: string[];
  mobileApplication?: boolean;
  siteLanguages?: string[];
  currencies?: string[];
  restrictedCountries?: string[];
  availableCountries?: string[];
  wagering?: string;
  partners?: string;
  version?: string;

  // Display/UI fields
  logo?: string;
  image?: string;
  safetyIndex?: number;
  countryFlag?: string;
  countryCode?: string;
  
  // Features/Pros & Cons
  features?: Array<{
    type: 'positive' | 'negative' | 'neutral';
    text: string;
  }>;
  
  // Games Information
  gameProviders?: string[];
  gamesAmount?: string;
  slotGames?: string;
  jackpotGames?: string;
  videoPokerGames?: string;
  scratchGames?: string;
  bingoGames?: string;
  liveGamesAmount?: string;
  sportsBetting?: boolean;
  liveBetting?: boolean;
  virtualSportsBetting?: boolean;
  
  // Available games (for display)
  availableGames?: Array<{
    name: string;
    icon?: string;
    available: boolean;
  }>;

  // Payment Information
  depositMethods?: string[];
  withdrawalMethods?: string[];
  minimalDeposit?: string;
  minimalPayout?: string;
  maxWithdrawalLimitPerMonth?: string;
  withdrawalTime?: string;
  withdrawWithActiveBonus?: boolean;
  withdrawFees?: string;
  
  // Payment methods (for display)
  paymentMethods?: Array<{
    name: string;
  }>;

  // Support Information
  workingHours?: string;
  contactInfo?: string;
  liveChatLanguages?: string[];
  phoneLanguages?: string[];
  emailLanguages?: string[];
  averageContactTime?: string;

  // Languages (for display - consolidated)
  websiteLanguages?: string[];
  customerSupportLanguages?: string[];
  
  // Bonus info (Display)
  bonusText?: string;
  bonusSubtext?: string;
  isExclusive?: boolean;
  
  // Actions
  visitUrl?: string;
  reviewUrl?: string;
  
  createdAt?: string;
  updatedAt?: string;
}
