export interface Casino {
  _id?: string;
  name: string;
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
  
  // Bonus info
  bonusText?: string;
  bonusSubtext?: string;
  isExclusive?: boolean;
  
  // Languages
  websiteLanguages?: string[];
  liveChatLanguages?: string[];
  customerSupportLanguages?: string[];
  
  // Games
  availableGames?: Array<{
    name: string;
    icon?: string;
    available: boolean;
  }>;
  
  // Payment methods - logo is automatically fetched based on name
  paymentMethods?: Array<{
    name: string;
  }>;
  
  // Actions
  visitUrl?: string;
  reviewUrl?: string;
  
  createdAt?: string;
  updatedAt?: string;
}

