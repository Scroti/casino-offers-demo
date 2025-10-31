export interface Bonus {
  _id: string;
  title: string;
  description?: { title?: string; subtitle?: string; content?: string };
  price: string;
  rating?: number;
  type: string;
  casinoImage?: string;
  href?: string;
  createdAt?: string;
  updatedAt?: string;
  customSections?: Array<{ title: string; content: string; subtitle?: string; icon?: string }>;
  // Extended fields for full control from backend
  isExclusive?: boolean;
  casinoName?: string;
  casinoLogo?: string;
  safetyIndex?: number;
  countryFlag?: string;
  countryCode?: string;
  promoCode?: string;
  bonusInstructions?: string;
  reviewLink?: string;
  wageringRequirement?: { value?: string; subtitle?: string; content?: string };
  bonusValue?: { value?: string; subtitle?: string; content?: string };
  maxBet?: { value?: string; subtitle?: string; content?: string };
  expiration?: { value?: string; subtitle?: string; content?: string };
  claimSpeed?: { value?: string; subtitle?: string; content?: string };
  termsConditions?: { value?: string; subtitle?: string; content?: string };
}
